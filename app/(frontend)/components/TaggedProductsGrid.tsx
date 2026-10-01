"use client";

import 'swiper/css';
import 'swiper/css/free-mode';
import 'swiper/css/pagination';

import { useEffect, useState, useRef } from 'react';
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

const TaggedProductsGrid = () => {
    const [categories, setCategories] = useState<CategoryItem[]>([]);
    const [activeTab, setActiveTab] = useState<string>('');
    const [products, setProducts] = useState<ProductItem[]>([]);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [loading, setLoading] = useState(false);
    const sentinelRef = useRef<HTMLDivElement | null>(null);

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

    const loadProducts = async (catSlug: string, pageNum: number, replace: boolean) => {
        if (!catSlug) return;
        setLoading(true);
        try {
            const params = new URLSearchParams({
                category: catSlug,
                page: String(pageNum),
                limit: '8',
            });
            const res = await fetch(`/api/products?${params.toString()}`);
            const data = await res.json();
            if (data.docs) {
                const docs: ProductItem[] = data.docs.map((doc: Product) => formatProduct(doc));
                setPage(pageNum);
                if (replace) {
                    setProducts(docs);
                } else {
                    setProducts((prev) => [...prev, ...docs]);
                }
                setHasMore(Boolean(data.hasNextPage));
            }
        } catch (err) {
            console.error('Failed to load products in TaggedProductsGrid:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (!activeTab) return;
        const timer = setTimeout(() => {
            loadProducts(activeTab, 1, true);
        }, 0);
        return () => clearTimeout(timer);
    }, [activeTab]);

    useEffect(() => {
        if (!hasMore || loading) return;

        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting) {
                    const nextPage = page + 1;
                    setPage(nextPage);
                    loadProducts(activeTab, nextPage, false);
                }
            },
            { rootMargin: '200px' }
        );

        const currentSentinel = sentinelRef.current;
        if (currentSentinel) {
            observer.observe(currentSentinel);
        }

        return () => {
            if (currentSentinel) {
                observer.unobserve(currentSentinel);
            }
        };
    }, [hasMore, loading, page, activeTab]);

    return (
        <div className="max-w-7xl w-full p-4">
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

            {products.length === 0 && !loading ? (
                <EmptyState />
            ) : (
                <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 w-full gap-4'>
                    {products.map((prod, idx) => (
                        <ProductCard key={prod.id || `${prod.slug}-${idx}`} product={prod} />
                    ))}
                    {loading &&
                        Array.from({ length: products.length === 0 ? 8 : 4 }).map((_, idx) => (
                            <ProductCardSkeleton key={`skeleton-${idx}`} />
                        ))
                    }
                </div>
            )}
            <div ref={sentinelRef} className="h-4 w-full"></div>
        </div>
    )
}

export default TaggedProductsGrid