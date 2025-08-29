import { Routes, Route } from "react-router-dom";
import "./App.css";
import Home from "./pages/Home";
import LoginPage from "./pages/auth/Login";
import SignUpPage from "./pages/auth/Register";
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
import QuizInfoPage from "./components/QuizMaster/QuizInfoPage";
import AiSummaryHome from "./pages/aisummary/AiSummaryHome";
import FlashcardHome from "./pages/aiflashcards/AiFlashcardsHome";
import FlashcardsSettings from "./pages/aiflashcards/AiFlashcardsSettings";
import Dashboard from "./pages/Dashboard";
import AiSummaryDisplay from "./pages/aisummary/AiSummaryDisplay";
import ShowFlashcards from "./pages/aiflashcards/ShowFlashcards";
// import { useState } from "react";
import { ThemeProvider } from "./context/ThemeContext";
import QuizPage from "./components/QuizMaster/QuizPage";
import SummaryHome from "./pages/aisummary/SummaryHome";
import PDFDetailsPage from "./pages/PdfDetails";

function App() {
  // const [quizStarted, setQuizStarted] = useState(false);

  return (
    // <BrowserRouter>
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<SignUpPage />} />
      <Route path="/view" element={<PDFViewer />} />

      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="upload" element={<UploadPDF />} />
        <Route path="library" element={<MyLibrary />} />
        <Route path="pdf/:id" element={<PDFDetailsPage />} />

        <Route path="ai-summaries" element={<SummaryHome />} />
        <Route path="ai-summaries/:id" element={<AiSummaryDisplay />} />
        <Route
          path="ai-summaries/generate-summary"
          element={<AiSummaryHome />}
        />
        <Route path="flashcards" element={<FlashcardHome />} />
        <Route path="flashcards/settings" element={<FlashcardsSettings />} />
        <Route
          path="flashcards/get-flashcards/:id"
          element={<ShowFlashcards />}
        />
        <Route path="quizmaster" element={<QuizMasterHome />} />
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

      <Route
        path="/quizmaster/:id"
        element={
          <ThemeProvider>
            <QuizPage />
          </ThemeProvider>
        }
      />
    </Routes>
    // </BrowserRouter>
  );
}

export default App;
