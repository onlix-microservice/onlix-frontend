import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import SwiperSlider from "@/components/SwiperSlider";
import Footer from "@/components/Footer";
import { catalogApi } from "@/api/catalogApi";

export default function Home() {
  const navigate = useNavigate();

  const [items, setItems] = useState([]);
  const [now, setNow] = useState(Date.now());
  // UI state
  const [activeCategory, setActiveCategory] = useState("한정판매");
  const [query, setQuery] = useState("");

  // promo banner
  const slides = useMemo(
      () => [
        {
          id: "p1",
          title: "이번 주 드롭 라인업",
          subtitle: "오픈 예정 상품 모아보기",
          imageUrl:
              "https://images.unsplash.com/photo-1520975958225-3f61d04f7d43?auto=format&fit=crop&w=1600&q=80",
        },
        {
          id: "p2",
          title: "Top Trending",
          subtitle: "지금 가장 뜨는 아이템",
          imageUrl:
              "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=1600&q=80",
        },
        {
          id: "p3",
          title: "ONLIX 큐레이션",
          subtitle: "한정 상품만 모아보기",
          imageUrl:
              "https://images.unsplash.com/photo-1528701800489-20be3c41a7a0?auto=format&fit=crop&w=1600&q=80",
        },
      ],
      []
  );

  const categories = useMemo(
      () => ["한정판매", "예약", "티케팅", "이벤트"],
      []
  );

  const CategoryBar = ({ active, onChange }) => (
      <div className="border-b border-zinc-200 bg-white">
        <div className="mx-auto max-w-6xl px-4">
          <div className="flex gap-2 py-3">
            {categories.map((c) => (
                <button
                    key={c}
                    onClick={() => onChange(c)}
                    className={`rounded-full px-4 py-2 text-sm font-semibold ${
                        active === c
                            ? "bg-zinc-900 text-white"
                            : "bg-zinc-100 text-zinc-700 hover:bg-zinc-200"
                    }`}
                >
                  {c}
                </button>
            ))}
          </div>
        </div>
      </div>
  );

  /* fetch items */
  useEffect(() => {
    const fetchItems = async () => {
      try {
        const items = await catalogApi.getProducts();
        setItems(items);
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

  /* format */
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

  /* derived lists */
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return items;
    return items.filter((it) =>
        (it.name || "").toLowerCase().includes(q)
    );
  }, [items, query]);

  const upcoming = useMemo(() => {
    const cutoff = now + 7 * 24 * 60 * 60 * 1000;

    return filtered
      .filter((it) => !it.soldOut)
      .filter((it) => {
        const t = new Date(it.openDateTime).getTime();
        return t > now && t <= cutoff;
      })
      .sort((a, b) => new Date(a.openDateTime).getTime() - new Date(b.openDateTime).getTime());
  }, [filtered, now]);

  const live = useMemo(() => {
    return filtered
      .filter((it) => !it.soldOut && new Date(it.openDateTime).getTime() <= now)
      .sort((a, b) => new Date(b.openDateTime).getTime() - new Date(a.openDateTime).getTime());
  }, [filtered, now]);

  const Container = ({ children }) => (
      <div className="mx-auto w-full max-w-6xl px-4">
        {children}
      </div>
  );

  const SectionHeader = ({ title }) => (
      <div className="mb-4 text-lg font-extrabold text-zinc-900">
        {title}
      </div>
  );

  const ProductMiniCard = ({ item }) => {
    const diff = new Date(item.openDateTime).getTime() - now;

    const isOpen = diff <= 0;
    const soldOut = !!item.soldOut;

    const timeLeft = formatTimeLeft(diff);

    return (
        <button
            type="button"
            onClick={() => navigate(`/item/${item.productId}`)}
            className={`w-[170px] sm:w-[190px] text-left transition-all ${
                soldOut
                    ? "opacity-60"
                    : "hover:-translate-y-0.5 hover:shadow-md"
            }`}
        >
          <div className="overflow-hidden rounded-2xl border border-zinc-200 bg-white">
            <div className="bg-zinc-100 p-4">
              <img
                  src={item.thumbnailUrl}
                  alt={item.name}
                  className="h-36 w-full object-contain"
              />
            </div>

            <div className="p-3">
              <div className="line-clamp-2 text-sm md:text-base font-semibold">
                {item.name}
              </div>

              <div className="mt-2 flex justify-between text-xs md:text-sm">
              <span className="rounded-full bg-zinc-900 px-2 py-1 text-white">
                한정수량
              </span>
                {soldOut ? (
                    <span className="text-zinc-400">SOLD OUT</span>
                ) : isOpen ? (
                    <span className="text-pink-600 font-semibold">거래중</span>
                ) : (
                    <span className="text-red-600 font-semibold">{timeLeft}</span>
                )}
              </div>

              <div className="mt-2 text-xs md:text-sm text-zinc-500">
                {formatDateTime(item.openDateTime)}
              </div>
            </div>
          </div>
        </button>
    );
  };

  return (
      <div className="min-h-screen bg-white text-zinc-900">
        <CategoryBar
            active={activeCategory}
            onChange={setActiveCategory}
        />

        {/* 슬라이드 배너 */}
        <SwiperSlider slides={slides} />

        {/* 상품 섹션 */}
        <main className="mt-10">
          <Container>
            <div className="mb-12">
              <SectionHeader title="현재 판매중" />
              <div className="flex gap-3 overflow-x-auto">
                {live.map((it) => (
                    <ProductMiniCard key={it.productId} item={it} />
                ))}
              </div>
            </div>

            <div className="mb-12">
              <SectionHeader title="오픈 예정" />
              <div className="flex gap-3 overflow-x-auto">
                {upcoming.map((it) => (
                    <ProductMiniCard key={it.productId} item={it} />
                ))}
              </div>
            </div>
          </Container>
        </main>

        <Footer />
      </div>
  );
}