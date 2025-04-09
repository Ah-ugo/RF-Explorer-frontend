"use client";

import * as React from "react";
import { cn } from "../../lib/utils";

const SidebarContext = React.createContext({
  isOpen: true,
  setIsOpen: () => {},
});

export function SidebarProvider({ children, defaultOpen = true }) {
  const [isOpen, setIsOpen] = React.useState(defaultOpen);

  return (
    <SidebarContext.Provider value={{ isOpen, setIsOpen }}>
      <div className="grid md:grid-cols-[auto_1fr] min-h-screen">
        {children}
      </div>
    </SidebarContext.Provider>
  );
}

export function Sidebar({ className, children, ...props }) {
  const { isOpen } = React.useContext(SidebarContext);

  return (
    <div
      className={cn(
        "border-r bg-background transition-all duration-300 ease-in-out",
        isOpen ? "w-64" : "w-16",
        className
      )}
      {...props}
    >
      <div className="flex h-full flex-col">{children}</div>
    </div>
  );
}

export function SidebarHeader({ className, children, ...props }) {
  return (
    <div className={cn("border-b px-4 py-3", className)} {...props}>
      {children}
    </div>
  );
}

export function SidebarContent({ className, children, ...props }) {
  return (
    <div className={cn("flex-1 overflow-auto", className)} {...props}>
      {children}
    </div>
  );
}

export function SidebarTrigger({ className, ...props }) {
  const { isOpen, setIsOpen } = React.useContext(SidebarContext);

  return (
    <button
      type="button"
      onClick={() => setIsOpen(!isOpen)}
      className={cn("p-2 rounded-md hover:bg-muted", className)}
      {...props}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="h-5 w-5"
      >
        <rect width="18" height="18" x="3" y="3" rx="2" ry="2" />
        <line x1="9" x2="9" y1="3" y2="21" />
      </svg>
      <span className="sr-only">Toggle Sidebar</span>
    </button>
  );
}

export function SidebarInset({ className, children, ...props }) {
  return (
    <div className={cn("flex flex-col flex-1", className)} {...props}>
      {children}
    </div>
  );
}

export function SidebarGroup({ className, children, ...props }) {
  return (
    <div className={cn("py-2", className)} {...props}>
      {children}
    </div>
  );
}

export function SidebarGroupLabel({ className, children, ...props }) {
  const { isOpen } = React.useContext(SidebarContext);

  if (!isOpen) return null;

  return (
    <div
      className={cn(
        "px-4 py-1 text-xs font-medium text-muted-foreground",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export function SidebarGroupContent({ className, children, ...props }) {
  return (
    <div className={cn("space-y-1", className)} {...props}>
      {children}
    </div>
  );
}

export function SidebarMenu({ className, children, ...props }) {
  return (
    <ul className={cn("space-y-1 px-2", className)} {...props}>
      {children}
    </ul>
  );
}

export function SidebarMenuItem({ className, children, ...props }) {
  return (
    <li className={cn("", className)} {...props}>
      {children}
    </li>
  );
}

export function SidebarMenuButton({
  className,
  children,
  isActive,
  asChild,
  ...props
}) {
  const { isOpen } = React.useContext(SidebarContext);

  return (
    <button
      className={cn(
        "flex items-center gap-2 w-full rounded-md px-2 py-1.5 text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
        isActive
          ? "bg-accent text-accent-foreground hover:bg-accent/80"
          : "hover:bg-muted hover:text-accent-foreground",
        !isOpen && "justify-center",
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}

export function SidebarRail({ className, ...props }) {
  return (
    <div
      className={cn(
        "absolute inset-y-0 right-0 w-[1px] bg-border translate-x-[0.5px]",
        className
      )}
      {...props}
    />
  );
}
