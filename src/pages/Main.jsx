import api from "@/api/axios";
import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import Footer from "@/components/Footer";

export default function Home({ user }) {
  const navigate = useNavigate();

  const [items, setItems] = useState([]);

  // UI state
  const [activeCategory, setActiveCategory] = useState("한정판매");
  const [query, setQuery] = useState("");

  // promo banner
  const promos = useMemo(
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

  // 무한 루프용 (맨앞/맨뒤 clone)
  const loopedPromos = useMemo(() => {
    if (!promos.length) return [];
    return [promos[promos.length - 1], ...promos, promos[0]];
  }, [promos]);

  const [promoIdx, setPromoIdx] = useState(1);

  const categories = useMemo(() => ["한정판매", "예약", "티케팅", "이벤트"], []);
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
        const res = await api.get("/catalog/products");
        setItems(
          res.data.map((item) => ({
            ...item,
            timeLeft: "",
          }))
        );
      } catch (err) {
        console.error("상품 목록 조회 중 오류:", err);
      }
    };
    fetchItems();
  }, []);

  /* timer */
  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      setItems((prev) =>
        prev.map((item) => {
          const diff = new Date(item.openDateTime) - now;
          if (diff <= 0) return { ...item, timeLeft: "00:00:00" };
          return { ...item, timeLeft: formatTimeLeft(diff) };
        })
      );
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
    return `${month}월 ${day}일 ${period} ${hour}시${minute > 0 ? ` ${minute}분` : ""}`;
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
  const now = new Date();

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return items;
    return items.filter((it) => (it.name || "").toLowerCase().includes(q));
  }, [items, query]);

  /* 오픈예정(7일 이내) */
  const upcoming = useMemo(() => {
    const days = 7;
    const cutoff = new Date(now.getTime() + days * 24 * 60 * 60 * 1000);

    return filtered
      .filter((it) => !it.soldOut)
      .filter((it) => {
        const t = new Date(it.openDateTime);
        return t > now && t <= cutoff;
      })
      .sort((a, b) => new Date(a.openDateTime) - new Date(b.openDateTime));
  }, [filtered]);

  const live = useMemo(() => {
    return filtered
      .filter((it) => !it.soldOut && new Date(it.openDateTime) <= now)
      .sort((a, b) => new Date(b.openDateTime) - new Date(a.openDateTime));
  }, [filtered]);

  const trending = useMemo(() => {
    const mix = [...live, ...upcoming];
    return mix
      .slice()
      .sort((a, b) => {
        const da = Math.abs(new Date(a.openDateTime) - now);
        const db = Math.abs(new Date(b.openDateTime) - now);
        return da - db;
      })
      .slice(0, 20);
  }, [live, upcoming]);

  /* small ui helpers */
  const Container = ({ children }) => (
    <div className="mx-auto w-full max-w-6xl px-4">{children}</div>
  );

  const SectionHeader = ({ title, desc, right }) => (
    <div className="mb-4 flex items-end gap-3">
      <div className="min-w-0">
        <div className="text-lg font-extrabold text-zinc-900">{title}</div>
        {desc ? <div className="mt-1 text-sm text-zinc-600 break-words">{desc}</div> : null}
      </div>
      {right ? <div className="ml-auto shrink-0">{right}</div> : null}
    </div>
  );

  /* 가로 레일 */
  const Rail = ({ children, railRef }) => (
    <div
      ref={railRef}
      className="no-scrollbar flex gap-3 overflow-x-auto scroll-smooth pb-2"
      style={{ scrollSnapType: "x mandatory" }}
    >
      {children}
    </div>
  );

  const RailItem = ({ children }) => (
    <div className="shrink-0" style={{ scrollSnapAlign: "start" }}>
      {children}
    </div>
  );

  const useRailControls = () => {
    const ref = useRef(null);
    const scrollByCards = (dir = 1) => {
      if (!ref.current) return;
      const el = ref.current;
      const amount = Math.round(el.clientWidth * 0.9);
      el.scrollBy({ left: dir * amount, behavior: "smooth" });
    };
    return { ref, scrollByCards };
  };

  const ProductMiniCard = ({ item }) => {
    const diff = new Date(item.openDateTime) - new Date();
    const isOpen = diff <= 0;
    const soldOut = !!item.soldOut;

    return (
      <button
        type="button"
        onClick={() => navigate(`/item/${item.productId}`)}
        className={`w-[170px] sm:w-[190px] text-left ${
          soldOut ? "opacity-60" : "hover:-translate-y-0.5 hover:shadow-md"
        } transition-all`}
      >
        <div className="overflow-hidden rounded-2xl border border-zinc-200 bg-white">
          <div className="bg-zinc-100 p-3">
            <img
              src={item.thumbnailUrl}
              alt={item.name}
              className="h-36 w-full object-contain"
              draggable={false}
            />
          </div>

          <div className="p-3">
            <div className="line-clamp-2 text-sm font-semibold text-zinc-900">{item.name}</div>

            <div className="mt-2 flex items-center justify-between">
              <span className="rounded-full bg-zinc-900 px-2 py-1 text-[10px] font-bold text-white">
                LIMITED
              </span>

              {soldOut ? (
                <span className="text-[11px] font-bold text-zinc-400">SOLD OUT</span>
              ) : isOpen ? (
                <span className="text-[11px] font-extrabold text-pink-600">거래중</span>
              ) : (
                <span className="text-[11px] font-extrabold text-red-600">{item.timeLeft || "00:00:00"}</span>
              )}
            </div>

            <div className="mt-2 text-[11px] text-zinc-500">{formatDateTime(item.openDateTime)}</div>
          </div>
        </div>
      </button>
    );
  };

  // rails
  const trendingRail = useRailControls();
  const upcomingRail = useRailControls();
  const liveRail = useRailControls();

  // ====== KREAM 스타일 무한 드래그 슬라이더 ======
  const [isDragging, setIsDragging] = useState(false);
  const [dragPx, setDragPx] = useState(0);
  const [enableAnim, setEnableAnim] = useState(true);
  const sliderRef = useRef(null);

  const drag = useRef({
    down: false,
    startX: 0,
    pointerId: null,
  });

  const onPointerDown = (e) => {
    drag.current.down = true;
    drag.current.startX = e.clientX;
    drag.current.pointerId = e.pointerId;

    setIsDragging(true);
    setEnableAnim(false); // 드래그 중 transition OFF
    setDragPx(0);

    e.currentTarget.setPointerCapture?.(e.pointerId);
  };

  const onPointerMove = (e) => {
    if (!drag.current.down) return;

    const dx = e.clientX - drag.current.startX;
    setDragPx(dx);
  };

  const endDrag = (commit) => {
    if (!drag.current.down) return;

    drag.current.down = false;
    setIsDragging(false);
    setEnableAnim(true); // transition ON

    const el = sliderRef.current;
    const width = el ? el.clientWidth : 1;
    const threshold = width * 0.2; // 20% 넘기면 넘어감

    if (commit) {
      if (dragPx <= -threshold) setPromoIdx((i) => i + 1);
      else if (dragPx >= threshold) setPromoIdx((i) => i - 1);
    }

    setDragPx(0);
  };

  const onPointerUp = (e) => {
    try {
      e.currentTarget.releasePointerCapture?.(drag.current.pointerId);
    } catch {}
    endDrag(true);
  };

  const onPointerCancel = () => endDrag(false);

  // transition 끝나면 clone 구간에서 "순간 점프" (무한 루프)
  const onTransitionEnd = () => {
    // looped: [lastClone, ...real, firstClone]
    // real range: 1..promos.length
    if (promoIdx === 0) {
      setEnableAnim(false);
      setPromoIdx(promos.length);
      requestAnimationFrame(() => setEnableAnim(true));
    } else if (promoIdx === promos.length + 1) {
      setEnableAnim(false);
      setPromoIdx(1);
      requestAnimationFrame(() => setEnableAnim(true));
    }
  };

  // 화살표도 무한
  const goPrev = () => setPromoIdx((i) => i - 1);
  const goNext = () => setPromoIdx((i) => i + 1);

  // 도트는 "진짜 인덱스"로 매핑
  const realDotIdx = useMemo(() => {
    if (!promos.length) return 0;
    if (promoIdx === 0) return promos.length - 1;
    if (promoIdx === promos.length + 1) return 0;
    return promoIdx - 1;
  }, [promoIdx, promos.length]);

  const goDot = (realIndex) => setPromoIdx(realIndex + 1);

  // auto slide (드래그 중에는 멈춤)
  useEffect(() => {
    if (!promos.length) return;
    if (isDragging) return;

    const t = setInterval(() => {
      setPromoIdx((p) => p + 1);
    }, 4500);

    return () => clearInterval(t);
  }, [promos.length, isDragging]);

  // promos 바뀌면 초기화
  useEffect(() => {
    if (promos.length) setPromoIdx(1);
  }, [promos.length]);

  return (
    <div className="min-h-screen bg-white text-zinc-900">
      <CategoryBar active={activeCategory} onChange={setActiveCategory} />

      {/* ===== KREAM STYLE SLIDE (중앙 정렬) ===== */}
      <section className="pt-6">
  <div className="mx-auto w-full max-w-6xl px-4">
    <div
      ref={sliderRef}
      className="relative overflow-hidden rounded-2xl border border-zinc-200 bg-zinc-100 select-none touch-pan-y cursor-grab active:cursor-grabbing"
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerCancel}
    >
      <div
        onTransitionEnd={onTransitionEnd}
        className={`flex ${enableAnim ? "transition-transform duration-400 ease-out" : "transition-none"}`}
        style={{
          transform: `translateX(calc(-${promoIdx * 100}% + ${dragPx}px))`,
        }}
      >
        {loopedPromos.map((p, i) => (
          <div key={`${p.id}-${i}`} className="relative min-w-full">
            <img
              src={p.imageUrl}
              alt={p.title}
              className="h-[280px] w-full object-cover md:h-[420px] pointer-events-none"
              draggable={false}
              onDragStart={(e) => e.preventDefault()}
            />
            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/60 to-transparent pointer-events-none">
              <div className="px-6 pb-8 pt-16 text-white">
                <div className="text-sm opacity-90">{p.subtitle}</div>
                <div className="mt-2 text-2xl md:text-3xl font-extrabold">{p.title}</div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* ◀ 왼쪽 화살표 (드래그 이벤트 막기) */}
      <button
        type="button"
        data-no-drag="true"
        onPointerDownCapture={(e) => { e.stopPropagation(); e.preventDefault(); }}
        onClick={(e) => { e.stopPropagation(); goPrev(); }}
        className="absolute left-3 top-1/2 -translate-y-1/2 h-10 w-10 rounded-full bg-black/40 text-white hover:bg-black/60"
        aria-label="prev"
      >
        ‹
      </button>

      {/* ▶ 오른쪽 화살표 */}
      <button
        type="button"
        data-no-drag="true"
        onPointerDownCapture={(e) => { e.stopPropagation(); e.preventDefault(); }}
        onClick={(e) => { e.stopPropagation(); goNext(); }}
        className="absolute right-3 top-1/2 -translate-y-1/2 h-10 w-10 rounded-full bg-black/40 text-white hover:bg-black/60"
        aria-label="next"
      >
        ›
      </button>

      {/* 페이지 표시 */}
      <div
        data-no-drag="true"
        className="absolute right-4 top-4 rounded-full bg-black/45 px-3 py-1 text-xs text-white"
      >
        {realDotIdx + 1}/{promos.length}
      </div>

      {/* 도트 */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2" data-no-drag="true">
        {promos.map((p, i) => (
          <button
            key={p.id}
            type="button"
            data-no-drag="true"
            onPointerDownCapture={(e) => { e.stopPropagation(); e.preventDefault(); }}
            onClick={(e) => { e.stopPropagation(); goDot(i); }}
            className={`h-2.5 w-2.5 rounded-full ${i === realDotIdx ? "bg-white" : "bg-white/40"}`}
            aria-label={`promo-${i}`}
          />
        ))}
      </div>
    </div>
  </div>
</section>

      {/* ===== 가로 레일 섹션들 ===== */}
      <main className="mt-10">
        <Container>
          <div className="mb-12">
            <SectionHeader title="Top Trending" />
            <Rail railRef={trendingRail.ref}>
              {trending.map((it) => (
                <RailItem key={it.productId}>
                  <ProductMiniCard item={it} />
                </RailItem>
              ))}
              {trending.length === 0 && (
                <div className="w-full rounded-2xl border border-zinc-200 bg-zinc-50 p-8 text-center text-zinc-600">
                  추천할 상품이 없어요.
                </div>
              )}
            </Rail>
          </div>

          <div className="mb-12">
            <SectionHeader title="오픈 임박" />
            <Rail railRef={upcomingRail.ref}>
              {upcoming.map((it) => (
                <RailItem key={it.productId}>
                  <ProductMiniCard item={it} />
                </RailItem>
              ))}
              {upcoming.length === 0 && (
                <div className="w-full rounded-2xl border border-zinc-200 bg-zinc-50 p-8 text-center text-zinc-600">
                  오픈 예정 상품이 없어요.
                </div>
              )}
            </Rail>
          </div>

          <div className="mb-12">
            <SectionHeader title="현재 판매중" />
            <Rail railRef={liveRail.ref}>
              {live.map((it) => (
                <RailItem key={it.productId}>
                  <ProductMiniCard item={it} />
                </RailItem>
              ))}
              {live.length === 0 && (
                <div className="w-full rounded-2xl border border-zinc-200 bg-zinc-50 p-8 text-center text-zinc-600">
                  현재 판매중인 상품이 없어요.
                </div>
              )}
            </Rail>
          </div>
        </Container>
      </main>

      <Footer />
    </div>
  );
}