/**
 * Hero Banner Carousel using Swiper for Home page promotions & sales.
 */

import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination, Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import { ArrowRight, Sparkles } from 'lucide-react';
import Button from '../common/Button';

export const HeroCarousel = () => {
  const { t } = useTranslation();

  const slides = [
    {
      id: 1,
      title: t('home.hero_slide_1_title'),
      tag: t('home.hero_slide_1_badge'),
      description: t('home.hero_slide_1_desc'),
      buttonText: t('home.hero_slide_1_btn'),
      link: '/products?category=seeds',
      bgColor: 'bg-green-950',
      image: 'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?w=1200&auto=format&fit=crop&q=80',
    },
    {
      id: 2,
      title: t('home.hero_slide_2_title'),
      tag: t('home.hero_slide_2_badge'),
      description: t('home.hero_slide_2_desc'),
      buttonText: t('home.hero_slide_2_btn'),
      link: '/products?category=fertilizers',
      bgColor: 'bg-[#18120c]',
      image: 'https://images.unsplash.com/photo-1592417817098-8f3d6ef23a81?w=1200&auto=format&fit=crop&q=80',
    },
    {
      id: 3,
      title: t('home.hero_slide_3_title'),
      tag: t('home.hero_slide_3_badge'),
      description: t('home.hero_slide_3_desc'),
      buttonText: t('home.hero_slide_3_btn'),
      link: '/bargains',
      bgColor: 'bg-[#0a121e]',
      image: 'https://images.unsplash.com/photo-1563514227147-6d2ff665a6a0?w=1200&auto=format&fit=crop&q=80',
    },
  ];

  return (
    <div className="relative rounded-xl overflow-hidden shadow-md my-4">
      <Swiper
        modules={[Autoplay, Pagination, Navigation]}
        spaceBetween={0}
        slidesPerView={1}
        loop={true}
        autoplay={{ delay: 5000, disableOnInteraction: false }}
        pagination={{ clickable: true }}
        navigation={true}
        className="h-[280px] sm:h-[340px] md:h-[380px]"
      >
        {slides.map((slide) => (
          <SwiperSlide key={slide.id}>
            <div className={`relative w-full h-full ${slide.bgColor} text-white flex items-center overflow-hidden`}>
              {/* Natural Full-Color Image Container - Completely Untinted (No Color Overlays) */}
              <div 
                className="absolute right-0 top-0 bottom-0 w-full sm:w-1/2 md:w-3/5 h-full pointer-events-none overflow-hidden"
                style={{
                  maskImage: 'linear-gradient(to right, transparent 0%, black 18%, black 100%)',
                  WebkitMaskImage: 'linear-gradient(to right, transparent 0%, black 18%, black 100%)',
                }}
              >
                <img
                  src={slide.image}
                  alt={slide.title}
                  className="w-full h-full object-cover object-center"
                />
              </div>

              {/* Content Box */}
              <div className="relative z-20 max-w-xl px-6 sm:px-12 py-6 pointer-events-auto">
                <span className="inline-flex items-center gap-1 bg-agri-accent text-gray-900 text-[10px] sm:text-xs font-black px-2.5 py-1 rounded-full uppercase tracking-wider mb-3 shadow-xs">
                  <Sparkles className="w-3.5 h-3.5" />
                  {slide.tag}
                </span>

                <h2 className="text-xl sm:text-3xl md:text-4xl font-extrabold text-white leading-tight tracking-tight mb-2 sm:mb-3">
                  {slide.title}
                </h2>

                <p className="text-xs sm:text-sm text-gray-200 leading-relaxed mb-4 sm:mb-6 line-clamp-2 sm:line-clamp-3">
                  {slide.description}
                </p>

                <div className="flex items-center gap-3">
                  <Button to={slide.link} variant="accent" size="md" rightIcon={<ArrowRight className="w-4 h-4" />}>
                    {slide.buttonText}
                  </Button>
                  <Button to="/products" variant="ghost" size="md" className="text-white hover:bg-white/10">
                    {t('common.view_all')}
                  </Button>
                </div>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default HeroCarousel;
