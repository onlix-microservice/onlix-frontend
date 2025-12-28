import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import LoginRoute from "@/routes/LoginRoute"; 
import PrivateRoute from "@/routes/PrivateRoute";
import Main from "@/pages/Main"; 
import Login from "@/pages/Login";
import ItemDetail from "@/pages/Item/ItemDetail"
import { AuthProvider } from "@/context/userAuth";
import Header from "@/components/Header";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import '@/App.css'

function AppContent() {
  const location = useLocation();
  const skipAuth = location.pathname === "/login";
  const hideHeader = location.pathname === "/login";

  return (
    <AuthProvider skipAuth={skipAuth}>
      {!hideHeader && <Header />}
      <Routes>
        <Route path="/login" element={<LoginRoute><Login /></LoginRoute>} />
        <Route path="/" element={<Main />} />
        {/* 보호된 페이지 */}
        <Route element={<PrivateRoute />}>        
          <Route path="/item/:id" element={<ItemDetail />} />
        </Route>
      </Routes>

      {/* 전역 Toast (로그인 성공/실패 알림용) */}
      <ToastContainer position="top-center" autoClose={3000}
        // hideProgressBar={false}
        // newestOnTop={false}
        // closeOnClick
        // pauseOnHover
      />
    </AuthProvider>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}