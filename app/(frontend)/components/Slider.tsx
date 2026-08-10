"use client";

import { Autoplay, Navigation, Pagination } from 'swiper/modules';

import 'swiper/css';
import 'swiper/css/autoplay';
import 'swiper/css/pagination';

import { Swiper, SwiperSlide } from 'swiper/react';

const Slider = () => {
    return (
        <div className="max-w-7xl mx-auto p-4">
            <Swiper
                modules={[Pagination,  Autoplay]}
                loop={true}
                pagination={{
                    clickable: true,
                }}
                autoplay={{
                    delay: 3000,
                    disableOnInteraction: false,
                }}
            >
                <SwiperSlide><div className='bg-primary-800 w-full h-[calc(60vh)]'>hello 1</div></SwiperSlide>
                <SwiperSlide><div className='bg-primary-800 w-full h-[calc(60vh)]'>hello 2</div></SwiperSlide>
                <SwiperSlide><div className='bg-primary-800 w-full h-[calc(60vh)]'>hello 3</div></SwiperSlide>
                <SwiperSlide><div className='bg-primary-800 w-full h-[calc(60vh)]'>hello 4</div></SwiperSlide>
            </Swiper>
        </div>
    )
}

export default Slider