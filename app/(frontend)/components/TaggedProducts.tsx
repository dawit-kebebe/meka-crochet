"use client";

import { Swiper, SwiperSlide } from 'swiper/react';

import 'swiper/css';
import 'swiper/css/free-mode';
import 'swiper/css/pagination';

import { FreeMode, Pagination } from 'swiper/modules';
import Link from 'next/link';
import { ArrowRightIcon } from 'flowbite-react';
import { useState } from 'react';
import ProductCard from './ProductCard';

const TaggedProducts = () => {
    const [activeTab, setActiveTab] = useState('new-products');

    const tags = [
        {key: 'new-products', title: 'New Product'},
        {key: 'baby-clothing', title: 'Baby Clothing'},
        {key: 'women', title: 'Women'},
        {key: 'men', title: 'Men'},
        {key: 'summer-collection', title: 'Summer Collection'},
    ];

  return (
    <div className="max-w-7xl mx-auto p-4">
            <div className='w-full overflow-auto scrollbar-none! flex gap-2 items-center mb-6'>
                {tags.map((tag) => (
                    <button onClick={() => setActiveTab(tag.key)} key={tag.key} className={`${activeTab === tag.key ? 'text-creamy-bg bg-primary-800 border-primary-800 border-2 px-2 py-1 rounded-xl mb-2' : 'text-primary-800 bg-creamy-bg border-primary-800 border-2 px-2 py-1 rounded-xl mb-2' } focus:ring-0 focus:outline-none focus:border-none text-nowrap whitespace-nowrap`}>{tag.title}</button>
                ))}
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
                </Swiper>
            </div>
        </div>
  )
}

export default TaggedProducts