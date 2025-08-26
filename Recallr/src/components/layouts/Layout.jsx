import Sidebar from "../maincomponent/Sidebar";
import { Outlet } from "react-router-dom";



const Layout = () => {
  return (
    <div className="flex h-screen">
      <Sidebar />
      <div className="flex-1 overflow-y-auto px-6 py-2">
         <Outlet />
      </div>
    </div>
  );
};

export default Layout;
