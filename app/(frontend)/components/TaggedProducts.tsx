"use client";

import { useEffect, useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';

import 'swiper/css';
import 'swiper/css/free-mode';
import 'swiper/css/pagination';

import { FreeMode } from 'swiper/modules';
import ProductCard, { ProductCardSkeleton } from './ProductCard';
import EmptyState from './EmptyState';
import { ProductItem } from '../context/CartContext';
import { Category, Product } from '@/payload-types';
import { formatProduct } from '@app/utils/product';

interface CategoryItem {
    id: string;
    name: string;
    slug: string;
}

const TaggedProducts = () => {
    const [categories, setCategories] = useState<CategoryItem[]>([]);
    const [activeTab, setActiveTab] = useState<string>('');
    const [products, setProducts] = useState<ProductItem[]>([]);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const res = await fetch('/api/categories');
                const data = await res.json();
                if (data.docs && data.docs.length > 0) {
                    const fetchedCats: CategoryItem[] = data.docs.map((doc: Category) => ({
                        id: doc.id,
                        name: doc.name,
                        slug: doc.slug,
                    }));
                    setCategories(fetchedCats);
                    setActiveTab(fetchedCats[0].slug);
                }
            } catch (err) {
                console.error('Failed to fetch categories:', err);
            }
        };
        fetchCategories();
    }, []);

    useEffect(() => {
        if (!activeTab) return;
        const fetchTaggedProducts = async () => {
            setLoading(true);
            try {
                const res = await fetch(`/api/products?category=${activeTab}&limit=10`);
                const data = await res.json();
                if (data.docs) {
                    setProducts(data.docs.map((doc: Product) => formatProduct(doc)));
                }
            } catch (err) {
                console.error('Failed to fetch tagged products:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchTaggedProducts();
    }, [activeTab]);

    return (
        <div className="max-w-7xl mx-auto p-4">
            <div className='w-full overflow-auto scrollbar-none! flex gap-2 items-center mb-6'>
                {categories.map((cat) => (
                    <button
                        key={cat.id || cat.slug}
                        onClick={() => setActiveTab(cat.slug)}
                        className={`${
                            activeTab === cat.slug
                                ? 'text-creamy-bg bg-primary-800 border-primary-800 border-2 px-3 py-1.5 rounded-xl mb-2 font-medium shadow-sm'
                                : 'text-primary-800 bg-creamy-bg border-primary-800 border-2 px-3 py-1.5 rounded-xl mb-2 hover:bg-primary-800/10'
                        } focus:ring-0 focus:outline-none focus:border-none text-nowrap whitespace-nowrap cursor-pointer transition-all duration-200`}
                    >
                        {cat.name}
                    </button>
                ))}
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
                <EmptyState />
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

export default TaggedProducts