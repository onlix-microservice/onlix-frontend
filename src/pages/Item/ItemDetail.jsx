import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import Footer from "@/components/Footer";
import { catalogApi } from "@/api/catalogApi";

export default function ItemDetail() {
  const { id } = useParams();
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (!id) return;

    const fetchProductDetail = async () => {
          try {
            setLoading(true);
            setNotFound(false);

            const product = await catalogApi.getProduct(id);
            // api.get(`/catalog/products/${id}`);
            setItem(product);
          
          } catch (err) {
            if (err.response?.status === 404) {
              setNotFound(true);
            }

            console.error("상품 상세 조회 중 오류:", err);
            setItem(null);
          } finally {
            setLoading(false);
          }
        };
    
        fetchProductDetail();
  }, [id]);

  if (notFound) {
    return (
      <div className="flex h-screen items-center justify-center text-gray-500">
        상품을 찾을 수 없습니다 😢
      </div>
    );
  }

  if (!item) {
    return (
      <div className="flex h-screen items-center justify-center text-gray-500">
        일시적인 오류가 발생했습니다 😢
      </div>
    );
  }

  const soldOut = item.soldOut;
  const now = new Date();
  const openDate = new Date(item.openDateTime);
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
            src={item.thumbnailUrl}
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
          <p className="text-sm text-gray-500 mb-1">Brand · {item.brandName}</p>
          <p className="text-sm text-gray-400 mb-4">
            출시일 · {item.releaseDate}
          </p>

          <p className="text-3xl font-extrabold text-gray-900 mb-4">
            {item.price.toLocaleString()}원
          </p>

          <p
            className={`mb-6 font-medium ${
                soldOut
                ? "text-red-500"
                : item.soldCount <= 3
                ? "text-red-500 font-semibold"
                : "text-black font-semibold"
            }`}
          >
            {soldOut
              ? "품절된 상품입니다."
              : `판매 수량: ${item.soldCount}개`}
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
          {item.description}
        </pre>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
}