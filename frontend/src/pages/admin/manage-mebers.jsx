import React, { useEffect, useState } from "react"
import axiosInstance from "../../utils/axioInstance"
import DashboardLayout from "../../components/DashboardLayout"
import { FaFileAlt } from "react-icons/fa"
import UserCard from "../../components/UserCard"
import toast from "react-hot-toast"

const ManageUsers = () => {
  const [allUsers, setAllUsers] = useState([])

  const getAllUsers = async () => {
    try {
      const response = await axiosInstance.get("/users/get-users")

      // ✅ SAFE handling (array OR object)
      const users =
        Array.isArray(response.data)
          ? response.data
          : response.data?.users || []

      setAllUsers(users)
    } catch (error) {
      console.error("Error fetching users:", error)
      toast.error("Failed to load users")
    }
  }

  const handleDownloadReport = async () => {
    try {
      const response = await axiosInstance.get("/reports/export/users", {
        responseType: "blob",
      })

      const url = window.URL.createObjectURL(new Blob([response.data]))
      const link = document.createElement("a")
      link.href = url
      link.setAttribute("download", "user_details.xlsx")

      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      window.URL.revokeObjectURL(url)
    } catch (error) {
      console.error("Download error:", error)
      toast.error("Error downloading user report")
    }
  }

  useEffect(() => {
    getAllUsers()
  }, [])

  return (
    <DashboardLayout activeMenu="Team Members">
      <div className="mt-5 mb-10 px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <h2 className="text-2xl font-semibold text-gray-800">
            Team Members
          </h2>

          <button
            type="button"
            className="flex items-center gap-2 px-4 py-2 bg-yellow-100 hover:bg-yellow-200 text-gray-800 rounded-lg font-medium shadow-sm"
            onClick={handleDownloadReport}
          >
            <FaFileAlt />
            Download Report
          </button>
        </div>

        {/* EMPTY STATE */}
        {allUsers.length === 0 ? (
          <div className="text-center text-gray-500 mt-16">
            No users found
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
            {allUsers.map((user) => (
              <UserCard key={user._id} userInfo={user} />
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}

export default ManageUsers
