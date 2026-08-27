"use client";

import { Swiper, SwiperSlide } from 'swiper/react';

import 'swiper/css';
import 'swiper/css/free-mode';
import 'swiper/css/pagination';

import { ArrowRightIcon } from 'flowbite-react';
import Link from 'next/link';
import { FreeMode } from 'swiper/modules';
import ProductCard from './ProductCard';
import SectionTitle from '@app/components/SectionTitle';

const NewProducts = () => {

    return (
        <div className="max-w-7xl mx-auto p-4">
            <div className='flex justify-between items-center mb-6'>
                <SectionTitle>New Products</SectionTitle>
                <Link href="/newProducts" className='text-primary-800 hover:underline transition-all duration-300 flex items-center gap-2'>See All <ArrowRightIcon /> </Link>
            </div>
            <div className='flex w-full gap-1'>
                <Swiper
                    slidesPerView={'auto'}
                    spaceBetween={30}
                    freeMode={true}
                    modules={[FreeMode]}
                >
                    <SwiperSlide className='max-w-sm max-h-96 sm:max-h-120'>
                        <ProductCard />
                    </SwiperSlide>
                    <SwiperSlide className='max-w-sm max-h-96 sm:max-h-120'>
                        <ProductCard />
                    </SwiperSlide>
                    <SwiperSlide className='max-w-sm max-h-96 sm:max-h-120'>
                        <ProductCard />
                    </SwiperSlide>
                    <SwiperSlide className='max-w-sm max-h-96 sm:max-h-120'>
                        <ProductCard />
                    </SwiperSlide>
                    <SwiperSlide className='max-w-sm max-h-96 sm:max-h-120'>
                        <ProductCard />
                    </SwiperSlide>
                    <SwiperSlide className='max-w-sm max-h-96 sm:max-h-120'>
                        <ProductCard />
                    </SwiperSlide>
                    <SwiperSlide className='max-w-sm max-h-96 sm:max-h-120'>
                        <ProductCard />
                    </SwiperSlide>
                </Swiper>
            </div>
        </div>
    )
}

export default NewProducts