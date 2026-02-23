import { create } from 'zustand';

interface Credential {
  credentialId: string;
  studentId: string;
  dataHash: string;
  issuer: string;
  issuedAt: string;
  status: string;
}

interface StoreState {
  // Credentials
  credentials: Credential[];
  setCredentials: (credentials: Credential[]) => void;
  addCredential: (credential: Credential) => void;
  updateCredential: (id: string, updates: Partial<Credential>) => void;
  
  // UI State
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  
  // Analytics Cache
  analyticsData: any;
  setAnalyticsData: (data: any) => void;
  
  // Real-time events
  recentEvents: any[];
  addEvent: (event: any) => void;
}

export const useStore = create<StoreState>((set, get) => ({
  // Credentials state
  credentials: [],
  setCredentials: (credentials) => set({ credentials }),
  addCredential: (credential) => set((state) => ({
    credentials: [credential, ...state.credentials]
  })),
  updateCredential: (id, updates) => set((state) => ({
    credentials: state.credentials.map(cred =>
      cred.credentialId === id ? { ...cred, ...updates } : cred
    )
  })),
  
  // UI state
  sidebarOpen: true,
  setSidebarOpen: (open) => set({ sidebarOpen: open }),
  
  // Analytics
  analyticsData: null,
  setAnalyticsData: (data) => set({ analyticsData: data }),
  
  // Events
  recentEvents: [],
  addEvent: (event) => set((state) => ({
    recentEvents: [event, ...state.recentEvents.slice(0, 49)] // Keep last 50 events
  }))
}));