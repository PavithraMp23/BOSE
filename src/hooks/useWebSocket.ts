import { useEffect, useState, useRef } from 'react';

interface WebSocketMessage {
  type: string;
  eventName?: string;
  data?: any;
  timestamp: string;
}

export function useWebSocket(url: string) {
  const [messages, setMessages] = useState<WebSocketMessage[]>([]);
  const [connectionStatus, setConnectionStatus] = useState<'connecting' | 'connected' | 'disconnected'>('disconnected');
  const wsRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    const connect = () => {
      setConnectionStatus('connecting');
      
      const ws = new WebSocket(url.replace('http', 'ws'));
      wsRef.current = ws;

      ws.onopen = () => {
        setConnectionStatus('connected');
        console.log('🔗 WebSocket connected to BOSE event stream');
      };

      ws.onmessage = (event) => {
        try {
          const message = JSON.parse(event.data);
          setMessages(prev => [message, ...prev.slice(0, 99)]); // Keep last 100 messages
        } catch (error) {
          console.error('Error parsing WebSocket message:', error);
        }
      };

      ws.onclose = () => {
        setConnectionStatus('disconnected');
        console.log('🔌 WebSocket disconnected');
        
        // Attempt to reconnect after 5 seconds
        setTimeout(connect, 5000);
      };

      ws.onerror = (error) => {
        console.error('WebSocket error:', error);
        setConnectionStatus('disconnected');
      };
    };

    connect();

    return () => {
      if (wsRef.current) {
        wsRef.current.close();
      }
    };
  }, [url]);

  const sendMessage = (message: any) => {
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify(message));
    }
  };

  return {
    messages,
    connectionStatus,
    sendMessage
  };
}