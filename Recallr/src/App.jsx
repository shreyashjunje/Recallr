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
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="upload" element={<UploadPDF />} />
          <Route path="library" element={<MyLibrary />} />

        </Route>  
         
        </Routes>

        
      

      {/* </BrowserRouter> */}
    </>
  );
}

export default App;
