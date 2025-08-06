import {
  Home,
  Upload,
  Library,
  Search,
  Bot,
  FileText,
  PenTool,
  Mic,
  Users,
  MessageCircle,
} from "lucide-react";
import logo from "../../assets/newLogo.png";
import SidebarUserNav from "../../components/dashboard/helper/SidebarUserNav";

const Sidebar = () => {
  return (
    <aside className="w-64 h-screen bg-zinc-900 text-white flex flex-col justify-between p-4">
      <div>
        {/* Logo */}
        {/* <h1 className="text-xl font-bold mb-6">PDF Platform</h1> */}
        <div className="flex-shrink-0 flex mb-6 gap-1">
          <img
            src={logo}
            alt="Recallr logo"
            className="h-8 w-auto md:h-14"
            onClick={() => navigate("/")}
            style={{ cursor: "pointer" }}
          />
          <div>
            <h1 className="text-3xl sm:text-4xl lg:text-2xl xl:text-xl font-bold text-white mt-2">
              Recallr
            </h1>
            <h6 className="text-sm">AI-Powered Learning</h6>
          </div>
        </div>

        {/* Main Navigation */}
        <nav className="">
          <SidebarItem icon={<Home size={18} />} text="Dashboard" />
          <SidebarItem icon={<Upload size={18} />} text="Upload PDFs" />
          <SidebarItem icon={<Library size={18} />} text="My Library" />
          <SidebarItem icon={<Search size={18} />} text="Search" />
        </nav>

        {/* AI Features */}
        <div className="mt-6">
          <h2 className="text-sm font-semibold text-gray-400 mb-2">
            AI Features
          </h2>
          <nav className="">
            <SidebarItem icon={<FileText size={18} />} text="AI Summaries" />
            <SidebarItem icon={<PenTool size={18} />} text="Quiz Generator" />
            <SidebarItem icon={<Library size={18} />} text="Flashcards" />
            <SidebarItem icon={<Mic size={18} />} text="Voice Assistant" />
          </nav>
        </div>

        {/* Community */}
        <div className="mt-6">
          <h2 className="text-sm font-semibold text-gray-400 mb-2">
            Community
          </h2>
          <nav className="">
            <SidebarItem icon={<Users size={18} />} text="Study Groups" />
            <SidebarItem
              icon={<MessageCircle size={18} />}
              text="Chat with PDFs"
            />
          </nav>
        </div>
      </div>

      <SidebarUserNav />``
    </aside>
  );
};

const SidebarItem = ({ icon, text }) => (
  <div className="flex items-center gap-3 px-2 py-2 rounded-md hover:bg-zinc-800 cursor-pointer transition">
    {icon}
    <span>{text}</span>
  </div>
);

export default Sidebar;
