import React from 'react'

interface EmptyStateProps {
  title?: string
  description?: string
  className?: string
}

const EmptyState: React.FC<EmptyStateProps> = ({
  title = 'No Product Available',
  description = 'There are currently no products under this category. Please select another category or check back soon!',
  className = 'my-4',
}) => {
  return (
    <div className={`w-full flex flex-col items-center justify-center p-10 bg-creamy-bg/60 border-2 border-dashed border-primary-800/30 rounded-2xl text-center ${className}`}>
      <svg
        className="w-12 h-12 text-primary-800/50 mb-3"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="1.5"
          d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
        />
      </svg>
      <h3 className="text-xl font-bold text-primary-800 mb-1">{title}</h3>
      {description && <p className="text-sm text-gray-600 max-w-md">{description}</p>}
    </div>
  )
}

export default EmptyState
