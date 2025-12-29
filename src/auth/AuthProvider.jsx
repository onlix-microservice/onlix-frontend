import { createContext, useContext, useEffect, useRef, useState } from "react";
import { authEvents } from "@/auth/authEvents";
import { userAuthApi } from "@/api/userAuthApi";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [checked, setChecked] = useState(false);
  const calledRef = useRef(false);

  useEffect(() => {
    const onUnauthorized = () => {
      setUser(null);
    };

    authEvents.addEventListener("unauthorized", onUnauthorized);
    return () => authEvents.removeEventListener("unauthorized", onUnauthorized);
  }, []);

  // refreshToken 쿠키 존재 여부 확인
  const hasRefreshToken = () => {
    const cookies = document.cookie.split(';');
    return cookies.some(cookie => {
      const [name] = cookie.trim().split('=');
      return name === 'refreshToken';
    });
  };

  useEffect(() => {
    // StrictMode 중복 호출 방지
    if (calledRef.current) return;
    calledRef.current = true;

    const fetchAuth = async () => {
      try {
        const me = await userAuthApi.me();
        setUser(me);
      } catch (err) {
        // 401 에러이고 refreshToken이 있으면 재발급 시도
        if (err.response?.status === 401 && hasRefreshToken()) {
          try {
            await userAuthApi.refresh();
            const me = await userAuthApi.me();
            setUser(me);
          } catch {
            setUser(null);
          }
        } else {
          setUser(null);
        }
      } finally {
        setChecked(true);
      }
    };

    fetchAuth();
  }, []);

  return (
    <AuthContext.Provider value={{ user, checked, setUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
