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
import ForgotPassword from "./pages/auth/ForgotPassword";
import ResetPassword from "./pages/auth/ResetPassword";
import TermsOfService from "./components/auth/Terms";
import PrivacyPolicy from "./components/auth/PrivacyPolicies";
import HelpSupportPage from "./pages/usernav/HelpSupport";
import ProfilePage from "./pages/usernav/Profile";
import SettingsPage from "./pages/usernav/Settings";
import QuizStatistics from "./components/QuizMaster/QuizStatistics";
import ChangePassword from "./pages/auth/ChangePassword";

function App() {
  // const [quizStarted, setQuizStarted] = useState(false);

  return (
    // <BrowserRouter>
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<SignUpPage />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password" element={<ResetPassword />} />
      <Route path="/change-password" element={<ChangePassword />} />
      <Route path="/view" element={<PDFViewer />} />
      <Route path="/terms" element={<TermsOfService />} />
      <Route path="/privacy" element={<PrivacyPolicy />} />

      <Route path="/" element={<Home />} />

      <Route path="/" element={<Layout />}>
        {/* <Route index element={<Dashboard />} /> */}
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="upload" element={<UploadPDF />} />
        <Route path="library" element={<MyLibrary />} />
        <Route path="pdf/:id" element={<PDFDetailsPage />} />

        <Route path="summify" element={<SummaryHome />} />
        <Route path="summify/:id" element={<AiSummaryDisplay />} />
        <Route path="summify/generate-summary" element={<AiSummaryHome />} />
        <Route path="flashgenius" element={<FlashcardHome />} />
        <Route path="flashgenius/settings" element={<FlashcardsSettings />} />
        <Route
          path="flashgenius/get-flashcards/:id"
          element={<ShowFlashcards />}
        />
        <Route path="quizmaster" element={<QuizMasterHome />} />
        <Route path="quizmaster/quizsettings" element={<QuizSetup />} />

        <Route path="help&support" element={<HelpSupportPage />} />
        <Route path="profile" element={<ProfilePage />} />
        <Route path="settings" element={<SettingsPage />} />
        <Route path="quizstatistics" element={<QuizStatistics />} />

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
