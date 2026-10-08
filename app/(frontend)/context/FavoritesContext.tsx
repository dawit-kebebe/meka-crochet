'use client'

import React, { createContext, useContext, useEffect, useState } from 'react'
import { ProductItem } from './CartContext'

interface FavoritesContextType {
  favorites: ProductItem[]
  addFavorite: (product: ProductItem) => void
  removeFavorite: (productId: string) => void
  toggleFavorite: (product: ProductItem) => void
  isFavorite: (productId: string) => boolean
  totalFavoritesCount: number
  isLoaded: boolean
}

const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined)

const STORAGE_KEY = 'meka_crochet_favorites'

export const FavoritesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [favorites, setFavorites] = useState<ProductItem[]>(() => {
    if (typeof window === 'undefined') return []
    try {
      const savedFavorites = localStorage.getItem(STORAGE_KEY)
      if (savedFavorites) {
        return JSON.parse(savedFavorites) as ProductItem[]
      }
    } catch (e) {
      console.error('Failed to load favorites from localStorage', e)
    }
    return []
  })
  const [isLoaded, setIsLoaded] = useState(() => typeof window !== 'undefined')

  useEffect(() => {
    if (!isLoaded) return
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(favorites))
    } catch (e) {
      console.error('Failed to save favorites to localStorage', e)
    }
  }, [favorites, isLoaded])

  const getProductId = (item: ProductItem) => item.id || item._id || item.slug

  const isFavorite = (productId: string) => {
    return favorites.some((item) => getProductId(item) === productId)
  }

  const addFavorite = (product: ProductItem) => {
    const id = getProductId(product)
    setFavorites((prev) => {
      if (prev.some((item) => getProductId(item) === id)) {
        return prev
      }
      return [...prev, product]
    })
  }

  const removeFavorite = (productId: string) => {
    setFavorites((prev) => prev.filter((item) => getProductId(item) !== productId))
  }

  const toggleFavorite = (product: ProductItem) => {
    const id = getProductId(product)
    setFavorites((prev) => {
      const exists = prev.some((item) => getProductId(item) === id)
      if (exists) {
        return prev.filter((item) => getProductId(item) !== id)
      } else {
        return [...prev, product]
      }
    })
  }

  return (
    <FavoritesContext.Provider
      value={{
        favorites,
        addFavorite,
        removeFavorite,
        toggleFavorite,
        isFavorite,
        totalFavoritesCount: favorites.length,
        isLoaded,
      }}
    >
      {children}
    </FavoritesContext.Provider>
  )
}

export const useFavorites = () => {
  const context = useContext(FavoritesContext)
  if (!context) {
    throw new Error('useFavorites must be used within a FavoritesProvider')
  }
  return context
}
