"use client";

import { Autoplay, Pagination } from 'swiper/modules';

import 'swiper/css';
import 'swiper/css/autoplay';
import 'swiper/css/pagination';

import { Swiper, SwiperSlide } from 'swiper/react';

const Slider = () => {
    return (
        <div className="max-w-7xl mx-auto">
            <Swiper
                modules={[Pagination]}
                loop={true}
                pagination={{
                    clickable: true,
                }}
            >
                <SwiperSlide><div className='bg-primary-800 w-full h-90'>hello 1</div></SwiperSlide>
                <SwiperSlide><div className='bg-primary-800 w-full h-90'>hello 2</div></SwiperSlide>
                <SwiperSlide><div className='bg-primary-800 w-full h-90'>hello 3</div></SwiperSlide>
                <SwiperSlide><div className='bg-primary-800 w-full h-90'>hello 4</div></SwiperSlide>
            </Swiper>
        </div>
    )
}

export default Slider