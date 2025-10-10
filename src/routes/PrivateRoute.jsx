import { useEffect, useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import api from "@/api/axios";
import { useAuth } from "@/context/userAuth";

function PrivateRoute() {
  const { user, checked, setUser } = useAuth();
  const [refreshing, setRefreshing] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const tryRefresh = async () => {
      // 인증 확인 완료 + 유저 없음 → refresh 시도
      if (checked && !user && !refreshing) {
        setRefreshing(true);
        
        try {
          await api.post("/auth/refresh"); // refreshToken 쿠키 기반 자동 전송
          const res = await api.get("/auth/me"); // 새 accessToken으로 재요청
          setUser(res.data);
        } catch {
          navigate("/login", { replace: true });
        } finally {
          setRefreshing(false);
        }
      }
    };

    tryRefresh();
  }, [checked, user, navigate, refreshing, setUser]);

  // 인증 확인 중 or 토큰 재발급 중
  if (!checked || refreshing) {
    return (
      <div className="flex h-screen items-center justify-center text-gray-500">
        인증 상태 확인 중...
      </div>
    );
  }

  // user가 없으면 로그인 페이지로 리다이렉트
  if (!user) return null;

  return <Outlet />; // 인증된 사용자만 본문 렌더링
}

export default PrivateRoute;
