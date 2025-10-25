"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"
import { employeeAPI, depositAPI, mealEntryAPI, mealCostAPI } from "@/lib/api-client"

export type EmployeeType = "regular" | "irregular" | "guest"

export interface Employee {
  id: string
  name: string
  type: EmployeeType
  created_at?: string
}

export interface Deposit {
  id: string
  employee: string
  employee_name?: string
  amount: number
  month: string
  date?: string
}

export interface MealEntry {
  id: string
  employee: string
  employee_name?: string
  date: string
  lunch: number
  dinner: number
}

export interface MealCost {
  id: string
  employee: string
  employee_name?: string
  date: string
  total_meal_cost: number
  meal_count: number
  cost_per_meal: number
}

interface MealContextType {
  employees: Employee[]
  deposits: Deposit[]
  mealEntries: MealEntry[]
  mealCosts: MealCost[]
  loading: boolean
  error: string | null
  addEmployee: (name: string, type: EmployeeType) => Promise<void>
  deleteEmployee: (id: string) => Promise<void>
  addDeposit: (employeeId: string, amount: number, month: string) => Promise<void>
  deleteDeposit: (id: string) => Promise<void>
  addMealEntry: (employeeId: string, date: string, lunch: number, dinner: number) => Promise<void>
  deleteMealEntry: (id: string) => Promise<void>
  addMealCost: (employeeId: string, date: string, totalMealCost: number, mealCount: number) => Promise<void>
  getEmployeeBalance: (employeeId: string, month: string) => number
  getEmployeeMealCosts: (employeeId: string, month: string) => number
}

const MealContext = createContext<MealContextType | undefined>(undefined)

const loadFromLocalStorage = (key: string, defaultValue: any[] = []) => {
  try {
    const item = localStorage.getItem(key)
    return item ? JSON.parse(item) : defaultValue
  } catch {
    return defaultValue
  }
}

const saveToLocalStorage = (key: string, data: any) => {
  try {
    localStorage.setItem(key, JSON.stringify(data))
  } catch {
    console.error("[v0] Failed to save to localStorage:", key)
  }
}

export function MealManagementProvider({ children }: { children: React.ReactNode }) {
  const [employees, setEmployees] = useState<Employee[]>([])
  const [deposits, setDeposits] = useState<Deposit[]>([])
  const [mealEntries, setMealEntries] = useState<MealEntry[]>([])
  const [mealCosts, setMealCosts] = useState<MealCost[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [useLocalStorage, setUseLocalStorage] = useState(false)

  // Load initial data from API or localStorage
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true)

        const [empRes, depRes, mealRes, costRes] = await Promise.all([
          employeeAPI.getAll(),
          depositAPI.getAll(),
          mealEntryAPI.getAll(),
          mealCostAPI.getAll(),
        ])

        // 🟢 FIX HERE: handle DRF pagination ("results" field)
        const empData = empRes.data?.results || empRes.results || empRes.data || []
        const depData = depRes.data?.results || depRes.results || depRes.data || []
        const mealData = mealRes.data?.results || mealRes.results || mealRes.data || []
        const costData = costRes.data?.results || costRes.results || costRes.data || []

        setEmployees(empData)
        setDeposits(depData)
        setMealEntries(mealData)
        setMealCosts(costData)
        setError(null)
        setUseLocalStorage(false)
      } catch (err) {
        console.error("[v0] Error loading data from API, falling back to localStorage:", err)
        const empData = loadFromLocalStorage("employees", [])
        const depData = loadFromLocalStorage("deposits", [])
        const mealData = loadFromLocalStorage("mealEntries", [])
        const costData = loadFromLocalStorage("mealCosts", [])

        setEmployees(empData)
        setDeposits(depData)
        setMealEntries(mealData)
        setMealCosts(costData)
        setUseLocalStorage(true)
        setError("Using local storage - Backend server not available")
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [])


  const addEmployee = async (name: string, type: EmployeeType) => {
    try {
      const newEmployee: Employee = {
        id: Date.now().toString(),
        name,
        type,
        created_at: new Date().toISOString(),
      }

      if (useLocalStorage) {
        const updated = [...employees, newEmployee]
        setEmployees(updated)
        saveToLocalStorage("employees", updated)
      } else {
        const response = await employeeAPI.create(newEmployee)
        setEmployees([...employees, response.data])
      }
    } catch (err) {
      console.error("[v0] Error adding employee:", err)
      setError("Failed to add employee")
    }
  }

  const deleteEmployee = async (id: string) => {
    try {
      if (useLocalStorage) {
        const updated = employees.filter((e) => e.id !== id)
        setEmployees(updated)
        saveToLocalStorage("employees", updated)
      } else {
        await employeeAPI.delete(id)
        setEmployees(employees.filter((e) => e.id !== id))
      }

      setDeposits(deposits.filter((d) => d.employee !== id))
      setMealEntries(mealEntries.filter((m) => m.employee !== id))
      setMealCosts(mealCosts.filter((m) => m.employee !== id))

      if (useLocalStorage) {
        saveToLocalStorage(
          "deposits",
          deposits.filter((d) => d.employee !== id),
        )
        saveToLocalStorage(
          "mealEntries",
          mealEntries.filter((m) => m.employee !== id),
        )
        saveToLocalStorage(
          "mealCosts",
          mealCosts.filter((m) => m.employee !== id),
        )
      }
    } catch (err) {
      console.error("[v0] Error deleting employee:", err)
      setError("Failed to delete employee")
    }
  }

  const addDeposit = async (employeeId: string, amount: number, month: string) => {
    try {
      const newDeposit: Deposit = {
        id: Date.now().toString(),
        employee: employeeId,
        amount,
        month,
        date: new Date().toISOString(),
      }

      if (useLocalStorage) {
        const updated = [...deposits, newDeposit]
        setDeposits(updated)
        saveToLocalStorage("deposits", updated)
      } else {
        const response = await depositAPI.create(newDeposit)
        setDeposits([...deposits, response.data])
      }
    } catch (err) {
      console.error("[v0] Error adding deposit:", err)
      setError("Failed to add deposit")
    }
  }

  const deleteDeposit = async (id: string) => {
    try {
      if (useLocalStorage) {
        const updated = deposits.filter((d) => d.id !== id)
        setDeposits(updated)
        saveToLocalStorage("deposits", updated)
      } else {
        await depositAPI.delete(id)
        setDeposits(deposits.filter((d) => d.id !== id))
      }
    } catch (err) {
      console.error("[v0] Error deleting deposit:", err)
      setError("Failed to delete deposit")
    }
  }

  const addMealEntry = async (employeeId: string, date: string, lunch: number, dinner: number) => {
    try {
      const existingEntry = mealEntries.find((m) => m.employee === employeeId && m.date === date)
      if (existingEntry) {
        const updated = { ...existingEntry, lunch, dinner }
        if (useLocalStorage) {
          const newEntries = mealEntries.map((m) => (m.id === existingEntry.id ? updated : m))
          setMealEntries(newEntries)
          saveToLocalStorage("mealEntries", newEntries)
        } else {
          const response = await mealEntryAPI.update(existingEntry.id, { lunch, dinner })
          setMealEntries(mealEntries.map((m) => (m.id === existingEntry.id ? response.data : m)))
        }
      } else {
        const newEntry: MealEntry = {
          id: Date.now().toString(),
          employee: employeeId,
          date,
          lunch,
          dinner,
        }

        if (useLocalStorage) {
          const updated = [...mealEntries, newEntry]
          setMealEntries(updated)
          saveToLocalStorage("mealEntries", updated)
        } else {
          const response = await mealEntryAPI.create(newEntry)
          setMealEntries([...mealEntries, response.data])
        }
      }
    } catch (err) {
      console.error("[v0] Error adding meal entry:", err)
      setError("Failed to add meal entry")
    }
  }

  const deleteMealEntry = async (id: string) => {
    try {
      if (useLocalStorage) {
        const updated = mealEntries.filter((m) => m.id !== id)
        setMealEntries(updated)
        saveToLocalStorage("mealEntries", updated)
      } else {
        await mealEntryAPI.delete(id)
        setMealEntries(mealEntries.filter((m) => m.id !== id))
      }
    } catch (err) {
      console.error("[v0] Error deleting meal entry:", err)
      setError("Failed to delete meal entry")
    }
  }

  const addMealCost = async (employeeId: string, date: string, totalMealCost: number, mealCount: number) => {
    try {
      const costPerMeal = mealCount > 0 ? totalMealCost / mealCount : 0
      const newCost: MealCost = {
        id: Date.now().toString(),
        employee: employeeId,
        date,
        total_meal_cost: totalMealCost,
        meal_count: mealCount,
        cost_per_meal: costPerMeal,
      }

      if (useLocalStorage) {
        const updated = [...mealCosts, newCost]
        setMealCosts(updated)
        saveToLocalStorage("mealCosts", updated)
      } else {
        const response = await mealCostAPI.create(newCost)
        setMealCosts([...mealCosts, response.data])
      }
    } catch (err) {
      console.error("[v0] Error adding meal cost:", err)
      setError("Failed to add meal cost")
    }
  }

  const getEmployeeBalance = (employeeId: string, month: string) => {
    const employeeDeposits = deposits
      .filter((d) => d.employee === employeeId && d.month === month)
      .reduce((sum, d) => sum + Number(d.amount), 0)

    const employeeCosts = mealCosts
      .filter((m) => m.employee === employeeId && m.date.startsWith(month))
      .reduce((sum, m) => sum + Number(m.total_meal_cost), 0)

    return employeeDeposits - employeeCosts
  }

  const getEmployeeMealCosts = (employeeId: string, month: string) => {
    return mealCosts
      .filter((m) => m.employee === employeeId && m.date.startsWith(month))
      .reduce((sum, m) => sum + Number(m.total_meal_cost), 0)
  }

  return (
    <MealContext.Provider
      value={{
        employees: Array.isArray(employees) ? employees : [],
        deposits: Array.isArray(deposits) ? deposits : [],
        mealEntries: Array.isArray(mealEntries) ? mealEntries : [],
        mealCosts: Array.isArray(mealCosts) ? mealCosts : [],
        loading,
        error,
        addEmployee,
        deleteEmployee,
        addDeposit,
        deleteDeposit,
        addMealEntry,
        deleteMealEntry,
        addMealCost,
        getEmployeeBalance,
        getEmployeeMealCosts,
      }}
    >
      {children}
    </MealContext.Provider>
  )
}

export function useMealContext() {
  const context = useContext(MealContext)
  if (!context) {
    throw new Error("useMealContext must be used within MealManagementProvider")
  }
  return context
}
