"use client"

import { useState } from "react"
import { useMealContext } from "@/context/meal-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { AlertCircle } from "lucide-react"

export function MealPlanPage() {
  const { employees, mealEntries, addMealEntry, addMealCost } = useMealContext()
  const [date, setDate] = useState(new Date().toISOString().split("T")[0])
  const [totalMealCost, setTotalMealCost] = useState("")
  const [step, setStep] = useState<"cost" | "meals">("cost")
  const [mealSelections, setMealSelections] = useState<Record<string, { lunch: boolean; dinner: boolean }>>({})

  const initializeMealSelections = () => {
    const selections: Record<string, { lunch: boolean; dinner: boolean }> = {}
    employees.forEach((emp) => {
      const existing = mealEntries.find((m) => m.employeeId === emp.id && m.date === date)
      selections[emp.id] = {
        lunch: existing ? existing.lunch > 0 : false,
        dinner: existing ? existing.dinner > 0 : false,
      }
    })
    setMealSelections(selections)
  }

  const handleSubmitCost = () => {
    if (totalMealCost && Number.parseFloat(totalMealCost) > 0) {
      initializeMealSelections()
      setStep("meals")
    }
  }

  const handleToggleMeal = (employeeId: string, mealType: "lunch" | "dinner") => {
    setMealSelections((prev) => ({
      ...prev,
      [employeeId]: {
        ...prev[employeeId],
        [mealType]: !prev[employeeId]?.[mealType],
      },
    }))
  }

  const handleSubmitMeals = () => {
    const selectedEmployees = Object.entries(mealSelections).filter(([_, meals]) => meals.lunch || meals.dinner)

    if (selectedEmployees.length === 0) {
      alert("Please select at least one meal for an employee")
      return
    }

    selectedEmployees.forEach(([employeeId, meals]) => {
      addMealEntry(employeeId, date, meals.lunch ? 1 : 0, meals.dinner ? 1 : 0)
    })

    const totalMealCount = selectedEmployees.reduce(
      (sum, [_, meals]) => sum + (meals.lunch ? 1 : 0) + (meals.dinner ? 1 : 0),
      0,
    )

    selectedEmployees.forEach(([employeeId, meals]) => {
      const employeeMealCount = (meals.lunch ? 1 : 0) + (meals.dinner ? 1 : 0)
      const employeeCost = (Number.parseFloat(totalMealCost) / totalMealCount) * employeeMealCount
      addMealCost(employeeId, date, employeeCost, employeeMealCount)
    })

    setTotalMealCost("")
    setStep("cost")
    setMealSelections({})
  }

  const calculateEmployeeCost = (employeeId: string): number => {
    const meals = mealSelections[employeeId]
    if (!meals) return 0
    const mealCount = (meals.lunch ? 1 : 0) + (meals.dinner ? 1 : 0)
    if (mealCount === 0) return 0

    const totalMealCount = Object.values(mealSelections).reduce(
      (sum, m) => sum + (m.lunch ? 1 : 0) + (m.dinner ? 1 : 0),
      0,
    )

    return (Number.parseFloat(totalMealCost) / totalMealCount) * mealCount
  }

  return (
    <div className="p-8">
      <div className="max-w-6xl">
        <h1 className="text-3xl font-bold mb-8 text-foreground">Meal Planning</h1>

        {/* Step 1: Submit Daily Meal Cost */}
        {step === "cost" && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Step 1: Submit Daily Meal Cost</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-foreground">Date</label>
                  <Input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="mt-1" />
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground">Total Daily Meal Cost (BDT)</label>
                  <Input
                    type="number"
                    placeholder="Enter total cost for the day"
                    value={totalMealCost}
                    onChange={(e) => setTotalMealCost(e.target.value)}
                    className="mt-1"
                    min="0"
                    step="0.01"
                  />
                </div>
                <Button onClick={handleSubmitCost} className="w-full" size="lg">
                  Next: Select Employee Meals
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step 2: Select Employee Meals */}
        {step === "meals" && (
          <>
            <Card className="mb-8">
              <CardHeader>
                <CardTitle>Step 2: Select Employee Meals for {date}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {/* Meal Selection Table */}
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-border">
                          <th className="text-left py-3 px-4 font-semibold text-foreground">Employee</th>
                          <th className="text-center py-3 px-4 font-semibold text-foreground">Lunch</th>
                          <th className="text-center py-3 px-4 font-semibold text-foreground">Dinner</th>
                          <th className="text-right py-3 px-4 font-semibold text-foreground">Meal Cost (BDT)</th>
                        </tr>
                      </thead>
                      <tbody>
                        {employees.map((emp) => (
                          <tr key={emp.id} className="border-b border-border hover:bg-muted/50">
                            <td className="py-3 px-4">
                              <div>
                                <p className="font-medium text-foreground">{emp.name}</p>
                                <p className="text-xs text-muted-foreground capitalize">{emp.type}</p>
                              </div>
                            </td>
                            <td className="py-3 px-4 text-center">
                              <Checkbox
                                checked={mealSelections[emp.id]?.lunch || false}
                                onCheckedChange={() => handleToggleMeal(emp.id, "lunch")}
                              />
                            </td>
                            <td className="py-3 px-4 text-center">
                              <Checkbox
                                checked={mealSelections[emp.id]?.dinner || false}
                                onCheckedChange={() => handleToggleMeal(emp.id, "dinner")}
                              />
                            </td>
                            <td className="py-3 px-4 text-right">
                              <span className="font-semibold text-foreground">
                                BDT {calculateEmployeeCost(emp.id).toFixed(2)}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* Summary Section */}
                  <div className="grid grid-cols-3 gap-4 pt-4 border-t border-border">
                    <div className="bg-muted p-4 rounded-lg">
                      <p className="text-sm text-muted-foreground">Total Daily Cost</p>
                      <p className="text-2xl font-bold text-foreground">
                        BDT {Number.parseFloat(totalMealCost || "0").toFixed(2)}
                      </p>
                    </div>
                    <div className="bg-muted p-4 rounded-lg">
                      <p className="text-sm text-muted-foreground">Total Meals</p>
                      <p className="text-2xl font-bold text-foreground">
                        {Object.values(mealSelections).reduce(
                          (sum, m) => sum + (m.lunch ? 1 : 0) + (m.dinner ? 1 : 0),
                          0,
                        )}
                      </p>
                    </div>
                    <div className="bg-muted p-4 rounded-lg">
                      <p className="text-sm text-muted-foreground">Cost per Meal</p>
                      <p className="text-2xl font-bold text-foreground">
                        BDT {(() => {
                          const totalMeals = Object.values(mealSelections).reduce(
                            (sum, m) => sum + (m.lunch ? 1 : 0) + (m.dinner ? 1 : 0),
                            0,
                          )
                          return totalMeals > 0
                            ? (Number.parseFloat(totalMealCost || "0") / totalMeals).toFixed(2)
                            : "0.00"
                        })()}
                      </p>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-4 pt-4">
                    <Button
                      variant="outline"
                      onClick={() => {
                        setStep("cost")
                        setMealSelections({})
                      }}
                      className="flex-1"
                    >
                      Back
                    </Button>
                    <Button onClick={handleSubmitMeals} className="flex-1" size="lg">
                      Submit & Calculate Costs
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </>
        )}

        {/* Info Message */}
        {employees.length === 0 && (
          <Card className="border-amber-200 bg-amber-50">
            <CardContent className="pt-6">
              <div className="flex gap-3">
                <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium text-amber-900">No employees found</p>
                  <p className="text-sm text-amber-800">Please add employees first in the Employees module</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
