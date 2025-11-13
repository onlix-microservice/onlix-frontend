import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import Footer from "@/components/Footer";

export default function ItemDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [item, setItem] = useState(null);

  useEffect(() => {
    const mockItems = [
      {
        id: 1,
        name: "THE MONSTERS 하이라이트 시리즈 인형 키링 (랜덤)",
        brand: "POP MART",
        price: 21000,
        stock: 30,
        openTime: "2025-10-14T10:00:00",
        releaseDate: "2025-09-20",
        image: "/images/the_monsters_highlight.webp",
        desc: `
“THE MONSTERS 하이라이트 시리즈”는 POP MART의 대표 캐릭터 Labubu를 비롯한
The Monsters 크루의 매력을 담은 리미티드 에디션 인형 키링입니다.
각 제품은 랜덤 구성으로 제공되며, 미개봉 상태에서만 교환이 가능합니다.
        `,
      },
      {
        id: 2,
        name: "NIKE × Tiffany & Co. AIR FORCE 1 1837 LIMITED EDITION",
        brand: "NIKE",
        price: 850000,
        stock: 0,
        openTime: "2025-12-15T13:00:00",
        releaseDate: "2025-11-15",
        image: "/images/nike_tiffany.avif",
        desc: `
NIKE와 Tiffany의 첫 번째 협업 모델.
클래식한 Air Force 1 실루엣에 Tiffany 블루 포인트와 은장 디테일을 더한
럭셔리 한정판 컬렉션입니다.
        `,
      },
    ];

    const found = mockItems.find((i) => i.id === Number(id));
    setItem(found);
  }, [id]);

  if (!item) {
    return (
      <div className="flex h-screen items-center justify-center text-gray-500">
        상품을 찾을 수 없습니다 😢
      </div>
    );
  }

  const soldOut = item.stock === 0;
  const now = new Date();
  const openDate = new Date(item.openTime);
  const isOpenBefore = now < openDate;

  return (
    <div className="min-h-screen bg-[#fdfcfb] text-gray-800 flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-20 bg-white/80 backdrop-blur-md border-b border-gray-100 shadow-sm">
        <div className="max-w-5xl mx-auto flex justify-between items-center px-6 py-4">
          <button
            onClick={() => navigate(-1)}
            className="text-gray-600 hover:text-gray-900 transition"
          >
          <img
                src="/images/icon-back.svg" 
                alt="뒤로가기"
                className="w-8 h-8 object-contain"
          />
          </button>
          <h1 className="text-lg font-bold tracking-tight text-gray-900">
            상품 상세보기
          </h1>
          <div className="w-10" />
        </div>
      </header>

      {/* Main Section */}
      <main className="max-w-5xl mx-auto w-full grid grid-cols-1 md:grid-cols-2 gap-10 px-6 py-10">
        {/* Left: Product Image */}
        <div className="relative flex justify-center items-start">
          <img
            src={item.image}
            alt={item.name}
            className={`w-full max-w-md rounded-2xl shadow-lg object-contain transition ${
              soldOut && !isOpenBefore ? "opacity-50 grayscale" : ""
            }`}
          />
          {!isOpenBefore && soldOut && (
            <div className="absolute inset-0 flex items-center justify-center text-4xl font-extrabold text-gray-400 rotate-[-25deg] select-none">
              SOLD OUT
            </div>
          )}
        </div>

        {/* Right: Info */}
        <div className="flex flex-col justify-center">
          <h2 className="text-2xl font-bold mb-2">{item.name}</h2>
          <p className="text-sm text-gray-500 mb-1">Brand · {item.brand}</p>
          <p className="text-sm text-gray-400 mb-4">
            출시일 · {item.releaseDate}
          </p>

          <p className="text-3xl font-extrabold text-gray-900 mb-4">
            ₩ {item.price.toLocaleString()}원
          </p>

          <p
            className={`mb-6 font-medium ${
                soldOut
                ? "text-red-500"
                : item.stock <= 3
                ? "text-red-500 font-semibold"
                : "text-black font-semibold"
            }`}
          >
            {isOpenBefore 
              ? null
              : soldOut 
              ? "품절된 상품입니다." : `남은 수량: ${item.stock}개`}
          </p>

          <button
            disabled={soldOut || isOpenBefore}
            onClick={() => {
              if (!soldOut && !isOpenBefore) {
                alert("구매하기 페이지로 이동");
              }
            }}
            className={`w-full py-3 rounded-xl font-semibold transition-all shadow-md ${
              soldOut || isOpenBefore
                ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                : "bg-gradient-to-r from-pink-400 to-orange-400 text-white hover:opacity-90"
            }`}
          >
            {isOpenBefore ? '오픈 전' : soldOut ? "SOLD OUT" : "🎁 구매하기"}
          </button>
        </div>
      </main>

      {/* Description */}
      <section className="max-w-4xl mx-auto px-6 py-12 border-t border-gray-100">
        <h3 className="text-xl font-bold mb-4 text-gray-800">상품 설명</h3>
        <pre className="whitespace-pre-wrap text-gray-700 leading-relaxed text-sm">
          {item.desc}
        </pre>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
}