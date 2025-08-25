import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { BrowserRouter } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";
import { AuthProvider } from "./context/AuthContext";
import { QuizProvider } from "./context/QuizContext";
import { ThemeProvider } from "./context/ThemeContext";

createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <AuthProvider>
      {/* <ThemeProvider> */}
      <QuizProvider>
        <App />
      </QuizProvider>
      {/* </ThemeProvider> */}
    </AuthProvider>
    <ToastContainer
      position="top-right"
      toastClassName="custom-toast"
      newestOnTop
      autoClose={3000}
      hideProgressBar={false}
      closeOnClick
      pauseOnHover
      draggable
    />{" "}
  </BrowserRouter>
);
