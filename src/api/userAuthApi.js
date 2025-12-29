import api from "@/api/axios";

export const userAuthApi = {
  /**
   * 로그인
   */
  login(payload) {
    return api.post("/user/auth/login", payload);
  },

  /**
   * 현재 로그인 사용자 조회
   */
  me() {
    return api.get("/user/auth/me");
  },

  /**
   * 토큰 재발급
   */
  refresh() {
    return api.post("/user/auth/refresh");
  },

  /**
   * 로그아웃
   */
  logout() {
    return api.post("/user/auth/logout");
  },
};