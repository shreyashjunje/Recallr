import { Route } from "react-router-dom";
import "./App.css";
// import Navbar from "./components/Navabar";
import Home from "./pages/Home";
import LoginPage from "./pages/auth/Login";
import { Routes } from "react-router";
import Navbar from "./components/Navabar";
import { Dashboard } from "./pages/Dashboard";
import SignUpPage from "./pages/auth/Register";

function App() {
  return (
    <>
      {/* <BrowserRouter> */}
        {/* <Navbar /> */}

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<SignUpPage/>}/>
          <Route path="/dashboard" element={<Dashboard/>}/>
        </Routes>
      {/* </BrowserRouter> */}
    </>
  );
}

export default App;
