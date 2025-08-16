import { Route } from "react-router-dom";
import "./App.css";
// import Navbar from "./components/Navabar";
import Home from "./pages/Home";
import LoginPage from "./pages/auth/Login";
import { Router, Routes } from "react-router";
import Navbar from "./components/Navabar";
import { Dashboard } from "./pages/Dashboard";
import SignUpPage from "./pages/auth/Register";
import { Upload } from "lucide-react";
import UploadPDF from "./pages/UploadPDF";
import Layout from "./components/layouts/Layout";
import MyLibrary from "./pages/MyLibrary";
import PDFViewer from "./pages/ViewPdf";
import {
  ComingSoon,
  InDevelopment,
  LaunchingSoon,
} from "./components/maincomponent/StatusComponent";

function App() {
  return (
    <>
      {/* <BrowserRouter> */}
      {/* <Navbar /> */}

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<SignUpPage />} />
        <Route path="/view" element={<PDFViewer />} />

        <Route path="/" element={<Layout />}>
          {/* <Route path="dashboard" element={<Dashboard />} /> */}
          <Route
            path="dashboard"
            element={
              <LaunchingSoon
                title="Dashboard"
                message="All your PDFs, beautifully organized in one place."
                estimatedDate="Next Week"
              />
            }
          />
          <Route path="upload" element={<UploadPDF />} />
          <Route path="library" element={<MyLibrary />} />

          <Route
            path="ai-summaries"
            element={
              <InDevelopment
                title="AI Summaries"
                message="Read less. Learn more."
                estimatedDate="AUG 2025"
                progress={75}
              />
            }
          />

          <Route
            path="quiz-generator"
            element={
              <InDevelopment
                title="QUIZ Generator"
                message="Test yourself instantly."
                estimatedDate="AUG 2025"
                progress={20}
              />
            }
          />
          <Route
            path="flashcards"
            element={
              <InDevelopment
                title="Flashcards"
                message="Revise smarter"
                estimatedDate="AUG 2025"
                progress={40}
              />
            }
          />
          <Route
            path="search"
            element={
              <InDevelopment
                title="Search"
                message="Find it. Fast."
                estimatedDate="AUG 2025"
                progress={10}
              />
            }
          />

          <Route
            path="study-groups"
            element={
              <ComingSoon
                title="Study Groups"
                message="Drop PDFs. Get notes. Learn together!"
                estimatedDate="SEP 2025"
                progress={0}
              />
            }
          />

          <Route
            path="voice-assistant"
            element={
              <ComingSoon
                title="Voice assistant"
                message="Your AI study buddy speaks back"
                estimatedDate="SEP 2025"
                progress={0}
              />
            }
          />

          <Route
            path="chat-pdfs"
            element={
              <ComingSoon
                title="Chat with PDFs"
                message="Ask questions. Get answers. Right from your files.!"
                estimatedDate="OCT 2025"
                progress={0}
              />
            }
          />
        </Route>
      </Routes>

      {/* </BrowserRouter> */}
    </>
  );
}

export default App;
