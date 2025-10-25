"use client"

import { Users, DollarSign, UtensilsCrossed, TrendingDown } from "lucide-react"
import { Button } from "@/components/ui/button"

type Page = "employees" | "accounts" | "meal-plan" | "cost-tracking"

interface SidebarProps {
  currentPage: Page
  onPageChange: (page: Page) => void
}

export function Sidebar({ currentPage, onPageChange }: SidebarProps) {
  const menuItems = [
    { id: "employees", label: "Employees", icon: Users },
    { id: "accounts", label: "Accounts", icon: DollarSign },
    { id: "meal-plan", label: "Meal Plan", icon: UtensilsCrossed },
    { id: "cost-tracking", label: "Cost Tracking", icon: TrendingDown },
  ] as const

  return (
    <aside className="w-64 bg-sidebar border-r border-sidebar-border flex flex-col">
      <div className="p-6 border-b border-sidebar-border">
        <h1 className="text-2xl font-bold text-sidebar-foreground">Meal Manager</h1>
      </div>

      <nav className="flex-1 p-4 space-y-2">
        {menuItems.map((item) => {
          const Icon = item.icon
          const isActive = currentPage === item.id
          return (
            <Button
              key={item.id}
              variant={isActive ? "default" : "ghost"}
              className="w-full justify-start gap-3"
              onClick={() => onPageChange(item.id as Page)}
            >
              <Icon className="w-5 h-5" />
              <span>{item.label}</span>
            </Button>
          )
        })}
      </nav>

      <div className="p-4 border-t border-sidebar-border text-xs text-sidebar-foreground/60">
        <p>Meal Management System v1.0</p>
      </div>
    </aside>
  )
}
