/**
 * Hero Banner Carousel using Swiper for Home page promotions & sales.
 */

import React from 'react';
import { Link } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination, Navigation } from 'swiper/modules';
import { ArrowRight, Sparkles, MessageSquareQuote, ShieldCheck } from 'lucide-react';
import Button from '../common/Button';

export const HeroCarousel = () => {
  const slides = [
    {
      id: 1,
      title: 'Kharif Season Mega Farm Sale!',
      tag: 'UP TO 35% OFF SEEDS & FERTILIZERS',
      description: 'Certified hybrid cotton, paddy, and soyabean seeds with guaranteed high germination rates from verified dealers.',
      buttonText: 'Shop Seed Deals',
      link: '/products?category=seeds',
      bgGradient: 'from-green-950 via-green-900 to-emerald-800',
      image: 'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?w=1000&auto=format&fit=crop&q=80',
    },
    {
      id: 2,
      title: 'Direct Farmer Price Bargaining',
      tag: 'INDIA’S 1ST NEGOTIABLE AGRI MARKETPLACE',
      description: 'Negotiate bulk prices directly with agricultural suppliers and get custom discounted rates for your farm.',
      buttonText: 'Start Bargaining',
      link: '/bargains',
      bgGradient: 'from-amber-950 via-yellow-900 to-amber-800',
      image: 'https://images.unsplash.com/photo-1592417817098-8f3d6910985b?w=1000&auto=format&fit=crop&q=80',
    },
    {
      id: 3,
      title: 'Modern Drip Irrigation & Spray Pumps',
      tag: 'SAVE UP TO 60% WATER & LABOUR',
      description: 'ISI-marked lateral pipes, pressure drippers, and battery knapsack sprayers delivered to your doorstep.',
      buttonText: 'Explore Equipment',
      link: '/products?category=tools',
      bgGradient: 'from-blue-950 via-slate-900 to-teal-900',
      image: 'https://images.unsplash.com/photo-1563514227147-6d2ff665a6a0?w=1000&auto=format&fit=crop&q=80',
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
            <div className={`relative w-full h-full bg-gradient-to-r ${slide.bgGradient} text-white flex items-center overflow-hidden`}>
              {/* Background overlay image */}
              <img
                src={slide.image}
                alt={slide.title}
                className="absolute right-0 top-0 bottom-0 w-1/2 sm:w-2/5 h-full object-cover opacity-25 sm:opacity-40 mix-blend-overlay"
              />

              {/* Content Box */}
              <div className="relative z-10 max-w-xl px-6 sm:px-12 py-6">
                <span className="inline-flex items-center gap-1 bg-agri-accent text-gray-900 text-[10px] sm:text-xs font-black px-2.5 py-1 rounded-full uppercase tracking-wider mb-3 shadow-xs">
                  <Sparkles className="w-3.5 h-3.5" />
                  {slide.tag}
                </span>

                <h2 className="text-xl sm:text-3xl md:text-4xl font-extrabold text-white leading-tight tracking-tight mb-2 sm:mb-3">
                  {slide.title}
                </h2>

                <p className="text-xs sm:text-sm text-green-100/90 leading-relaxed mb-4 sm:mb-6 line-clamp-2 sm:line-clamp-3">
                  {slide.description}
                </p>

                <div className="flex items-center gap-3">
                  <Link to={slide.link}>
                    <Button variant="accent" size="md" rightIcon={<ArrowRight className="w-4 h-4" />}>
                      {slide.buttonText}
                    </Button>
                  </Link>
                  <Link to="/products">
                    <Button variant="ghost" size="md" className="text-white hover:bg-white/10">
                      View All Catalog
                    </Button>
                  </Link>
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
