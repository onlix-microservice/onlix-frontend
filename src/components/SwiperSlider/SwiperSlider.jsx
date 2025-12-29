import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "@/components/SwiperSlider/SwiperSlider.css";

export default function SwiperSlider({ slides }) {
  if (!slides?.length) return null;

  return (
    <div className="mx-auto w-full max-w-6xl px-4 pt-6">
      <Swiper
        modules={[Navigation, Pagination, Autoplay]}
        loop={true}
        slidesPerView={1}
        speed={450}
        grabCursor={true}
        resistanceRatio={0}
        autoplay={{
          delay: 4500,
          disableOnInteraction: false,
        }}
        navigation
        pagination={{ 
          clickable: true,
          type: "fraction" 
        }}
        className="rounded-2xl overflow-hidden border border-zinc-200 bg-zinc-100"
      >
        {slides.map((s) => (
          <SwiperSlide key={s.id}>
            <div className="relative">
              <img
                src={s.imageUrl}
                alt={s.title}
                className="h-[280px] w-full object-cover md:h-[420px]"
                draggable={false}
              />

              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/60 to-transparent">
                <div className="px-6 pb-8 pt-16 text-white">
                  <div className="text-sm opacity-90">{s.subtitle}</div>
                  <div className="mt-2 text-2xl md:text-3xl font-extrabold">
                    {s.title}
                  </div>
                </div>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}