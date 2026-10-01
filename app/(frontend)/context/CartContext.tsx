'use client'

import React, { createContext, useContext, useEffect, useState } from 'react'

export interface ProductItem {
  id?: string
  _id?: string
  title: string
  slug: string
  price: number
  originalPrice?: number
  category?: string
  imageUrl?: string
  images?: string[]
  rating?: number
  soldCount?: number
  description?: string
  sizes?: string[]
}

export interface CartItem {
  product: ProductItem
  quantity: number
  selectedSize: string
}

interface CartContextType {
  cart: CartItem[]
  addToCart: (product: ProductItem, size?: string, quantity?: number) => void
  removeFromCart: (productId: string, size?: string) => void
  updateQuantity: (productId: string, quantity: number, size?: string) => void
  clearCart: () => void
  totalItemsCount: number
  totalPrice: number
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cart, setCart] = useState<CartItem[]>([])

  useEffect(() => {
    const handle = requestAnimationFrame(() => {
      try {
        const savedCart = localStorage.getItem('meka_crochet_cart')
        if (savedCart) {
          setCart(JSON.parse(savedCart) as CartItem[])
        }
      } catch (e) {
        console.error('Failed to load cart from localStorage', e)
      }
    })
    return () => cancelAnimationFrame(handle)
  }, [])

  useEffect(() => {
    try {
      localStorage.setItem('meka_crochet_cart', JSON.stringify(cart))
    } catch (e) {
      console.error('Failed to save cart to localStorage', e)
    }
  }, [cart])

  const addToCart = (product: ProductItem, size?: string, quantity: number = 1) => {
    const sizeToUse = size || (product.sizes && product.sizes.length > 0 ? product.sizes[0] : 'M')
    const productId = product.id || product._id || product.slug

    setCart((prevCart) => {
      const existingIndex = prevCart.findIndex(
        (item) => (item.product.id || item.product._id || item.product.slug) === productId && item.selectedSize === sizeToUse
      )

      if (existingIndex > -1) {
        const updated = [...prevCart]
        updated[existingIndex].quantity += quantity
        return updated
      } else {
        return [...prevCart, { product, quantity, selectedSize: sizeToUse }]
      }
    })
  }

  const removeFromCart = (productId: string, size?: string) => {
    setCart((prevCart) =>
      prevCart.filter(
        (item) => !((item.product.id || item.product._id || item.product.slug) === productId && (!size || item.selectedSize === size))
      )
    )
  }

  const updateQuantity = (productId: string, quantity: number, size?: string) => {
    if (quantity <= 0) {
      removeFromCart(productId, size)
      return
    }

    setCart((prevCart) =>
      prevCart.map((item) => {
        if ((item.product.id || item.product._id || item.product.slug) === productId && (!size || item.selectedSize === size)) {
          return { ...item, quantity }
        }
        return item
      })
    )
  }

  const clearCart = () => {
    setCart([])
  }

  const totalItemsCount = cart.reduce((sum, item) => sum + item.quantity, 0)

  const totalPrice = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0)

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        totalItemsCount,
        totalPrice,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export const useCart = () => {
  const context = useContext(CartContext)
  if (!context) {
    throw new Error('useCart must be used within a CartProvider')
  }
  return context
}
