"use client"

import { useState } from "react"
import { useMealContext, type EmployeeType } from "@/context/meal-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Trash2, Plus, AlertCircle } from "lucide-react"

export function EmployeesPage() {
  const { employees, addEmployee, deleteEmployee, loading, error } = useMealContext()
  console.log(employees)
  const [name, setName] = useState("")
  const [type, setType] = useState<EmployeeType>("regular")

  const handleAddEmployee = () => {
    if (name.trim()) {
      addEmployee(name, type)
      setName("")
      setType("regular")
    }
  }

  const getTypeColor = (type: EmployeeType) => {
    switch (type) {
      case "regular":
        return "bg-blue-100 text-blue-800"
      case "irregular":
        return "bg-yellow-100 text-yellow-800"
      case "guest":
        return "bg-purple-100 text-purple-800"
    }
  }

  if (loading) {
    return (
      <div className="p-8">
        <div className="max-w-4xl">
          <h1 className="text-3xl font-bold mb-8 text-foreground">Employee Management</h1>
          <Card>
            <CardContent className="pt-6">
              <p className="text-center text-muted-foreground">Loading employees...</p>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="p-8">
      <div className="max-w-4xl">
        <h1 className="text-3xl font-bold mb-8 text-foreground">Employee Management</h1>

        {error && (
          <Card className="mb-8 border-yellow-200 bg-yellow-50">
            <CardContent className="pt-6">
              <div className="flex items-center gap-2 text-yellow-800">
                <AlertCircle className="w-5 h-5" />
                <p>{error}</p>
              </div>
            </CardContent>
          </Card>
        )}

        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Add New Employee</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-4">
              <Input
                placeholder="Employee name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleAddEmployee()}
              />
              <Select value={type} onValueChange={(value) => setType(value as EmployeeType)}>
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="regular">Regular</SelectItem>
                  <SelectItem value="irregular">Irregular</SelectItem>
                  <SelectItem value="guest">Guest</SelectItem>
                </SelectContent>
              </Select>
              <Button onClick={handleAddEmployee} className="gap-2">
                <Plus className="w-4 h-4" />
                Add Employee
              </Button>
            </div>
          </CardContent>
        </Card>

        <div className="grid gap-4">
          {Array.isArray(employees) && employees.length === 0 ? (
            <Card>
              <CardContent className="pt-6">
                <p className="text-center text-muted-foreground">No employees added yet</p>
              </CardContent>
            </Card>
          ) : (
            Array.isArray(employees) &&
            employees.map((employee) => (
              <Card key={employee.id}>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div>
                        <p className="font-semibold text-foreground">{employee.name}</p>
                        <p className="text-sm text-muted-foreground">ID: {employee.id}</p>
                      </div>
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-medium capitalize ${getTypeColor(employee.type)}`}
                      >
                        {employee.type}
                      </span>
                    </div>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => deleteEmployee(employee.id)}
                      className="gap-2"
                    >
                      <Trash2 className="w-4 h-4" />
                      Delete
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  )
}
