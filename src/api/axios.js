import axios from "axios";
import { emitUnauthorized } from "@/auth/authEvents";

const instance = axios.create({
  baseURL: "/api",
  headers: { "Content-Type": "application/json" }, 
  withCredentials: true // 쿠키 자동 포함
});

instance.interceptors.request.use((config) => {
  return config; // 쿠키만 자동 전송
});

instance.interceptors.response.use(
  res => {
    const body = res.data;

    // 표준 응답만 언래핑
    if (
      body &&
      typeof body === "object" &&
      "code" in body &&
      "data" in body
    ) {
      return body.data;
    }

    // 비표준 응답은 그대로
    return body;
  },
  err => {
    const status = err.response?.status;
    const url = err.config?.url || "";

    const isAuthMe = url.includes("/user/auth/me");

    // /auth/me의 401은 "비로그인" 정상 플로우로 처리(서버에서는 401 리턴)
    if (status === 401 && isAuthMe) {
      return Promise.reject(err);
    }

    // 그 외에는 
    if (status === 401) {
      emitUnauthorized({ url, status });
      // useAuth().setUser(null);
    }

    return Promise.reject(err);
  }
);

export default instance;