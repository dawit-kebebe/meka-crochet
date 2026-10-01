'use client'

import React, { useCallback, useEffect, useState } from 'react'
import SearchForm from '@app/components/blocks/SearchForm'
import ProductListing from '@app/components/blocks/ProductListing'
import { ProductItem } from '@app/context/CartContext'
import { Product } from '@/payload-types'
import { formatProduct } from '@app/utils/product'

export default function SearchClient() {
  const [searchQuery, setSearchQuery] = useState('')
  const [category, setCategory] = useState('All')
  const [products, setProducts] = useState<ProductItem[]>([])
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)
  const [loading, setLoading] = useState(false)

  const fetchProducts = useCallback(async (search: string, cat: string, pageNum: number, isNewSearch: boolean) => {
    setLoading(true)
    try {
      const params = new URLSearchParams({
        page: String(pageNum),
        limit: '8',
        search: search.trim(),
        category: cat,
      })
      const res = await fetch(`/api/products?${params.toString()}`)
      const data = await res.json()

      if (data.docs) {
        const fetchedDocs: ProductItem[] = data.docs.map((doc: Product) => formatProduct(doc))

        if (isNewSearch) {
          setProducts(fetchedDocs)
        } else {
          setProducts((prev) => [...prev, ...fetchedDocs])
        }

        setHasMore(Boolean(data.hasNextPage))
      }
    } catch (err) {
      console.error('Failed to fetch search products:', err)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    const timer = setTimeout(() => {
      setPage(1)
      fetchProducts(searchQuery, category, 1, true)
    }, 250)

    return () => clearTimeout(timer)
  }, [searchQuery, category, fetchProducts])

  const handleLoadMore = () => {
    if (!loading && hasMore) {
      const nextPage = page + 1
      setPage(nextPage)
      fetchProducts(searchQuery, category, nextPage, false)
    }
  }

  return (
    <div className="max-w-7xl w-full px-4">
      <SearchForm
        searchQuery={searchQuery}
        onSearchChange={(q) => setSearchQuery(q)}
        selectedCategory={category}
        onCategoryChange={(c) => setCategory(c)}
      />
      <ProductListing
        products={products}
        loading={loading}
        hasMore={hasMore}
        onLoadMore={handleLoadMore}
      />
    </div>
  )
}
