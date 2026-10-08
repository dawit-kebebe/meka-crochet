'use client'

import React, { useState, useEffect } from 'react'
import { Rating, RatingStar } from 'flowbite-react'
import { ProductItem } from '../context/CartContext'
import { useTelegramAuth } from '../context/TelegramAuthContext'

interface ReviewDoc {
  id?: string
  _id?: string
  author: string
  rating: number
  comment: string
  createdAt?: string
}

interface ReviewsProps {
  product: ProductItem
}

export default function Reviews({ product }: ReviewsProps) {
  const { user, telegramRaw } = useTelegramAuth()
  const [reviews, setReviews] = useState<ReviewDoc[]>([])
  const [rating, setRating] = useState(5)
  const [hoverRating, setHoverRating] = useState(0)
  const [comment, setComment] = useState('')
  const [loading, setLoading] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; text: string } | null>(null)
  const [refreshKey, setRefreshKey] = useState(0)

  const productId = product.id || product._id || product.slug

  // Resolve user info automatically from Telegram auth provider
  const firstName = user?.firstName || telegramRaw?.first_name || ''
  const lastName = user?.lastName || telegramRaw?.last_name || ''
  const fullName = [firstName, lastName].filter(Boolean).join(' ')
  const username = user?.username || telegramRaw?.username || ''
  const photoUrl = user?.photoUrl || telegramRaw?.photo_url || ''
  const displayName = fullName || (username ? `@${username}` : 'Customer')
  const avatarInitial = (firstName || username || displayName || 'C').charAt(0).toUpperCase()

  useEffect(() => {
    let ignore = false

    async function loadReviews() {
      if (!productId) return
      setLoading(true)
      try {
        const res = await fetch(`/api/reviews?where[product][equals]=${productId}&sort=-createdAt&limit=50&depth=0`)
        if (res.ok) {
          const data = await res.json()
          if (!ignore && Array.isArray(data.docs)) {
            setReviews(data.docs)
          }
        }
      } catch (err) {
        console.error('Failed to load reviews:', err)
      } finally {
        if (!ignore) {
          setLoading(false)
        }
      }
    }

    loadReviews()

    return () => {
      ignore = true
    }
  }, [productId, refreshKey])

  const submitReview = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!productId) {
      setFeedback({ type: 'error', text: 'Product ID is missing.' })
      return
    }

    if (!comment.trim()) {
      setFeedback({ type: 'error', text: 'Please write your review comment.' })
      return
    }

    setSubmitting(true)
    setFeedback(null)

    try {
      const res = await fetch('/api/reviews', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          author: displayName,
          rating: Number(rating),
          comment: comment.trim(),
          product: productId,
          user: user?.id || undefined,
          telegramId: user?.telegramId || (telegramRaw?.id ? String(telegramRaw.id) : undefined),
        }),
      })

      const data = await res.json()

      if (res.ok) {
        setComment('')
        setRating(5)
        setHoverRating(0)
        setFeedback({
          type: 'success',
          text: 'Thank you! Your review has been submitted.',
        })
        setRefreshKey((k) => k + 1)
      } else {
        const msg = data?.errors?.[0]?.message || 'Failed to submit review. Please try again.'
        setFeedback({ type: 'error', text: msg })
      }
    } catch (err) {
      console.error('Error submitting review:', err)
      setFeedback({ type: 'error', text: 'Connection error. Please try again.' })
    } finally {
      setSubmitting(false)
    }
  }

  const averageRating =
    reviews.length > 0
      ? reviews.reduce((sum, r) => sum + (Number(r.rating) || 0), 0) / reviews.length
      : Number(product.rating) || 5

  const activeRatingValue = hoverRating || rating

  const getRatingLabel = (val: number) => {
    switch (val) {
      case 5:
        return 'Excellent'
      case 4:
        return 'Very Good'
      case 3:
        return 'Good'
      case 2:
        return 'Fair'
      case 1:
        return 'Poor'
      default:
        return ''
    }
  }

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return null
    try {
      const d = new Date(dateStr)
      if (isNaN(d.getTime())) return null
      return d.toLocaleDateString(undefined, {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      })
    } catch {
      return null
    }
  }

  return (
    <div className="w-full text-primary-800 space-y-6">
      {/* Reviews Summary Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-creamy-bg-darker/30">
        <div>
          <h3 className="text-xl font-bold text-primary-800 tracking-tight">
            Customer Reviews
          </h3>
          <p className="text-xs text-primary-800/70 mt-0.5">
            {reviews.length} {reviews.length === 1 ? 'verified review' : 'verified reviews'}
          </p>
        </div>
        <div className="flex items-center gap-3 bg-creamy-bg-darker/15 px-3 py-1.5 rounded-xl border border-creamy-bg-darker/25">
          <span className="text-2xl font-black font-mono text-primary-800 leading-none">
            {averageRating.toFixed(1)}
          </span>
          <div className="flex flex-col">
            <Rating size="md">
              {[1, 2, 3, 4, 5].map((star) => (
                <RatingStar key={star} filled={star <= Math.round(averageRating)} />
              ))}
            </Rating>
            <span className="text-[10px] uppercase font-bold tracking-wider text-primary-800/60 mt-0.5">
              out of 5 stars
            </span>
          </div>
        </div>
      </div>

      {/* Reviews List */}
      <div className="space-y-3" aria-live="polite">
        {loading && reviews.length === 0 ? (
          <div className="space-y-3 py-2">
            {[1, 2].map((placeholder) => (
              <div
                key={placeholder}
                className="p-4 rounded-2xl bg-creamy-bg-darker/15 border border-creamy-bg-darker/20 animate-pulse space-y-3"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-full bg-creamy-bg-darker/30" />
                    <div className="h-4 w-28 bg-creamy-bg-darker/30 rounded-md" />
                  </div>
                  <div className="h-4 w-20 bg-creamy-bg-darker/30 rounded-md" />
                </div>
                <div className="h-3 w-3/4 bg-creamy-bg-darker/25 rounded-md" />
                <div className="h-3 w-1/2 bg-creamy-bg-darker/20 rounded-md" />
              </div>
            ))}
          </div>
        ) : reviews.length === 0 ? (
          <div className="py-8 px-4 text-center rounded-2xl bg-creamy-bg-darker/10 border border-dashed border-creamy-bg-darker/30">
            <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-primary-800/10 text-primary-800 flex items-center justify-center">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
              </svg>
            </div>
            <p className="font-semibold text-primary-800 text-base">No reviews yet</p>
            <p className="text-xs text-primary-800/70 mt-1 max-w-sm mx-auto">
              Be the first to share your experience with this handmade creation!
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {reviews.map((r, idx) => {
              const reviewInitial = (r.author || 'C').charAt(0).toUpperCase()
              const formattedDate = formatDate(r.createdAt)

              return (
                <article
                  key={r.id || r._id || idx}
                  className="p-4 rounded-2xl bg-creamy-bg-darker/15 border border-creamy-bg-darker/25 transition-shadow hover:shadow-xs"
                >
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div
                        className="w-8 h-8 rounded-full bg-primary-800 text-creamy-bg flex items-center justify-center font-bold text-xs shrink-0 select-none"
                        aria-hidden="true"
                      >
                        {reviewInitial}
                      </div>
                      <div className="min-w-0">
                        <span className="font-bold text-primary-800 text-sm block truncate">
                          {r.author}
                        </span>
                        {formattedDate && (
                          <time className="text-[11px] text-primary-800/60 block" dateTime={r.createdAt}>
                            {formattedDate}
                          </time>
                        )}
                      </div>
                    </div>

                    <div className="shrink-0 flex items-center gap-1.5" aria-label={`Rated ${r.rating} out of 5 stars`}>
                      <Rating size="sm">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <RatingStar key={star} filled={star <= (Number(r.rating) || 5)} />
                        ))}
                      </Rating>
                    </div>
                  </div>

                  <p className="text-sm text-primary-800/90 whitespace-pre-line leading-relaxed pl-10">
                    {r.comment}
                  </p>
                </article>
              )
            })}
          </div>
        )}
      </div>

      {/* Review Submission Form Card */}
      <section
        aria-labelledby="write-review-title"
        className="pt-5 border-t border-creamy-bg-darker/30"
      >
        <div className="p-4 sm:p-5 rounded-2xl bg-creamy-bg-darker/15 border border-creamy-bg-darker/30 shadow-xs">
          <div className="mb-4">
            <h4 id="write-review-title" className="text-lg font-bold text-primary-800">
              Leave a Review
            </h4>
            <p className="text-xs text-primary-800/70 mt-0.5">
              Share your feedback with other crochet lovers
            </p>
          </div>

          {feedback && (
            <div
              role="alert"
              aria-live="polite"
              className={`p-3 rounded-xl text-xs sm:text-sm font-medium mb-4 flex items-center gap-2.5 border ${
                feedback.type === 'success'
                  ? 'bg-emerald-500/15 text-emerald-950 border-emerald-600/30'
                  : 'bg-red-500/15 text-red-950 border-red-500/30'
              }`}
            >
              {feedback.type === 'success' ? (
                <svg className="w-5 h-5 text-emerald-700 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              ) : (
                <svg className="w-5 h-5 text-red-700 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              )}
              <span>{feedback.text}</span>
            </div>
          )}

          <form onSubmit={submitReview} className="space-y-4">
            {/* Authenticated User Badge (No manual name input) */}
            <div className="flex items-center gap-3 p-3 rounded-xl bg-creamy-bg-darker/20 border border-creamy-bg-darker/30">
              {photoUrl ? (
                <div
                  className="w-10 h-10 rounded-full bg-cover bg-center border border-primary-800/25 shrink-0 shadow-xs"
                  style={{ backgroundImage: `url(${photoUrl})` }}
                  role="img"
                  aria-label={`${displayName}'s profile photo`}
                />
              ) : (
                <div
                  className="w-10 h-10 rounded-full bg-primary-800 text-creamy-bg flex items-center justify-center font-bold text-sm shrink-0 shadow-xs select-none"
                  aria-hidden="true"
                >
                  {avatarInitial}
                </div>
              )}
              <div className="flex flex-col min-w-0">
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span className="text-[11px] text-primary-800/70 font-medium uppercase tracking-wider">
                    Reviewing as
                  </span>
                  <span className="text-sm font-bold text-primary-800 truncate">
                    {displayName}
                  </span>
                </div>
                {username && (
                  <span className="text-xs text-primary-800/60 font-mono">
                    @{username}
                  </span>
                )}
              </div>
            </div>

            {/* Rating Stars Selector */}
            <div className="space-y-1.5">
              <label id="rating-label" className="block text-xs font-bold text-primary-800 uppercase tracking-wider">
                Overall Rating
              </label>
              <div className="flex items-center gap-3 flex-wrap">
                <Rating size="lg"
                  role="radiogroup"
                  aria-labelledby="rating-label"
                  className="flex items-center gap-1 p-1 rounded-xl bg-creamy-bg-darker/20 border border-creamy-bg-darker/30"
                >
                  {[1, 2, 3, 4, 5].map((starValue) => {
                    const isSelected = rating === starValue
                    const isFilled = starValue <= activeRatingValue

                    return (
                      <button
                        key={starValue}
                        type="button"
                        role="radio"
                        aria-checked={isSelected}
                        aria-label={`Rate ${starValue} star${starValue > 1 ? 's' : ''} (${getRatingLabel(starValue)})`}
                        onClick={() => setRating(starValue)}
                        onMouseEnter={() => setHoverRating(starValue)}
                        onMouseLeave={() => setHoverRating(0)}
                        className="cursor-pointer p-1.5 rounded-lg transition-transform hover:scale-115 active:scale-90 focus-visible:ring-2 focus-visible:ring-primary-800 focus-visible:outline-none"
                      >
                        <RatingStar filled={isFilled} />
                      </button>
                    )
                  })}
                </Rating>

                <div className="text-xs font-bold text-primary-800 flex items-center gap-1.5">
                  <span className="font-mono text-sm">{activeRatingValue} / 5</span>
                  <span className="text-primary-800/70 font-normal">
                    • {getRatingLabel(activeRatingValue)}
                  </span>
                </div>
              </div>
            </div>

            {/* Review Comment Textarea */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label
                  htmlFor="review-comment"
                  className="block text-xs font-bold text-primary-800 uppercase tracking-wider"
                >
                  Your Review
                </label>
                <span className="text-[11px] text-primary-800/60">
                  {comment.length} characters
                </span>
              </div>
              <textarea
                id="review-comment"
                required
                aria-required="true"
                rows={3}
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="What did you like or dislike? How was the crochet craftsmanship?"
                className="w-full px-3.5 py-2.5 border border-creamy-bg-darker/50 rounded-xl bg-creamy-bg/30 text-primary-900 placeholder:text-primary-800/40 text-sm focus:border-primary-800 focus:ring-2 focus:ring-primary-800/20 focus:outline-none resize-none transition-colors"
              />
            </div>

            {/* Submit Button */}
            <div>
              <button
                type="submit"
                disabled={submitting}
                aria-busy={submitting}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-primary-800 text-creamy-bg font-bold text-sm rounded-xl py-3 px-6 cursor-pointer hover:bg-primary-700 active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-sm focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-primary-800 focus-visible:outline-none"
              >
                {submitting ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-creamy-bg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    <span>Submitting review...</span>
                  </>
                ) : (
                  <span>Submit Review</span>
                )}
              </button>
            </div>
          </form>
        </div>
      </section>
    </div>
  )
}
