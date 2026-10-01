"use client";

import { Pagination, Autoplay } from 'swiper/modules';

import 'swiper/css';
import 'swiper/css/autoplay';
import 'swiper/css/pagination';

import { Swiper, SwiperSlide } from 'swiper/react';

interface ProductSliderProps {
    images?: string[];
    title?: string;
}

const ProductSlider: React.FC<ProductSliderProps> = ({
    images = ['https://picsum.photos/600/800'],
    title = 'Product Image'
}) => {
    const slides = images.length > 0 ? images : ['https://picsum.photos/600/800'];

    return (
        <div className="max-w-7xl mx-auto rounded-2xl overflow-hidden shadow-md bg-creamy-bg">
            <Swiper
                modules={[Pagination, Autoplay]}
                loop={slides.length > 1}
                pagination={{
                    clickable: true,
                }}
                autoplay={slides.length > 1 ? {
                    delay: 4000,
                    disableOnInteraction: false,
                } : false}
                className="w-full h-80 sm:h-96 md:h-112"
            >
                {slides.map((imgUrl, idx) => (
                    <SwiperSlide key={idx} className="w-full h-full flex items-center justify-center bg-gray-50">
                        <div className="relative w-full h-full flex items-center justify-center p-2">
                            <img
                                src={imgUrl}
                                alt={`${title} - image ${idx + 1}`}
                                className="w-full h-full object-cover sm:object-contain rounded-xl"
                            />
                        </div>
                    </SwiperSlide>
                ))}
            </Swiper>
        </div>
    )
}

export default ProductSlider;