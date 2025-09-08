import Sidebar from "../maincomponent/Sidebar";
import { Outlet } from "react-router-dom";

// const Layout = () => {
//   return (
//     <div className="flex min-h-screen ">
//       <Sidebar />
//       <div className="flex-1 overflow-y-auto px-6 py-2">
//          <Outlet />
//       </div>
//     </div>
//   );
// };
const Layout = () => {
  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto px-2 lg:px-6 lg:py-2 py-16 lg:ml-72">
        <Outlet />
      </div>
    </div>
  );
};

export default Layout;
