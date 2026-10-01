'use client'

import React from 'react'
import { CartItem } from '../context/CartContext'

interface CheckoutProductCardProps {
    item?: CartItem
}

const CheckoutProductCard: React.FC<CheckoutProductCardProps> = ({ item }) => {
    const title = item?.product.title || 'Deemah Date Bars'
    const imageUrl = item?.product.imageUrl || 'https://picsum.photos/600/800'
    const quantity = item?.quantity ?? 1
    const price = item?.product.price ?? 58
    const size = item?.selectedSize ? ` (${item.selectedSize})` : ''
    const itemTotal = price * quantity

    return (
        <div className="bg-creamy-bg h-full rounded-3xl transition-all duration-300 group overflow-hidden relative border border-transparent hover:border-transparent shadow-md hover:shadow-lg">
            <div className="flex flex-col h-full justify-between relative">
                <div className="h-full w-full">
                    <div className="w-full h-full overflow-hidden relative">
                        <div className="cursor-pointer w-full h-full">
                            <img src={imageUrl} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" loading="lazy" alt={title} />
                        </div>
                        <div className="absolute top-2.5 right-2.5 flex items-center justify-center w-fit py-1 px-3 rounded-xl bg-primary-800 text-creamy-bg">
                            &#215; {quantity}
                        </div>
                    </div>
                </div>
                <div className="absolute z-1 bottom-0 inset-x-3 mb-3 p-3 rounded-[10px] shadow-sm bg-creamy-bg/50 backdrop-blur-sm flex flex-col items-start gap-0.5 cursor-pointer min-h-20">
                    <h3 className="text-2xl text-primary-900 font-bold leading-tight line-clamp-1 max-w-full">
                        {title}{size}
                    </h3>
                    <p className="line-clamp-2 text-slate-800 text-sm font-normal truncate w-full">
                        {item?.product.description || 'Handcrafted crochet product.'}
                    </p>
                    <div className="flex items-center justify-between w-full">
                        <span className="text-primary-900 text-base sm:text-lg font-bold whitespace-nowrap">
                            Total: {itemTotal} Br
                        </span>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default CheckoutProductCard