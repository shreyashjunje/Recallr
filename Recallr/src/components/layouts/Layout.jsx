import Sidebar from "../maincomponent/Sidebar";
import { Outlet } from "react-router-dom";



const Layout = () => {
  return (
    <div className="flex h-screen">
      <Sidebar />
      <div className="flex-1 overflow-y-auto p-6">
         <Outlet />
      </div>
    </div>
  );
};

export default Layout;
