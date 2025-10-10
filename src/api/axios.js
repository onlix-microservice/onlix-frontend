import axios from "axios";

const instance = axios.create({
  baseURL: "http://localhost:8081/api", // Spring Boot Gateway
  headers: { "Content-Type": "application/json" }, 
  withCredentials: true // 쿠키 자동 포함
});

instance.interceptors.request.use((config) => {
  return config; // 쿠키만 자동 전송
});

instance.interceptors.response.use(
  res => res,
  err => {
    const status = err.response?.status;
    const url = err.config?.url || "";

    const isAuthMe = url.endsWith("/api/auth/me");

    if (status === 401 && !isAuthMe) {
      useAuth().setUser(null);
      console.warn("401 detected → user will be nullified by AuthProvider");
    }

    return Promise.reject(err);
  }
);

export default instance;