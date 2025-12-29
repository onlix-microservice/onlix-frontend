import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import LoginRoute from "@/routes/LoginRoute"; 
import PrivateRoute from "@/routes/PrivateRoute";
import Main from "@/pages/Main"; 
import Login from "@/pages/Login";
import ItemDetail from "@/pages/Item/ItemDetail"
import ItemList from "@/pages/Item/ItemList"
import { AuthProvider } from "@/auth/AuthProvider";
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
        <Route path="/items" element={<ItemList />} />
        <Route path="/item/:id" element={<ItemDetail />} />
        {/* 보호된 페이지 */}
        <Route element={<PrivateRoute />}>        
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