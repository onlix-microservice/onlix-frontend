import { createContext, useContext, useEffect, useRef, useState } from "react";
import api from "@/api/axios";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [checked, setChecked] = useState(false);
  const calledRef = useRef(false);

  useEffect(() => {
    // StrictMode 중복 호출 방지
    if (calledRef.current) return;
    calledRef.current = true;

    const fetchAuth = async () => {
      try {
        const res = await api.get("/auth/me");
        setUser(res.data);
      } catch {
        setUser(null);
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
