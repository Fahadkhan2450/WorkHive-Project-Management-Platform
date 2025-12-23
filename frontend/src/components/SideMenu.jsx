import React, { useEffect, useState } from "react";
import axiosInstance from "../utils/axioInstance";
import { useDispatch, useSelector } from "react-redux";
import { signOutSuccess } from "../redux/slice/userSlice";
import { useNavigate } from "react-router-dom";
import { SIDE_MENU_DATA, USER_SIDE_MENU_DATA } from "../utils/data";

const DEFAULT_AVATAR =
  "https://cdn-icons-png.flaticon.com/512/149/149071.png";

const SideMenu = ({ activeMenu }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [sideMenuData, setSideMenuData] = useState([]);
  const { currentUser } = useSelector((state) => state.user);

  const handleClick = (route) => {
    if (route === "logout") {
      handleLogout();
      return;
    }
    navigate(route);
  };

  const handleLogout = async () => {
    try {
      await axiosInstance.post("/auth/sign-out");
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      dispatch(signOutSuccess());
      navigate("/login");
    }
  };

  useEffect(() => {
    if (currentUser) {
      setSideMenuData(
        currentUser.role === "admin"
          ? SIDE_MENU_DATA
          : USER_SIDE_MENU_DATA
      );
    }
  }, [currentUser]);

  return (
    <div className="w-64 p-6 h-full flex flex-col border-r border-gray-200 bg-white">
      {/* Profile Section */}
      <div className="flex flex-col items-center mb-8">
        <div className="w-20 h-20 rounded-full overflow-hidden mb-4 border-2 border-blue-300 shadow-sm">
          <img
            src={currentUser?.profileImageUrl || DEFAULT_AVATAR}
            alt="Profile"
            onError={(e) => {
              e.target.src = DEFAULT_AVATAR;
            }}
            className="w-full h-full object-cover"
          />
        </div>

        {currentUser?.role === "admin" && (
          <span className="mb-2 px-3 py-1 text-xs font-semibold text-blue-700 bg-blue-100 rounded-full">
            Admin
          </span>
        )}

        <h5 className="text-lg font-semibold text-gray-800 text-center">
          {currentUser?.name}
        </h5>

        <p className="text-sm text-gray-500 text-center">
          {currentUser?.email}
        </p>
      </div>

      {/* Menu Items */}
      <div className="flex-1 overflow-y-auto">
        {sideMenuData.map((item, index) => {
          const isActive = activeMenu === item.label;

          return (
            <button
              key={`menu_${index}`}
              onClick={() => handleClick(item.path)}
              className={`w-full flex items-center gap-4 text-[15px] rounded-lg py-3 px-4 mb-2 transition-all
                ${
                  isActive
                    ? "text-blue-600 bg-blue-50 font-medium"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
            >
              <item.icon className="text-xl" />
              {item.label}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default SideMenu;
