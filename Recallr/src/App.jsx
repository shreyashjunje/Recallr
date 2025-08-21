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
import PDFViewer from "./components/helper/PdfViewer";
import {
  ComingSoon,
  InDevelopment,
  LaunchingSoon,
} from "./components/maincomponent/StatusComponent";
import QuizMasterHome from "./components/QuizMaster/QuizMasterHome";
import QuizSetup from "./components/QuizMaster/QuizSettings";
import LogoLoader from "./components/ui/LogoLoader";
import QuizInfoPage from "./components/QuizMaster/QuizInfoPage";
import AiSummaryHome from "./pages/aisummary/AiSummaryHome";
import FlashcardGenerator from "./pages/aiflashcards/AiFlashcardsHome";
import FlashcardHome from "./pages/aiflashcards/AiFlashcardsHome";
import FlashcardsSettings from "./pages/aiflashcards/AiFlashcardsSettings";

function App() {
  return (
    <>
      {/* <BrowserRouter> */}
      {/* <Navbar /> */}

      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<SignUpPage />} />
        <Route path="/view" element={<PDFViewer />} />

        <Route path="/" element={<Layout />}>
          <Route path="/" element={<Home />} />

          {/* <Route path="dashboard" element={<Dashboard />} /> */}
          <Route
            path="dashboard"
            element={
              // <LaunchingSoon
              //   title="Dashboard"
              //   message="All your PDFs, beautifully organized in one place."
              //   estimatedDate="Next Week"
              // />
              <LogoLoader />
            }
          />
          <Route path="upload" element={<UploadPDF />} />
          <Route path="library" element={<MyLibrary />} />

          <Route
            path="ai-summaries"
            element={
              // <InDevelopment
              //   title="AI Summaries"
              //   message="Read less. Learn more."
              //   estimatedDate="AUG 2025"
              //   progress={75}
              // />
              <AiSummaryHome />
            }
          />

          <Route path="flashcards" element={<FlashcardHome />} />
          <Route path="flashcards/settings" element={<FlashcardsSettings />} />

          <Route
            path="quizmaster"
            element={
              // <InDevelopment
              //   title="QUIZ Generator"
              //   message="Test yourself instantly."
              //   estimatedDate="AUG 2025"
              //   progress={20}
              // />
              <QuizMasterHome />
            }
          />
          <Route path="quizmaster/quizsettings" element={<QuizSetup />} />

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
        <Route path="/quiz-master/quiz-info" element={<QuizInfoPage />} />
      </Routes>

      {/* </BrowserRouter> */}
    </>
  );
}

export default App;
