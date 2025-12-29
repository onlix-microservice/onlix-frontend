import { useState } from "react";
import { useNavigate, useLocation  } from "react-router-dom";
import { toast } from "react-toastify";
import api from "@/api/axios";
import { getDeviceId } from "@/utils/deviceId";
import { useAuth } from "@/auth/AuthProvider";
import { userAuthApi } from "@/api/userAuthApi"

export default function Login() {
  const [email, setEmail] = useState("");
  const [pw, setPw] = useState("");
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();
  const { setUser } = useAuth();

  const handleLogin = async () => {
    setError(null); // 이전 에러 초기화
    try {
      const payload = {
        loginId: email,
        password: pw,
        deviceId: getDeviceId()
      }
      
      const user = await userAuthApi.login(payload);
      setUser(user);

      const from = location.state?.from?.pathname || "/"; // 원래 있던 페이지로 redirect 없으면 home으로
      navigate(from, { replace: true });
    } catch (err) {
      const status = err.response?.status;
      if (status === 401 || status === 400) {
        setError("이메일 또는 비밀번호가 올바르지 않습니다.");
        return;
      }

      if (err.response) {
        toast.error(err.response.data.message);
      } else {
        toast.error(
          <div className="text-sm font-medium text-red-600">
            서버에 연결할 수 없습니다.
            <br />
            <span className="text-gray-700">잠시 후 다시 시도해주세요.</span>
          </div>
        );
      }
    }
  };

  return (
    <div className="flex h-screen items-center justify-center bg-gray-100">
      <div className="w-full max-w-sm bg-white rounded-2xl shadow-lg p-8">
        <div className="text-center mb-6">
          <h1 className="text-3xl font-extrabold text-blue-600">ONLIX</h1>
          <p className="text-sm text-gray-500">선착순 구매 플랫폼</p>
        </div>

        <div className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              이메일
            </label>
            <input
              type="text"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (error) setError(null);
              }}
              placeholder="example@email.com"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg 
                         focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              비밀번호
            </label>
            <input
              type="password"
              value={pw}
              onChange={(e) => {
                setPw(e.target.value);
                if (error) setError(null);
              }}
              placeholder="••••••••"
              className={`w-full px-3 py-2 border border-gray-300 rounded-lg 
                        ${error 
                          ? "border-red-500 focus:ring-red-500" 
                          : "border-gray-300 focus:ring-blue-500"}`}
                        //  focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
            {error && (
              <p className="text-sm text-red-600 mt-2">
                {error}
              </p>
            )}
          </div>

          <button
            type="button"
            onClick={handleLogin}
            className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 rounded-lg transition"
          >
            로그인
          </button>
        </div>

        <p className="mt-6 text-center text-sm text-gray-600">
          계정이 없으신가요?{" "}
          <a href="/register" className="text-blue-500 hover:underline">
            회원가입
          </a>
        </p>
      </div>
    </div>
  );
}