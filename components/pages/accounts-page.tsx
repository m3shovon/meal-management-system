"use client"

import { useState } from "react"
import { useMealContext } from "@/context/meal-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Trash2, Plus } from "lucide-react"

export function AccountsPage() {
  const { employees, deposits, addDeposit, deleteDeposit } = useMealContext()
  console.log(employees)
  console.log(deposits)
  const [selectedEmployeeId, setSelectedEmployeeId] = useState("")
  const [amount, setAmount] = useState("")
  const [month, setMonth] = useState(new Date().toISOString().slice(0, 7))

  const handleAddDeposit = () => {
    if (selectedEmployeeId && amount && month) {
      addDeposit(selectedEmployeeId, Number.parseFloat(amount), month)
      setAmount("")
    }
  }

  const getEmployeeDeposits = (employeeId: string) => {
    return deposits.filter((d) => d.employee === employeeId)
  }

  const getTotalDeposits = (employeeId: string) => {
    return getEmployeeDeposits(employeeId).reduce((sum, d) => sum + Number(d.amount || 0), 0)
  }

  return (
    <div className="p-8">
      <div className="max-w-4xl">
        <h1 className="text-3xl font-bold mb-8 text-foreground">Employee Accounts</h1>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Add Deposit</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-4">
              <Select value={selectedEmployeeId} onValueChange={setSelectedEmployeeId}>
                <SelectTrigger className="flex-1">
                  <SelectValue placeholder="Select employee" />
                </SelectTrigger>
                <SelectContent>
                  {employees.map((emp) => (
                    <SelectItem key={emp.id} value={emp.id}>
                      {emp.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Input
                type="number"
                placeholder="Amount"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-32"
              />
              <Input type="month" value={month} onChange={(e) => setMonth(e.target.value)} className="w-40" />
              <Button onClick={handleAddDeposit} className="gap-2">
                <Plus className="w-4 h-4" />
                Add
              </Button>
            </div>
          </CardContent>
        </Card>

        <div className="grid gap-6">
          {employees.length === 0 ? (
            <Card>
              <CardContent className="pt-6">
                <p className="text-center text-muted-foreground">No employees to show</p>
              </CardContent>
            </Card>
          ) : (
            employees.map((employee) => (
              <Card key={employee.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>{employee.name}</CardTitle>
                    <div className="text-right">
                      <p className="text-sm text-muted-foreground">Total Deposits</p>
                      <p className="text-2xl font-bold text-green-600">BDT {getTotalDeposits(employee.id).toFixed(2)}</p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  {getEmployeeDeposits(employee.id).length === 0 ? (
                    <p className="text-muted-foreground">No deposits yet</p>
                  ) : (
                    <div className="space-y-2">
                      {getEmployeeDeposits(employee.id).map((deposit) => (
                        <div key={deposit.id} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                          <div>
                            <p className="font-medium text-foreground">BDT {Number(deposit.amount).toFixed(2)}</p>
                            <p className="text-sm text-muted-foreground">{deposit.month}</p>
                          </div>
                          <Button variant="ghost" size="sm" onClick={() => deleteDeposit(deposit.id)}>
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  )
}
