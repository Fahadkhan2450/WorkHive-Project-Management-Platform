import React, { useEffect, useState } from "react"
import { FaUsers } from "react-icons/fa"
import Modal from "./Modal"
import axiosInstance from "../utils/axioInstance"

const SelectedUsers = ({ selectedUser, setSelectedUser }) => {
  const [allUsers, setAllUsers] = useState([])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [tempSelectedUser, setTempSelectedUser] = useState([])

  const getAllUsers = async () => {
    try {
      const response = await axiosInstance.get("/users/get-users")
      if (response.data?.users?.length > 0) {
        setAllUsers(response.data.users)
      } else {
        setAllUsers([])
      }
    } catch (error) {
      console.log("Error fetching users:", error)
      setAllUsers([])
    }
  }

  const toggleUserSelection = (userId) => {
    setTempSelectedUser((prev) =>
      prev.includes(userId)
        ? prev.filter((id) => id !== userId)
        : [...prev, userId]
    )
  }

  const handleAssign = () => {
    setSelectedUser(tempSelectedUser)
    setIsModalOpen(false)
  }

  const selectedUserNames = allUsers
    .filter((user) => selectedUser.includes(user._id))
    .map((user) => user.name)

  useEffect(() => {
    getAllUsers()
  }, [])

  useEffect(() => {
    if (selectedUser.length === 0) setTempSelectedUser([])
  }, [selectedUser])

  return (
    <div className="space-y-2 mt-2">
      {selectedUserNames.length === 0 ? (
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-md transition-colors duration-200 shadow-md"
          type="button"
        >
          <FaUsers className="text-lg" /> Add Members
        </button>
      ) : (
        <div
          className="cursor-pointer flex flex-wrap gap-2"
          onClick={() => setIsModalOpen(true)}
        >
          {selectedUserNames.map((name, index) => (
            <span
              key={index}
              className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium"
            >
              {name}
            </span>
          ))}
        </div>
      )}

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={"Select Users"}
      >
        <div className="space-y-4 h-[60vh] overflow-y-auto">
          {allUsers.length === 0 && (
            <p className="text-center text-gray-500">No users available</p>
          )}

          {allUsers.map((user) => (
            <div
              key={user._id}
              className="flex items-center gap-4 p-3 border-b border-gray-300"
            >
              <div className="flex-1">
                <p className="font-medium text-gray-800">{user?.name}</p>
                <p className="text-[13px] text-gray-500">{user?.email}</p>
              </div>

              <input
                type="checkbox"
                checked={tempSelectedUser.includes(user._id)}
                onChange={() => toggleUserSelection(user._id)}
                className="w-4 h-4 text-primary bg-gray-100 border-gray-300 rounded-sm outline-none"
              />
            </div>
          ))}
        </div>

        <div className="flex justify-end gap-4 pt-4">
          <button
            className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-900 rounded-md"
            onClick={() => setIsModalOpen(false)}
          >
            CANCEL
          </button>
          <button
            className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-md"
            onClick={handleAssign}
          >
            DONE
          </button>
        </div>
      </Modal>
    </div>
  )
}

export default SelectedUsers
