import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import DashboardLayout from "../../components/DashboardLayout";
import { MdDelete } from "react-icons/md";
import DatePicker from "react-datepicker";

import "react-datepicker/dist/react-datepicker.css";
import SelectedUsers from "../../components/SelectedUsers";
import TodoListInput from "../../components/TodoListInput";
import AddAttachmentsInput from "../../components/AddAttachmentsInput";
import axiosInstance from "../../utils/axioInstance";
import toast from "react-hot-toast";
import Modal from "../../components/Modal";
import DeleteAlert from "../../components/DeleteAlert";

const CreateTask = () => {
  const location = useLocation();
  const { taskId } = location.state || {};
  const navigate = useNavigate();

  const [taskData, setTaskData] = useState({
    title: "",
    description: "",
    priority: "Low",
    dueDate: null,
    assignedTo: [],
    todoChecklist: [],
    attachments: [],
  });

  const [currentTask, setCurrentTask] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [openDeleteAlert, setOpenDeleteAlert] = useState(false);

  const handleValueChange = (key, value) => {
    setTaskData((prevData) => ({
      ...prevData,
      [key]: value,
    }));
  };

  const clearData = () => {
    setTaskData({
      title: "",
      description: "",
      priority: "Low",
      dueDate: null,
      assignedTo: [],
      todoChecklist: [],
      attachments: [],
    });
  };

  // Create task
  const createTask = async () => {
    try {
      const todolist = taskData.todoChecklist?.map((item) => ({
        text: item,
        completed: false,
      }));

      await axiosInstance.post("/tasks/create", {
        ...taskData,
        dueDate: taskData.dueDate ? taskData.dueDate.toISOString() : null,
        todoChecklist: todolist,
      });

      toast.success("Task created successfully!");
      clearData();
    } catch (error) {
      console.log("Error creating task: ", error);
      toast.error("Error creating task!");
    }
  };

  // Update task
  const updateTask = async () => {
    try {
      const todolist = taskData.todoChecklist?.map((item) => {
        const prevTodoChecklist = currentTask?.todoChecklist || [];
        const matchedTask = prevTodoChecklist.find((task) => task.text === item);
        return {
          text: item,
          completed: matchedTask ? matchedTask.completed : false,
        };
      });

      await axiosInstance.put(`/tasks/${taskId}`, {
        ...taskData,
        dueDate: taskData.dueDate ? taskData.dueDate.toISOString() : null,
        todoChecklist: todolist,
      });

      toast.success("Task updated successfully!");
    } catch (error) {
      console.log("Error updating task: ", error);
      toast.error("Error updating task!");
    }
  };

  const handleSubmit = async () => {
    setError("");

    if (!taskData.title.trim()) return setError("Title is required!");
    if (!taskData.description.trim()) return setError("Description is required!");
    if (!taskData.dueDate) return setError("Due date is required!");
    if (!taskData.assignedTo || taskData.assignedTo.length === 0)
      return setError("Task is not assigned to any member!");
    if (!taskData.todoChecklist || taskData.todoChecklist.length === 0)
      return setError("Add at least one todo task!");

    taskId ? updateTask() : createTask();
  };

  // Get task details by ID
  const getTaskDetailsById = async () => {
    try {
      const response = await axiosInstance.get(`/tasks/${taskId}`);
      if (response.data) {
        const taskInfo = response.data;
        setCurrentTask(taskInfo);

        setTaskData({
          title: taskInfo?.title,
          description: taskInfo?.description,
          priority: taskInfo?.priority,
          dueDate: taskInfo?.dueDate ? new Date(taskInfo.dueDate) : null,
          assignedTo: taskInfo?.assignedTo
            ?.map((item) => item?._id?.toString())
            .filter(Boolean),
          todoChecklist: taskInfo?.todoChecklist?.map((item) => item?.text) || [],
          attachments: taskInfo?.attachments || [],
        });
      }
    } catch (error) {
      console.log("Error fetching task details: ", error);
    }
  };

  // Delete task
  const deleteTask = async () => {
    try {
      await axiosInstance.delete(`/tasks/${taskId}`);
      setOpenDeleteAlert(false);
      toast.success("Task deleted successfully!");
      navigate("/admin/tasks");
    } catch (error) {
      console.log("Error deleting task: ", error);
    }
  };

  useEffect(() => {
    if (taskId) getTaskDetailsById();
  }, [taskId]);

  return (
    <DashboardLayout activeMenu={taskId ? "Update Task" : "Create Task"}>
      <div className="p-6">
        <div className="bg-white rounded-lg shadow-md p-6 space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold text-gray-800">
              {taskId ? "Update Task" : "Create New Task"}
            </h2>
            {taskId && (
              <button
                className="flex items-center gap-2 text-red-600 hover:text-red-800"
                onClick={() => setOpenDeleteAlert(true)}
              >
                <MdDelete className="text-lg" /> Delete Task
              </button>
            )}
          </div>

          {error && (
            <div className="p-3 bg-red-100 text-red-700 rounded-md">{error}</div>
          )}

          <div className="space-y-4">
            {/* Task Title */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Task Title <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                placeholder="Enter task title"
                value={taskData.title}
                onChange={(e) => handleValueChange("title", e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                rows={4}
                placeholder="Enter task description"
                value={taskData.description}
                onChange={(e) => handleValueChange("description", e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Priority & Due Date */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Priority
                </label>
                <select
                  value={taskData.priority}
                  onChange={(e) => handleValueChange("priority", e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="Low">Low</option>
                  <option value="Medium">Medium</option>
                  <option value="High">High</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Due Date
                </label>
                <DatePicker
                  selected={taskData.dueDate}
                  onChange={(date) => handleValueChange("dueDate", date)}
                  minDate={new Date()}
                  placeholderText="Select due date"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* Assign To */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Assign To
              </label>
              <SelectedUsers
                selectedUser={taskData.assignedTo}
                setSelectedUser={(value) => handleValueChange("assignedTo", value)}
              />
            </div>

            {/* TODO Checklist */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                TODO Checklist
              </label>
              <TodoListInput
                todoList={taskData.todoChecklist}
                setTodoList={(value) => handleValueChange("todoChecklist", value)}
              />
            </div>

            {/* Attachments */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Add Attachments
              </label>
              <AddAttachmentsInput
                attachments={taskData.attachments}
                setAttachments={(value) => handleValueChange("attachments", value)}
              />
            </div>

            {/* Submit Button */}
            <div className="flex justify-end mt-4">
              <button
                className="px-6 py-2 bg-green-500 border border-green-300 rounded-md text-white hover:bg-green-700 cursor-pointer"
                onClick={handleSubmit}
                type="button"
              >
                {taskId ? "UPDATE TASK" : "CREATE TASK"}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Delete Task Modal */}
      <Modal
        isOpen={openDeleteAlert}
        onClose={() => setOpenDeleteAlert(false)}
        title="Delete Task"
      >
        <DeleteAlert
          content="Are you sure you want to delete this task?"
          onDelete={deleteTask}
        />
      </Modal>
    </DashboardLayout>
  );
};

export default CreateTask;
