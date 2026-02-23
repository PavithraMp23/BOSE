import * as React from "react"

export interface TabsProps {
  value: string
  onValueChange: (value: string) => void
  children: React.ReactNode
  className?: string
}

export function Tabs({ value, onValueChange, children, className = "" }: TabsProps) {
  return (
    <div className={className} data-value={value}>
      {React.Children.map(children, child => {
        if (React.isValidElement(child)) {
          return React.cloneElement(child as React.ReactElement<any>, { value, onValueChange })
        }
        return child
      })}
    </div>
  )
}

export interface TabsListProps {
  children: React.ReactNode
  className?: string
  value?: string
  onValueChange?: (value: string) => void
}

export function TabsList({ children, className = "", value, onValueChange }: TabsListProps) {
  return (
    <div className={`inline-flex h-10 items-center justify-center rounded-md bg-slate-100 p-1 text-slate-500 dark:bg-slate-800 dark:text-slate-400 ${className}`}>
      {React.Children.map(children, child => {
        if (React.isValidElement(child)) {
          return React.cloneElement(child as React.ReactElement<any>, { 
            currentValue: value, 
            onValueChange 
          })
        }
        return child
      })}
    </div>
  )
}

export interface TabsTriggerProps {
  value: string
  children: React.ReactNode
  className?: string
  currentValue?: string
  onValueChange?: (value: string) => void
}

export function TabsTrigger({ 
  value, 
  children, 
  className = "", 
  currentValue, 
  onValueChange 
}: TabsTriggerProps) {
  const isActive = currentValue === value
  
  return (
    <button
      type="button"
      onClick={() => onValueChange?.(value)}
      className={`
        inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium 
        ring-offset-white transition-all focus-visible:outline-none focus-visible:ring-2 
        focus-visible:ring-slate-950 focus-visible:ring-offset-2 disabled:pointer-events-none 
        disabled:opacity-50 dark:ring-offset-slate-950 dark:focus-visible:ring-slate-300
        ${isActive 
          ? 'bg-white text-slate-950 shadow-sm dark:bg-slate-950 dark:text-slate-50' 
          : 'hover:bg-slate-200 dark:hover:bg-slate-700'
        }
        ${className}
      `}
    >
      {children}
    </button>
  )
}

export interface TabsContentProps {
  value: string
  children: React.ReactNode
  className?: string
}

export function TabsContent({ value, children, className = "" }: TabsContentProps & { value?: string }) {
  const parentValue = (React.useContext(React.createContext({ value: '' })) as any)?.value
  const currentValue = parentValue || value
  
  // Get the actual current value from parent
  const tabsElement = React.useRef<HTMLDivElement>(null)
  const [isActive, setIsActive] = React.useState(false)
  
  React.useEffect(() => {
    const parent = tabsElement.current?.closest('[data-value]')
    if (parent) {
      const parentVal = parent.getAttribute('data-value')
      setIsActive(parentVal === value)
    }
  }, [value, currentValue])
  
  if (!isActive) return null
  
  return (
    <div ref={tabsElement} className={className}>
      {children}
    </div>
  )
}

