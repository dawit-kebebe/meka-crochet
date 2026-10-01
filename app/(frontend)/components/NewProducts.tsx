"use client";

import { useEffect, useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';

import 'swiper/css';
import 'swiper/css/free-mode';
import 'swiper/css/pagination';

import { ArrowRightIcon } from 'flowbite-react';
import Link from 'next/link';
import { FreeMode } from 'swiper/modules';
import ProductCard, { ProductCardSkeleton } from './ProductCard';
import EmptyState from './EmptyState';
import SectionTitle from '@app/components/SectionTitle';
import { ProductItem } from '../context/CartContext';
import { Product } from '@/payload-types';
import { formatProduct } from '@app/utils/product';

const NewProducts = () => {
    const [products, setProducts] = useState<ProductItem[]>([]);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        const fetchNewProducts = async () => {
            setLoading(true);
            try {
                const res = await fetch('/api/products?category=new-products&limit=10');
                const data = await res.json();
                if (data.docs) {
                    setProducts(data.docs.map((doc: Product) => formatProduct(doc)));
                }
            } catch (err) {
                console.error('Failed to fetch new products:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchNewProducts();
    }, []);

    return (
        <div className="max-w-7xl mx-auto p-4">
            <div className='flex justify-between items-center mb-6'>
                <SectionTitle>New Products</SectionTitle>
                <Link href="/products" className='text-primary-800 hover:underline transition-all duration-300 flex items-center gap-2 font-semibold'>See All <ArrowRightIcon /> </Link>
            </div>
            {loading ? (
                <div className='flex w-full gap-1'>
                    <Swiper
                        slidesPerView={'auto'}
                        spaceBetween={30}
                        freeMode={true}
                        modules={[FreeMode]}
                    >
                        {Array.from({ length: 4 }).map((_, idx) => (
                            <SwiperSlide key={idx} className='w-72 sm:w-80 max-w-sm max-h-96 sm:max-h-120'>
                                <ProductCardSkeleton />
                            </SwiperSlide>
                        ))}
                    </Swiper>
                </div>
            ) : products.length === 0 ? (
                <EmptyState description="There are currently no new products available. Please check back soon!" />
            ) : (
                <div className='flex w-full gap-1'>
                    <Swiper
                        slidesPerView={'auto'}
                        spaceBetween={30}
                        freeMode={true}
                        modules={[FreeMode]}
                    >
                        {products.map((prod, idx) => (
                            <SwiperSlide key={prod.id || idx} className='max-w-sm max-h-96 sm:max-h-120'>
                                <ProductCard product={prod} />
                            </SwiperSlide>
                        ))}
                    </Swiper>
                </div>
            )}
        </div>
    )
}

export default NewProducts