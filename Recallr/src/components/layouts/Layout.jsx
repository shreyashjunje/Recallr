import Sidebar from "../maincomponent/Sidebar";


const Layout = ({ children }) => {
  return (
    <div className="flex h-screen bg-black text-white">
      <Sidebar />
      <div className="flex-1 overflow-y-auto p-6">
        {children}
      </div>
    </div>
  );
};

export default Layout;
