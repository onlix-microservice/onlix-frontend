import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/userAuth";

function LoginRoute({ children }) {
  const { user, checked } = useAuth();
  const navigate = useNavigate();

  // 이미 로그인된 사용자는 자동 리다이렉트
  useEffect(() => {
    if (checked && user) {
      navigate("/", { replace: true });
    }
  }, [checked, user, navigate]);

  if (!checked) {
    return (
      <div className="flex h-screen items-center justify-center text-gray-500">
        인증 상태 확인 중...
      </div>
    );
  }

  if (user) return null; // redirect 직전 렌더 방지

  return children;
}

export default LoginRoute;
