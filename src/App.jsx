import './App.css'
import { BrowserRouter, Routes, Route } from "react-router-dom";
import LoginRoute from "./routes/LoginRoute"; 
import MainRoute from "./routes/MainRoute"; 

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MainRoute />} />
        <Route path="/login" element={<LoginRoute />} />
      </Routes>

      {/* 전역 Toast (로그인 성공/실패 알림용) */}
      <ToastContainer
        position="top-center"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        pauseOnHover
      />
    </BrowserRouter>
  );
}

export default App;