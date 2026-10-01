"use client";

import { useEffect, useState } from 'react';
import { Autoplay, Pagination } from 'swiper/modules';
import Link from 'next/link';
import { Ad } from '@/payload-types';

import 'swiper/css';
import 'swiper/css/autoplay';
import 'swiper/css/pagination';

import { Swiper, SwiperSlide } from 'swiper/react';

interface AdSlide {
    id: string;
    title: string;
    subtitle?: string;
    badge?: string;
    imageUrl?: string;
    image?: { url?: string };
    link?: string;
    buttonText?: string;
}

const Slider = () => {
    const [slides, setSlides] = useState<AdSlide[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAds = async () => {
            try {
                const res = await fetch('/api/ads');
                const data = await res.json();
                if (data.docs && data.docs.length > 0) {
                    setSlides(data.docs.map((doc: Ad) => {
                        const imgUrl = doc.imageUrl || (typeof doc.image === 'object' && doc.image?.url ? doc.image.url : 'https://picsum.photos/id/1025/1200/500');
                        return {
                            id: doc.id,
                            title: doc.title,
                            subtitle: doc.subtitle ?? undefined,
                            badge: doc.badge ?? undefined,
                            imageUrl: imgUrl,
                            link: doc.link || '/products',
                            buttonText: doc.buttonText || 'Shop Now',
                        };
                    }));
                }
            } catch (err) {
                console.error('Failed to fetch ads for home slider:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchAds();
    }, []);

    if (loading) {
        return (
            <div className="max-w-7xl mx-auto w-full h-80 sm:h-96 md:h-[50vh] bg-creamy-bg/70 rounded-3xl flex items-center justify-center animate-pulse">
                <div className="w-8 h-8 border-4 border-primary-800 border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    if (slides.length === 0) {
        return null;
    }

    return (
        <div className="max-w-7xl mx-auto rounded-3xl overflow-hidden shadow-lg border border-primary-800/10">
            <Swiper
                modules={[Pagination, Autoplay]}
                loop={slides.length > 1}
                pagination={{
                    clickable: true,
                }}
                autoplay={{
                    delay: 4500,
                    disableOnInteraction: false,
                }}
                className="w-full"
            >
                {slides.map((slide, idx) => (
                    <SwiperSlide key={slide.id || idx}>
                        <div className="relative w-full h-80 sm:h-96 md:h-[50vh] flex items-center bg-primary-800 text-creamy-bg overflow-hidden">
                            {/* Background Image with Gradient Overlay */}
                            {slide.imageUrl && (
                                <img
                                    src={slide.imageUrl}
                                    alt={slide.title}
                                    className="absolute inset-0 w-full h-full object-cover opacity-40 mix-blend-overlay"
                                />
                            )}
                            <div className="absolute inset-0 bg-linear-to-r from-primary-800 via-primary-800/80 to-transparent"></div>

                            {/* Content */}
                            <div className="relative z-10 p-6 sm:p-12 md:p-16 max-w-2xl flex flex-col items-start gap-3 sm:gap-4">
                                {slide.badge && (
                                    <span className="bg-creamy-bg text-primary-800 font-bold text-xs uppercase tracking-widest px-3 py-1 rounded-full shadow-sm">
                                        {slide.badge}
                                    </span>
                                )}
                                <h2 className="text-2xl sm:text-4xl md:text-5xl font-black text-creamy-bg tracking-tight leading-tight">
                                    {slide.title}
                                </h2>
                                {slide.subtitle && (
                                    <p className="text-sm sm:text-base md:text-lg text-creamy-bg/90 line-clamp-2 max-w-xl">
                                        {slide.subtitle}
                                    </p>
                                )}
                                <Link
                                    href={slide.link || '/products'}
                                    className="mt-2 inline-flex items-center gap-2 bg-creamy-bg text-primary-800 font-bold px-6 py-3 rounded-xl hover:bg-white hover:scale-105 transition-all duration-300 shadow-md text-sm sm:text-base"
                                >
                                    {slide.buttonText || 'Shop Now'}
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                                    </svg>
                                </Link>
                            </div>
                        </div>
                    </SwiperSlide>
                ))}
            </Swiper>
        </div>
    );
};

export default Slider;