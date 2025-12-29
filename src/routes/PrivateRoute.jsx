import { useEffect, useState } from "react";
import { Outlet, Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/auth/AuthProvider";
import { userAuthApi } from "@/api/userAuthApi"

function PrivateRoute() {
  const { user, checked, setUser } = useAuth();
  const [refreshing, setRefreshing] = useState(false);
  const [refreshFailed, setRefreshFailed] = useState(false);
  const location = useLocation();

  useEffect(() => {
     // 인증 확인 완료 + 유저 없음 -> refresh 1회 시도
    if (!checked || user || refreshing || refreshFailed) return;
    
    const tryRefresh = async () => { 
      // if (checked && !user && !refreshing) {
        setRefreshing(true);
        
        try {
          await userAuthApi.refresh(); // refreshToken 쿠키 기반 자동 전송
          const me = await userAuthApi.me(); 
          setUser(me);
        } catch {
          setRefreshFailed(true);
          // navigate("/login", { replace: true });
        } finally {
          setRefreshing(false);
        }
      // }
    };

    tryRefresh();
  }, [checked, user, refreshing, refreshFailed, setUser]);

  // 인증 확인 중 or 토큰 재발급 중
  if (!checked || refreshing) {
    return (
      <div className="flex h-screen items-center justify-center text-gray-500">
        인증 상태 확인 중...
      </div>
    );
  }

  // user가 없으면 로그인 페이지로 리다이렉트
  if (!user) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  return <Outlet />; // 인증된 사용자만 본문 렌더링
}

export default PrivateRoute;
