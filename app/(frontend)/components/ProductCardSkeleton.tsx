'use client'

import React from 'react'

interface ProductCardSkeletonProps {
  className?: string
}

const ProductCardSkeleton: React.FC<ProductCardSkeletonProps> = ({ className = '' }) => {
  return (
    <div
      role="status"
      aria-label="Loading product..."
      className={`bg-creamy-bg/80 h-full w-full rounded-3xl overflow-hidden relative shadow-md animate-pulse border border-transparent aspect-[3/4] min-h-[380px] sm:min-h-[420px] ${className}`}
    >
      <div className="flex flex-col h-full justify-between relative">
        {/* Main image placeholder */}
        <div className="h-full w-full">
          <div className="w-full h-full overflow-hidden relative flex items-center justify-center bg-creamy-bg-darker/30">
            <svg
              className="w-12 h-12 text-primary-800/40"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              fill="none"
              viewBox="0 0 24 24"
            >
              <path
                stroke="currentColor"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M10 3v4a1 1 0 0 1-1 1H5m14-4v16a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V7.914a1 1 0 0 1 .293-.707l3.914-3.914A1 1 0 0 1 9.914 3H18a1 1 0 0 1 1 1ZM9 12h2a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1H9a1 1 0 0 1-1-1v-2a1 1 0 0 1 1-1Zm5.697 2.395v-.733l1.269-1.219v2.984l-1.268-1.032Z"
              />
            </svg>

            {/* Favorite button placeholder */}
            <div className="absolute top-2.5 right-2.5 w-10 h-10 rounded-full bg-primary-800/25 flex items-center justify-center shadow-sm">
              <div className="w-4 h-4 rounded-full bg-creamy-bg/40"></div>
            </div>
          </div>
        </div>

        {/* Floating bottom overlay card */}
        <div className="absolute z-1 bottom-0 inset-x-3 mb-3 p-3 rounded-[10px] shadow-sm bg-creamy-bg/70 backdrop-blur-sm flex flex-col items-start gap-2 min-h-20">
          {/* Title line */}
          <div className="h-6 bg-primary-800/25 rounded-md w-3/4 my-0.5"></div>

          {/* Description line */}
          <div className="h-3 bg-primary-800/20 rounded-full w-5/6"></div>

          {/* Rating & Sold count */}
          <div className="flex items-center w-full gap-4">
            <div className="flex items-center gap-1.5">
              <div className="w-5 h-5 rounded-full bg-amber-400/40"></div>
              <div className="h-3.5 bg-primary-800/25 rounded-full w-8"></div>
            </div>
            <div className="flex items-baseline gap-1">
              <div className="h-3.5 bg-primary-800/25 rounded-full w-6"></div>
              <div className="h-2.5 bg-primary-800/20 rounded-full w-8"></div>
            </div>
          </div>

          {/* Price & Add to Cart button */}
          <div className="flex items-center justify-between w-full pt-1">
            <div className="h-6 bg-primary-900/30 rounded-md w-20"></div>
            <div className="w-10 h-10 rounded-lg bg-primary-800/30 flex items-center justify-center shadow-sm">
              <div className="w-4 h-4 rounded-md bg-creamy-bg/40"></div>
            </div>
          </div>
        </div>
      </div>

      <span className="sr-only">Loading...</span>
    </div>
  )
}

export default ProductCardSkeleton
