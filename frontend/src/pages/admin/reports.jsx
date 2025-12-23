import React, { useEffect, useState } from "react"
import DashboardLayout from "../../components/DashboardLayout"
import StatCard from "../../components/statcard"
import ReportCard from "../../components/ReportCard"
import axiosInstance from "../../utils/axioInstance"
import { FaUsers, FaTasks, FaDownload, FaChartPie } from "react-icons/fa"
import toast from "react-hot-toast"

const Reports = () => {
  const [stats, setStats] = useState(null)

  const fetchStats = async () => {
    try {
      const res = await axiosInstance.get("/tasks/dashboard-data")
      setStats(res.data?.statistics)
    } catch (error) {
      toast.error("Failed to load report statistics")
    }
  }

  useEffect(() => {
    fetchStats()
  }, [])

  const downloadReport = async (type) => {
    try {
      const res = await axiosInstance.get(`/reports/export/${type}`, {
        responseType: "blob",
      })

      const url = window.URL.createObjectURL(new Blob([res.data]))
      const link = document.createElement("a")
      link.href = url
      link.setAttribute("download", `${type}_report.xlsx`)
      document.body.appendChild(link)
      link.click()
      link.remove()
      window.URL.revokeObjectURL(url)

      toast.success("Report downloaded")
    } catch (error) {
      toast.error("Download failed")
    }
  }

  return (
    <DashboardLayout activeMenu="Reports">
      <div className="p-6 space-y-8">
        {/* Header */}
        <div>
          <h2 className="text-3xl font-bold text-gray-800">Reports & Analytics</h2>
          <p className="text-gray-500 mt-1">
            View insights and export reports
          </p>
        </div>

        {/* Stats Cards */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <StatCard title="Total Tasks" value={stats.totalTasks} icon={<FaTasks />} />
            <StatCard title="Pending Tasks" value={stats.pendingTasks} icon={<FaChartPie />} />
            <StatCard title="Completed Tasks" value={stats.completedTasks} icon={<FaTasks />} />
            <StatCard title="Overdue Tasks" value={stats.overdueTasks} icon={<FaChartPie />} />
          </div>
        )}

        {/* Reports Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <ReportCard
            title="Task Report"
            description="Export complete task details including status, priority and due dates."
            icon={<FaTasks />}
            onDownload={() => downloadReport("tasks")}
          />

          <ReportCard
            title="User Report"
            description="Export all registered users with roles and activity information."
            icon={<FaUsers />}
            onDownload={() => downloadReport("users")}
          />
        </div>
      </div>
    </DashboardLayout>
  )
}

export default Reports
