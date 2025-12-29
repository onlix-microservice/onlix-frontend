import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Footer from "@/components/Footer";
import { catalogApi } from "@/api/catalogApi";

export default function ItemList() {
  const navigate = useNavigate();
  const [items, setItems] = useState([]);
  const [now, setNow] = useState(Date.now());

  /* 상품 조회 */
  useEffect(() => {
    const fetchItems = async () => {
      try {
        const products = await catalogApi.getProducts();
        setItems(products); 
      } catch (err) {
        console.error("상품 목록 조회 중 오류:", err);
      }
    };

    fetchItems();
  }, []);

  // 타이머
  useEffect(() => {
    const timer = setInterval(() => {
      setNow(Date.now());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // 날짜 포맷
  const formatDateTime = (datetimeStr) => {
    const date = new Date(datetimeStr);
    const month = date.getMonth() + 1;
    const day = date.getDate();
    let hour = date.getHours();
    const minute = date.getMinutes();
    const period = hour < 12 ? "오전" : "오후";
    hour = hour % 12 || 12;
    return `${month}월 ${day}일 ${period} ${hour}시${
      minute > 0 ? ` ${minute}분` : ""
    }`;
  };

  // 남은 시간 포맷
  const formatTimeLeft = (diff) => {
    if (diff <= 0) return "00:00:00";
    const totalHours = Math.floor(diff / (1000 * 60 * 60));
    const totalDays = Math.floor(totalHours / 24);
    if (totalDays >= 1) return `D-${totalDays}`;
    const h = String(totalHours % 24).padStart(2, "0");
    const m = String(Math.floor((diff / (1000 * 60)) % 60)).padStart(2, "0");
    const s = String(Math.floor((diff / 1000) % 60)).padStart(2, "0");
    return `${h}:${m}:${s}`;
  };

  return (
    <div className="min-h-screen bg-white text-gray-800">
      {/* Header */}
      <header className="sticky top-0 z-20 bg-white border-b border-gray-100">
        <div className="max-w-5xl mx-auto flex justify-between items-center px-6 py-4">
          <h1 className="text-xl font-semibold text-gray-900">
            ⏰ 한정상품 선착순 구매 서두르세요! ⏰
          </h1>
        </div>
      </header>

      {/* Main */}
      <main className="max-w-5xl mx-auto px-6 py-12 grid grid-cols-1 sm:grid-cols-2 gap-10">
        {items.map((item) => {
          const diff =
            new Date(item.openDateTime).getTime() - now;

          const isOpen = diff <= 0;
          const soldOut = item.soldOut;
          const timeLeft = formatTimeLeft(diff);

          return (
            <div
              key={item.productId}
              onClick={() => navigate(`/item/${item.productId}`)}
              className={`relative bg-white border border-gray-100 rounded-2xl p-8 shadow-md transition-all duration-300 ${
                soldOut
                  ? "opacity-50 pointer-events-none"
                  : "hover:shadow-2xl hover:-translate-y-1 cursor-pointer"
              }`}
            >
              {/* SOLD OUT 워터마크 */}
              {soldOut && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-5xl font-extrabold text-gray-300 rotate-[-25deg] select-none">
                    SOLD OUT
                  </span>
                </div>
              )}

              {/* 상단 태그 */}
              <div className="flex justify-between items-center mb-4">
                <span className="text-xs font-semibold bg-[#1B1B1D] text-white px-3 py-1 rounded-full shadow-sm">
                  한정수량
                </span>
                <span className="text-xs font-semibold bg-gray-100 text-gray-800 px-3 py-1 rounded-full border">
                  {formatDateTime(item.openDateTime)} 오픈
                </span>
              </div>

              {/* 이미지 */}
              <div className="flex justify-center mb-6">
                <img
                  src={item.thumbnailUrl}
                  alt={item.name}
                  loading="lazy"
                  className="w-48 h-48 object-contain drop-shadow-md transition-transform duration-300 hover:scale-105"
                />
              </div>

              {/* 제목 */}
              <h2 className="text-center text-base font-semibold mb-2 text-gray-800">
                {item.name}
              </h2>

              {/* 상태 표시 */}
              {soldOut ? (
                <p className="text-center text-xl font-bold mb-4 text-gray-400">
                  SOLD OUT ❌
                </p>
              ) : isOpen ? (
                <p className="text-center text-xl font-bold mb-4 text-pink-500">
                  현재 구매 진행중 🎉
                </p>
              ) : (
                <>
                  <p className="text-center text-sm text-gray-500 mb-1">
                    오픈까지 남은시간
                  </p>
                  <p
                    className={`text-center text-2xl font-extrabold mb-4 tracking-wide ${
                      timeLeft.startsWith("D-")
                        ? "text-gray-900"
                        : "text-red-500"
                    }`}
                  >
                    {timeLeft}
                  </p>
                </>
              )}

              {/* 알림 문구 */}
              {!isOpen && !soldOut && (
                <p className="text-center text-xs text-gray-500 mt-3">
                  999명이 알림을 신청했어요 🔔
                </p>
              )}
            </div>
          );
        })}
      </main>

      <Footer />
    </div>
  );
}
