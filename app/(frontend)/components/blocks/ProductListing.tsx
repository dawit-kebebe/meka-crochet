'use client'

import React, { useEffect, useRef } from 'react'
import ProductCard, { ProductCardSkeleton } from '@app/components/ProductCard'
import EmptyState from '@app/components/EmptyState'
import { ProductItem } from '@app/context/CartContext'

interface ProductListingProps {
  products?: ProductItem[]
  loading?: boolean
  hasMore?: boolean
  onLoadMore?: () => void
  emptyTitle?: string
  emptyDescription?: string
}

const ProductListing: React.FC<ProductListingProps> = ({
  products = [],
  loading = false,
  hasMore = false,
  onLoadMore,
  emptyTitle,
  emptyDescription = 'No products found matching your filter or search criteria. Try resetting your search or selecting a different category!',
}) => {
  const sentinelRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    if (!onLoadMore || !hasMore || loading) return

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          onLoadMore()
        }
      },
      { rootMargin: '200px' }
    )

    const currentSentinel = sentinelRef.current
    if (currentSentinel) {
      observer.observe(currentSentinel)
    }

    return () => {
      if (currentSentinel) {
        observer.unobserve(currentSentinel)
      }
    }
  }, [onLoadMore, hasMore, loading])

  return (
    <div className="w-full">
      {products.length === 0 && !loading && (
        <EmptyState title={emptyTitle} description={emptyDescription} />
      )}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-8">
        {products.map((prod, index) => (
          <ProductCard key={prod.id || prod._id || `${prod.slug}-${index}`} product={prod} />
        ))}
        {loading &&
          Array.from({ length: products.length === 0 ? 8 : 4 }).map((_, i) => (
            <ProductCardSkeleton key={`skeleton-${i}`} />
          ))}
      </div>
      <div ref={sentinelRef} className="h-4 w-full"></div>
    </div>
  )
}

export default ProductListing