"use client"

import { useState, useEffect, useMemo } from "react"
import { format, getDaysInMonth, startOfMonth, addDays, addMonths, subMonths, isSameMonth } from "date-fns"
import {
  Calendar,
  List,
  Users,
  IndianRupee,
  Clock,
  ChevronLeft,
  ChevronRight,
  Search,
  Plus,
  Trash2,
  Edit,
} from "lucide-react"

// Updated API base URL
const API_BASE_URL = "http://localhost:3000/api/employee"

function Attendance() {
  const [employees, setEmployees] = useState([])
  const [selectedMonth, setSelectedMonth] = useState(new Date())
  const [showAddForm, setShowAddForm] = useState(false)
  const [notification, setNotification] = useState(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [viewMode, setViewMode] = useState("calendar")
  const [editingEmployee, setEditingEmployee] = useState(null)
  const [isLoading, setIsLoading] = useState(true)

  // Fetch employees on component mount
  useEffect(() => {
    fetchEmployees()
  }, [])

  const fetchEmployees = async () => {
    try {
      setIsLoading(true)
      const response = await fetch(`${API_BASE_URL}/allEmp`)
      if (!response.ok) {
        throw new Error("Failed to fetch employees")
      }
      const data = await response.json()
      setEmployees(data)
    } catch (error) {
      showNotification("Failed to fetch employees", "error")
      // Fallback to empty array if fetch fails
      setEmployees([])
    } finally {
      setIsLoading(false)
    }
  }

  const [formValues, setFormValues] = useState({
    name: "",
    email: "",
    position: "",
    mobileNo: "",
    dailyWage: "",
    image: null,
  })

  useEffect(() => {
    if (editingEmployee) {
      setFormValues({
        name: editingEmployee.name || "",
        email: editingEmployee.email || "",
        position: editingEmployee.position || "",
        mobileNo: editingEmployee.mobileNo || "",
        dailyWage: editingEmployee.dailyWage || "",
        image: null, // Reset image on edit
      })
    } else {
      setFormValues({
        name: "",
        email: "",
        position: "",
        mobileNo: "",
        dailyWage: "",
        image: null,
      })
    }
  }, [editingEmployee])

  const showNotification = (message, type = "success") => {
    setNotification({ message, type })
    setTimeout(() => setNotification(null), 3000)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const formData = new FormData(e.target)

    try {
      let response

      if (editingEmployee) {
        // If editing, send JSON (no image update)
        const jsonData = {
          name: formData.get("name"),
          email: formData.get("email"),
          mobileNo: formData.get("mobileNo"),
          position: formData.get("position"),
          dailyWage: formData.get("dailyWage"),
        }

        response = await fetch(`${API_BASE_URL}/update/${editingEmployee._id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(jsonData),
        })
      } else {
        // If creating, send FormData (including image)
        response = await fetch(`${API_BASE_URL}/createEmp`, {
          method: "POST",
          body: formData,
        })
      }

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || "Failed to save employee")
      }

      const result = await response.json()
      showNotification(editingEmployee ? `Updated employee: ${result.name}` : `Added new employee: ${result.name}`)

      fetchEmployees()
      setShowAddForm(false)
      setEditingEmployee(null)
      e.target.reset()
    } catch (error) {
      showNotification(error.message, "error")
    }
  }

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this employee?")
    if (confirmDelete) {
      try {
        const response = await fetch(`${API_BASE_URL}/delete/${id}`, {
          method: "DELETE",
        })

        if (!response.ok) {
          const errorData = await response.json()
          throw new Error(errorData.message || "Failed to delete employee")
        }

        showNotification("Employee deleted successfully")
        fetchEmployees()
      } catch (error) {
        showNotification(error.message, "error")
      }
    }
  }

  const handleEdit = (employee) => {
    setEditingEmployee(employee)
    setShowAddForm(true)
  }

  const daysInMonth = getDaysInMonth(selectedMonth)
  const firstDayOfMonth = startOfMonth(selectedMonth)
  const dates = Array.from({ length: daysInMonth }, (_, i) => addDays(firstDayOfMonth, i))

  const filteredEmployees = employees.filter(
    (emp) =>
      emp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emp.position.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const toggleAttendance = async (employeeId, date) => {
    const dateStr = format(date, "yyyy-MM-dd")
    const employee = employees.find((emp) => emp._id === employeeId)
    const newStatus = !employee.attendance[dateStr]

    try {
      const response = await fetch(`${API_BASE_URL}/attendance/${employeeId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          date: dateStr,
          status: newStatus,
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to update attendance")
      }

      setEmployees(
        employees.map((emp) => {
          if (emp._id === employeeId) {
            return {
              ...emp,
              attendance: {
                ...emp.attendance,
                [dateStr]: newStatus,
              },
            }
          }
          return emp
        }),
      )

      showNotification(
        `Marked ${employee.name} as ${newStatus ? "present" : "absent"} for ${format(date, "dd MMM, yyyy")}`,
      )
    } catch (error) {
      showNotification("Failed to update attendance", "error")
    }
  }

  const calculateMonthlyStats = useMemo(() => {
    const stats = {
      totalPresent: 0,
      totalAbsent: 0,
      totalSalary: 0,
      averageAttendance: 0,
      monthlyAttendance: {},
    }

    employees.forEach((employee) => {
      let presentDays = 0
      let totalDays = 0

      Object.entries(employee.attendance || {}).forEach(([dateStr, present]) => {
        const date = new Date(dateStr)
        if (isSameMonth(date, selectedMonth)) {
          totalDays++
          if (present) {
            presentDays++
            stats.totalPresent++
          } else {
            stats.totalAbsent++
          }
        }
      })

      const monthlySalary = presentDays * employee.dailyWage
      stats.totalSalary += monthlySalary

      if (totalDays > 0) {
        stats.monthlyAttendance[employee._id] = (presentDays / totalDays) * 100
      }
    })

    if (Object.keys(stats.monthlyAttendance).length > 0) {
      stats.averageAttendance =
        Object.values(stats.monthlyAttendance).reduce((a, b) => a + b, 0) / Object.keys(stats.monthlyAttendance).length
    }

    return stats
  }, [employees, selectedMonth])

  const calculateAttendancePercentage = (employee) => {
    let presentDays = 0
    let totalDays = 0

    Object.entries(employee.attendance || {}).forEach(([dateStr, present]) => {
      const date = new Date(dateStr)
      if (isSameMonth(date, selectedMonth)) {
        totalDays++
        if (present) presentDays++
      }
    })

    return totalDays === 0 ? 0 : Math.round((presentDays / totalDays) * 100)
  }

  const calculateMonthlySalary = (employee) => {
    let presentDays = 0

    Object.entries(employee.attendance || {}).forEach(([dateStr, present]) => {
      const date = new Date(dateStr)
      if (isSameMonth(date, selectedMonth) && present) {
        presentDays++
      }
    })

    return presentDays * employee.dailyWage
  }

  const getAttendanceColor = (percentage) => {
    if (percentage >= 90) return "bg-emerald-500"
    if (percentage >= 75) return "bg-green-500"
    if (percentage >= 60) return "bg-yellow-500"
    return "bg-red-500"
  }

  const renderCalendarView = () => (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr>
            <th className="px-6 py-4 text-left">
              <span className="text-sm font-semibold text-slate-600">Employee</span>
            </th>
            {dates.map((date) => (
              <th key={date.toString()} className="px-2 py-4 text-center">
                <div className="flex flex-col">
                  <span className="text-xs font-medium text-slate-500">{format(date, "EEE")}</span>
                  <span className="text-sm font-semibold text-slate-700">{format(date, "d")}</span>
                </div>
              </th>
            ))}
            <th className="px-6 py-4 text-center">
              <span className="text-sm font-semibold text-slate-600">Overview</span>
            </th>
          </tr>
        </thead>
        <tbody>
          {filteredEmployees.map((employee) => (
            <tr
              key={employee._id}
              className="group border-t border-slate-100 hover:bg-slate-50 transition-colors duration-200"
            >
              <td className="px-6 py-4">
                <div className="flex items-center gap-3">
                  <img
                    src={
                      employee.image ||
                      `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(employee.name) || "/placeholder.svg"}`
                    }
                    alt={employee.name}
                    className="w-10 h-10 rounded-xl bg-slate-100"
                  />
                  <div className="mr-[40px]">
                    <div className="font-semibold text-slate-800">{employee.name}</div>
                    <div className="text-sm text-slate-500">{employee.position}</div>
                  </div>
                </div>
              </td>
              {dates.map((date) => {
                const dateStr = format(date, "yyyy-MM-dd")
                const isPresent = employee.attendance?.[dateStr]
                return (
                  <td key={`${employee._id}-${dateStr}`} className="px-2 py-4 text-center">
                    <button
                      onClick={() => toggleAttendance(employee._id, date)}
                      className={`w-9 h-9 rounded-lg transition-all duration-300 transform hover:scale-110 ${
                        isPresent ? "bg-emerald-500 hover:bg-emerald-600" : "bg-red-500 hover:bg-red-600"
                      } text-white font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                        isPresent ? "focus:ring-emerald-500" : "focus:ring-red-500"
                      } group-hover:shadow-lg`}
                    >
                      {isPresent ? "P" : "A"}
                    </button>
                  </td>
                )
              })}
              <td className="px-6 py-4">
                <div className="flex flex-col items-center gap-2">
                  <div className="w-full bg-slate-100 rounded-full h-2.5 mb-1">
                    <div
                      className={`h-2.5 rounded-full ${getAttendanceColor(calculateAttendancePercentage(employee))}`}
                      style={{ width: `${calculateAttendancePercentage(employee)}%` }}
                    ></div>
                  </div>
                  <div className="text-sm font-medium text-slate-600">
                    {calculateAttendancePercentage(employee)}% Present
                  </div>
                  <div className="font-semibold text-emerald-600">
                    ₹{calculateMonthlySalary(employee).toLocaleString()}
                  </div>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )

  const renderListView = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {filteredEmployees.map((employee) => (
        <div key={employee._id} className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow">
          <div className="flex items-center gap-4 mb-4">
            <img
              src={
                employee.image || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(employee.name)}`
              }
              alt={employee.name}
              className="w-16 h-16 rounded-xl object-cover"
            />
            <div className="flex-1">
              <h3 className="font-semibold text-lg text-slate-800">{employee.name}</h3>
              <p className="text-slate-500">{employee.position}</p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => handleEdit(employee)}
                className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
              >
                <Edit className="w-5 h-5" />
              </button>
              <button
                onClick={() => handleDelete(employee._id)}
                className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            </div>
          </div>

          <div className="space-y-4">
            <div className="text-sm text-slate-600">
              <div className="mb-2">📧 {employee.email}</div>
              <div>📱 {employee.mobileNo}</div>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-slate-600">Monthly Attendance</span>
              <span className="font-semibold">{calculateAttendancePercentage(employee)}%</span>
            </div>

            <div className="w-full bg-slate-100 rounded-full h-2.5">
              <div
                className={`h-2.5 rounded-full ${getAttendanceColor(calculateAttendancePercentage(employee))}`}
                style={{ width: `${calculateAttendancePercentage(employee)}%` }}
              ></div>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-slate-600">Monthly Salary</span>
              <span className="font-semibold text-emerald-600">
                ₹{calculateMonthlySalary(employee).toLocaleString()}
              </span>
            </div>

            <div className="pt-4 border-t border-slate-100">
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-3 bg-slate-50 rounded-lg">
                  <div className="text-lg font-semibold text-emerald-600">
                    {
                      Object.entries(employee.attendance || {}).filter(
                        ([dateStr, present]) => isSameMonth(new Date(dateStr), selectedMonth) && present,
                      ).length
                    }
                  </div>
                  <div className="text-sm text-slate-500">Present Days</div>
                </div>
                <div className="text-center p-3 bg-slate-50 rounded-lg">
                  <div className="text-lg font-semibold text-red-600">
                    {
                      Object.entries(employee.attendance || {}).filter(
                        ([dateStr, present]) => isSameMonth(new Date(dateStr), selectedMonth) && !present,
                      ).length
                    }
                  </div>
                  <div className="text-sm text-slate-500">Absent Days</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  )

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {notification && (
        <div
          className={`fixed top-4 right-4 p-4 rounded-lg shadow-xl transform transition-all duration-500 ${
            notification.type === "success" ? "bg-emerald-500" : "bg-red-500"
          } text-white z-50 animate-bounce`}
        >
          <div className="flex items-center gap-2">
            {notification.type === "success" ? (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
              </svg>
            ) : (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            )}
            {notification.message}
          </div>
        </div>
      )}

      <div className="max-w-8xl mx-auto p-6 mt-5">
        <header className="text-center mb-12 pt-8">
          <h1 className="text-5xl font-bold text-slate-800 mb-3 animate-fade-in">Attendance Dashboard</h1>
          <p className="text-slate-600 text-lg">Streamlined attendance tracking and employee management</p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-2xl p-6 shadow-lg">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-blue-100 rounded-xl">
                <Users className="w-8 h-8 text-blue-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-slate-600">Total Employees</p>
                <p className="text-3xl font-bold text-slate-900">{employees.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-lg">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-emerald-100 rounded-xl">
                <Users className="w-8 h-8 text-emerald-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-slate-600">Average Attendance</p>
                <p className="text-3xl font-bold text-slate-900">
                  {Math.round(calculateMonthlyStats.averageAttendance)}%
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-lg">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-purple-100 rounded-xl">
                <IndianRupee className="w-8 h-8 text-purple-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-slate-600">Total Salary Payout</p>
                <p className="text-3xl font-bold text-slate-900">
                  ₹{calculateMonthlyStats.totalSalary.toLocaleString()}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-lg">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-amber-100 rounded-xl">
                <Clock className="w-8 h-8 text-amber-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-slate-600">Working Days</p>
                <p className="text-3xl font-bold text-slate-900">{daysInMonth}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-6 mb-8">
          <div className="flex flex-wrap gap-4 justify-between items-center">
            <div className="flex items-center gap-4">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search employees..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 w-64"
                />
                <Search className="w-5 h-5 text-slate-400 absolute left-3 top-2.5" />
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setSelectedMonth(subMonths(selectedMonth, 1))}
                  className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
                >
                  <ChevronLeft className="w-5 h-5 text-slate-600" />
                </button>
                <div className="px-4 py-2 font-medium text-slate-700">{format(selectedMonth, "MMMM yyyy")}</div>
                <button
                  onClick={() => setSelectedMonth(addMonths(selectedMonth, 1))}
                  className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
                >
                  <ChevronRight className="w-5 h-5 text-slate-600" />
                </button>
              </div>

              <div className="flex gap-2 bg-slate-100 p-1 rounded-lg">
                <button
                  onClick={() => setViewMode("calendar")}
                  className={`px-4 py-2 rounded-lg transition-all flex items-center gap-2 ${
                    viewMode === "calendar" ? "bg-white shadow-md text-blue-600" : "text-slate-600"
                  }`}
                >
                  <Calendar className="w-4 h-4" />
                  Calendar View
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={`px-4 py-2 rounded-lg transition-all flex items-center gap-2 ${
                    viewMode === "list" ? "bg-white shadow-md text-blue-600" : "text-slate-600"
                  }`}
                >
                  <List className="w-4 h-4" />
                  List View
                </button>
              </div>
            </div>
            <button
              onClick={() => setShowAddForm(!showAddForm)}
              className="bg-blue-600 text-white px-6 py-2.5 rounded-lg hover:bg-blue-700 transition-all duration-300 flex items-center gap-2 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              <Plus className="w-5 h-5" />
              <span>{showAddForm ? "Cancel" : "Add Employee"}</span>
            </button>
          </div>
        </div>

        {showAddForm && (
          <div className="bg-white rounded-2xl shadow-lg p-8 mb-8 animate-fade-in">
            <h3 className="text-2xl font-bold text-slate-800 mb-6">
              {editingEmployee ? "Edit Employee Details" : "New Employee Details"}
            </h3>
            <form
              onSubmit={handleSubmit}
              className="grid grid-cols-1 md:grid-cols-2 gap-6"
              encType="multipart/form-data"
            >
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">Employee Name</label>
                <input
                  type="text"
                  name="name"
                  defaultValue={editingEmployee?.name}
                  placeholder="Enter full name"
                                                                                           
                  className="w-full border border-slate-200 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">Position</label>
                <input
                  type="text"
                  name="position"
                  defaultValue={editingEmployee?.position}
                  placeholder="Job position"
                  required
                  className="w-full border border-slate-200 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">Email</label>
                <input
                  type="email"
                  name="email"
                  defaultValue={editingEmployee?.email}
                  placeholder="Email address"
                  required
                  className="w-full border border-slate-200 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">Mobile Number</label>
                <input
                  type="tel"
                  name="mobileNo"
                  defaultValue={editingEmployee?.mobileNo}
                  placeholder="Mobile number"
                  required
                  className="w-full border border-slate-200 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">Daily Wage (₹)</label>
                <input
                  type="number"
                  name="dailyWage"
                  defaultValue={editingEmployee?.dailyWage}
                  placeholder="Amount in rupees"
                  required
                  className="w-full border border-slate-200 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">Profile Image</label>
                <input
                  type="file"
                  name="image"
                  accept="image/*"
                  className="w-full border border-slate-200 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="md:col-span-2 flex justify-end gap-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowAddForm(false)
                    setEditingEmployee(null)
                  }}
                  className="px-8 py-2.5 rounded-lg border border-slate-200 hover:bg-slate-50 transition-all duration-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-blue-600 text-white px-8 py-2.5 rounded-lg hover:bg-blue-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                >
                  {editingEmployee ? "Update Employee" : "Add Employee"}
                </button>
              </div>
            </form>
          </div>
        )}

        <div className="bg-white rounded-2xl shadow-lg p-8">
          {isLoading ? (
            <div className="flex items-center justify-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
          ) : viewMode === "calendar" ? (
            renderCalendarView()
          ) : (
            renderListView()
          )}
        </div>
      </div>
    </div>
  )
}

export default Attendance

