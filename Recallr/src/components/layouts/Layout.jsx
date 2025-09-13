import { use, useState } from "react";
import Sidebar from "../maincomponent/Sidebar";
import { Outlet } from "react-router-dom";
import useAuth from "@/hooks/useAuth";
import AdminSidebar from "../admin/AdminSidebar";
import { jwtDecode } from "jwt-decode";

const Layout = () => {
  const { user } = useAuth(); // ✅ safer, already handles token/expiry
  console.log("User in Layout:", user);

  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}

      {user ? (
        user.role === "admin" ? (
          <AdminSidebar isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />
          
        ) : (
          <Sidebar />
        )
      ) : (
        <Sidebar /> // 👈 fallback for not logged in (optional)
      )}


      {user && user.role !== "admin" && ( <Navbar toggleSidebar={toggleSidebar} /> )}
      {/* Main Content */}
      <div className="flex-1 overflow-y-auto px-2 lg:px-6 lg:py-2 py-16 lg:ml-72">
        <Outlet />
      </div>
    </div>
  );
};

export default Layout;
