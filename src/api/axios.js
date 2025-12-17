import axios from "axios";

const instance = axios.create({
  baseURL: "/api",
  headers: { "Content-Type": "application/json" }, 
  withCredentials: true // 쿠키 자동 포함
});

instance.interceptors.request.use((config) => {
  return config; // 쿠키만 자동 전송
});

instance.interceptors.response.use(
  res => res,
  err => {
    if (err.response && err.response.status === 401) {
      window.location.href = "/login"; 
    }
    return Promise.reject(err);
  }
);

export default instance;