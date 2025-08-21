import { Routes, Route } from "react-router-dom";
import Login from "./pages/Auth/Login";
import { ToastContainer } from "react-toastify";
import Signup from "./pages/Auth/Signup";
import { Navbar } from "./components/Navbar";
import Dashboard from "./pages/Dashboard/Dashboard";
import SearchPage from "./pages/Search/SearchPage";
import PublicFileView from "./pages/Share/PublicFileView ";
import SharedWithMeList from "./pages/Share/SharedWithMeList";
import ForgotPassword from "./pages/Auth/ForgotPassword";
import Home from "./pages/Auth/Home";





function App() {
  return (
    <>
      <Navbar/>
      <Routes>
      
        <Route path="/" element={<Home />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/search" element={<SearchPage />} /> 
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup/>} />
        <Route path="/forgot-password" element={<ForgotPassword />} />


        <Route path="/shared/:token" element={<PublicFileView />} />
        <Route path="/shared-with-me" element={<SharedWithMeList />} />
       
      </Routes>

      {/* ✅ Toast container */}
      <ToastContainer position="top-center" autoClose={5000} pauseOnFocusLoss={false} />
    </>
  );
}

export default App;
