import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "@/api/axios";

export default function Home() {
  const navigate = useNavigate();

  // useEffect(() => {
  //   const fetchUser = async () => {
  //   };

  //   fetchUser();
  // }, [navigate]);

  const handleLogout = async () => {
    try {
      await api.post("/auth/logout");

      navigate("/login"); 
    } catch (err) {
      console.error("로그아웃 실패:", err);
    }
  };

  return (
    <div className="flex h-screen items-center justify-center bg-gray-100">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8 text-center">
        <h1 className="text-3xl font-extrabold text-blue-600 mb-4">메인 화면</h1>
        <p className="text-gray-700 mb-6">
          로그인 성공 화면입니다🎉
        </p>
        <button
          onClick={handleLogout}
          className="w-full bg-red-500 hover:bg-red-600 text-white py-2 rounded-lg transition"
        >
          로그아웃
        </button>
      </div>
    </div>
  );
}
