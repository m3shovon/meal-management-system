import axios from "axios"

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api"

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
})

// Employee APIs
export const employeeAPI = {
  getAll: () => apiClient.get("/employees/"),
  create: (data: { id: string; name: string; type: string }) => apiClient.post("/employees/", data),
  delete: (id: string) => apiClient.delete(`/employees/${id}/`),
}

// Deposit APIs
export const depositAPI = {
  getAll: () => apiClient.get("/deposits/"),
  create: (data: { id: string; employee: string; amount: number; month: string }) => apiClient.post("/deposits/", data),
  delete: (id: string) => apiClient.delete(`/deposits/${id}/`),
  getByEmployeeMonth: (employeeId: string, month: string) =>
    apiClient.get("/deposits/by_employee_month/", { params: { employee_id: employeeId, month } }),
}

// Meal Entry APIs
export const mealEntryAPI = {
  getAll: () => apiClient.get("/meal-entries/"),
  create: (data: { id: string; employee: string; date: string; lunch: number; dinner: number }) =>
    apiClient.post("/meal-entries/", data),
  update: (id: string, data: { lunch: number; dinner: number }) => apiClient.patch(`/meal-entries/${id}/`, data),
  delete: (id: string) => apiClient.delete(`/meal-entries/${id}/`),
  getByDate: (date: string) => apiClient.get("/meal-entries/by_date/", { params: { date } }),
}

// Meal Cost APIs
export const mealCostAPI = {
  getAll: () => apiClient.get("/meal-costs/"),
  create: (data: {
    id: string
    employee: string
    date: string
    total_meal_cost: number
    meal_count: number
    cost_per_meal: number
  }) => apiClient.post("/meal-costs/", data),
  delete: (id: string) => apiClient.delete(`/meal-costs/${id}/`),
  getByEmployeeMonth: (employeeId: string, month: string) =>
    apiClient.get("/meal-costs/by_employee_month/", { params: { employee_id: employeeId, month } }),
}

export default apiClient
