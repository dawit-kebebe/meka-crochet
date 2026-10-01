'use client'

import React from 'react'
import CheckoutProductCard from '@app/components/CheckoutProductCard'
import EmptyState from '@app/components/EmptyState'
import SectionTitle from '@app/components/SectionTitle'
import CheckoutModals from './CheckoutModals'
import { useCart } from '../context/CartContext'

export default function CartClient() {
  const { cart } = useCart()

  return (
    <div className='max-w-7xl w-full px-4 mb-20'>
      <SectionTitle>Your Cart</SectionTitle>
      {cart.length === 0 ? (
        <EmptyState
          title="Your Cart is Empty"
          description="Your cart is currently empty. Explore our collection and add your favorite items!"
        />
      ) : (
        <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-8'>
          {cart.map((item, idx) => (
            <CheckoutProductCard key={`${item.product.id || item.product.slug}-${item.selectedSize}-${idx}`} item={item} />
          ))}
        </div>
      )}
      <CheckoutModals />
    </div>
  )
}
