// axios <-> auth 레이어 연결용 이벤트 버스
export const authEvents = new EventTarget();

/**
 * 전역 401(세션 만료/권한 문제) 발생 시 호출
 * - /user/auth/me 401 은 여기까지 오지 않게 axios에서 차단
 */
export function emitUnauthorized(payload = {}) {
  authEvents.dispatchEvent(
    new CustomEvent("unauthorized", { detail: payload })
  );
}
