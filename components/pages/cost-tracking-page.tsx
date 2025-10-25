"use client"

import { useState } from "react"
import { useMealContext } from "@/context/meal-context"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export function CostTrackingPage() {
  const { employees, mealCosts, getEmployeeBalance, getEmployeeMealCosts } = useMealContext()
  const [selectedMonth, setSelectedMonth] = useState(new Date().toISOString().slice(0, 7))

  const getEmployeeCostsForMonth = (employeeId: string) => {
    return mealCosts.filter((m) => m.employeeId === employeeId && m.date.startsWith(selectedMonth))
  }

  const getEmployeeDepositsForMonth = (employeeId: string) => {
    // This would need to be passed from context, for now we'll calculate from balance
    const balance = getEmployeeBalance(employeeId, selectedMonth)
    const costs = getEmployeeMealCosts(employeeId, selectedMonth)
    return balance + costs
  }

  return (
    <div className="p-8">
      <div className="max-w-6xl">
        <h1 className="text-3xl font-bold mb-8 text-foreground">Cost Tracking</h1>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Select Month</CardTitle>
          </CardHeader>
          <CardContent>
            <input
              type="month"
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              className="px-4 py-2 border border-input rounded-md"
            />
          </CardContent>
        </Card>

        <div className="grid gap-6">
          {employees.length === 0 ? (
            <Card>
              <CardContent className="pt-6">
                <p className="text-center text-muted-foreground">No employees to track</p>
              </CardContent>
            </Card>
          ) : (
            employees.map((employee) => {
              const balance = getEmployeeBalance(employee.id, selectedMonth)
              const totalCosts = getEmployeeMealCosts(employee.id, selectedMonth)
              const totalDeposits = getEmployeeDepositsForMonth(employee.id)
              const costs = getEmployeeCostsForMonth(employee.id)

              return (
                <Card key={employee.id}>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <span>{employee.name}</span>
                      <span className={`text-2xl font-bold ${balance >= 0 ? "text-green-600" : "text-red-600"}`}>
                        BDT {balance.toFixed(2)}
                      </span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-3 gap-4 mb-6">
                      <div className="p-4 bg-blue-50 rounded-lg">
                        <p className="text-sm text-muted-foreground">Total Deposits</p>
                        <p className="text-2xl font-bold text-blue-600">BDT {totalDeposits.toFixed(2)}</p>
                      </div>
                      <div className="p-4 bg-red-50 rounded-lg">
                        <p className="text-sm text-muted-foreground">Total Meal Costs</p>
                        <p className="text-2xl font-bold text-red-600">BDT {totalCosts.toFixed(2)}</p>
                      </div>
                      <div className={`p-4 rounded-lg ${balance >= 0 ? "bg-green-50" : "bg-orange-50"}`}>
                        <p className="text-sm text-muted-foreground">Balance</p>
                        <p className={`text-2xl font-bold ${balance >= 0 ? "text-green-600" : "text-orange-600"}`}>
                          BDT {balance.toFixed(2)}
                        </p>
                      </div>
                    </div>

                    {costs.length > 0 && (
                      <div>
                        <h3 className="font-semibold text-foreground mb-3">Meal Cost Breakdown</h3>
                        <div className="space-y-2">
                          {costs.map((cost) => (
                            <div key={cost.id} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                              <div>
                                <p className="font-medium text-foreground">{cost.date}</p>
                                <p className="text-sm text-muted-foreground">
                                  {cost.mealCount} meals @ BDT {cost.costPerMeal.toFixed(2)}/meal
                                </p>
                              </div>
                              <p className="font-semibold text-foreground">BDT {cost.totalMealCost.toFixed(2)}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {costs.length === 0 && (
                      <p className="text-center text-muted-foreground">No meal costs for this month</p>
                    )}
                  </CardContent>
                </Card>
              )
            })
          )}
        </div>
      </div>
    </div>
  )
}
