"use client"

import { useState } from "react"
import { Sidebar } from "./sidebar"
import { EmployeesPage } from "@/components/pages/employees-page"
import { AccountsPage } from "@/components/pages/accounts-page"
import { MealPlanPage } from "@/components/pages/meal-plan-page"
import { CostTrackingPage } from "@/components/pages/cost-tracking-page"

type Page = "employees" | "accounts" | "meal-plan" | "cost-tracking"

export function MainLayout() {
  const [currentPage, setCurrentPage] = useState<Page>("employees")

  const renderPage = () => {
    switch (currentPage) {
      case "employees":
        return <EmployeesPage />
      case "accounts":
        return <AccountsPage />
      case "meal-plan":
        return <MealPlanPage />
      case "cost-tracking":
        return <CostTrackingPage />
      default:
        return <EmployeesPage />
    }
  }

  return (
    <div className="flex h-screen bg-background">
      <Sidebar currentPage={currentPage} onPageChange={setCurrentPage} />
      <main className="flex-1 overflow-auto">{renderPage()}</main>
    </div>
  )
}
