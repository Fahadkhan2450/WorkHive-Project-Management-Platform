import React, { useEffect, useState } from "react"
import DashboardLayout from "../../components/DashboardLayout"
import { useNavigate } from "react-router-dom"
import axiosInstance from "../../utils/axioInstance"
import TaskStatusTabs from "../../components/TaskStatusTabs"
import { FaFileLines } from "react-icons/fa6"
import TaskCard from "../../components/TaskCard"
import toast from "react-hot-toast"

const ManageTasks = () => {
  const [allTasks, setAllTasks] = useState([])
  const [tabs, setTabs] = useState([])
  const [filterStatus, setFilterStatus] = useState("All")

  const navigate = useNavigate()

  const getAllTasks = async () => {
    try {
      const response = await axiosInstance.get("/tasks", {
        params: {
          status: filterStatus === "All" ? "" : filterStatus,
        },
      })

      if (response?.data?.tasks) {
        setAllTasks(response.data.tasks)
      } else {
        setAllTasks([])
      }

      const statusSummary = response.data?.statusSummary || {}

      setTabs([
        { label: "All", count: statusSummary.all || 0 },
        { label: "Pending", count: statusSummary.pendingTasks || 0 },
        { label: "In Progress", count: statusSummary.inProgressTasks || 0 },
        { label: "Completed", count: statusSummary.completedTasks || 0 },
      ])
    } catch (error) {
      console.error("Error fetching tasks:", error)
      toast.error("Failed to load tasks")
    }
  }

  const handleClick = (task) => {
    navigate("/admin/create-task", { state: { taskId: task._id } })
  }

  const handleDownloadReport = async () => {
    try {
      const response = await axiosInstance.get("/reports/export/tasks", {
        responseType: "blob",
      })

      const url = window.URL.createObjectURL(new Blob([response.data]))
      const link = document.createElement("a")
      link.href = url
      link.setAttribute("download", "tasks_details.xlsx")
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      window.URL.revokeObjectURL(url)
    } catch (error) {
      console.error("Download error:", error)
      toast.error("Error downloading report")
    }
  }

  useEffect(() => {
    getAllTasks()
  }, [filterStatus])

  return (
    <DashboardLayout activeMenu="Manage Task">
      <div className="my-6 px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between md:items-center gap-4 mb-6">
          <div className="flex items-center gap-4">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-800">
              My Tasks
            </h2>

            <button
              className="md:hidden px-4 py-2 bg-blue-600 text-white rounded-lg"
              onClick={handleDownloadReport}
            >
              Download
            </button>
          </div>

          {allTasks.length > 0 && (
            <div className="flex flex-col sm:flex-row items-center gap-4">
              <TaskStatusTabs
                tabs={tabs}
                activeTab={filterStatus}
                setActiveTab={setFilterStatus}
              />

              <button
                className="hidden md:flex items-center gap-2 px-4 py-2.5 bg-blue-600 text-white rounded-lg"
                onClick={handleDownloadReport}
              >
                <FaFileLines />
                Download Report
              </button>
            </div>
          )}
        </div>

        {allTasks.length === 0 ? (
          <div className="text-center text-gray-500 mt-20">
            No tasks found
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {allTasks.map((task) => (
              <TaskCard
                key={task._id}
                title={task.title}
                description={task.description}
                priority={task.priority}
                status={task.status}
                progress={task.progress}
                createdAt={task.createdAt}
                dueDate={task.dueDate}
                // Display assigned user NAMES only
                assignedTo={
                  Array.isArray(task.assignedTo)
                    ? task.assignedTo.map((user) => user.name)
                    : []
                }
                attachmentCount={task.attachments?.length || 0}
                completedTodoCount={task.completedCount || 0}
                todoChecklist={task.todoChecklist || []}
                onClick={() => handleClick(task)}
              />
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}

export default ManageTasks
