"use client"

import { MealManagementProvider } from "@/context/meal-context"
import { MainLayout } from "@/components/layout/main-layout"

export default function Home() {
  return (
    <MealManagementProvider>
      <MainLayout />
    </MealManagementProvider>
  )
}
