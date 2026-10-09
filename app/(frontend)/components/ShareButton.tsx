'use client'

import React, { useState, useSyncExternalStore } from 'react'
import { Button, Modal, ModalBody, ModalHeader } from 'flowbite-react'
import Image from 'next/image'

export interface ShareProductInfo {
  id?: string
  _id?: string
  slug?: string
  title: string
  price?: number
  originalPrice?: number
  description?: string
  imageUrl?: string
  images?: string[]
}

interface ShareButtonProps {
  product?: ShareProductInfo
}

const emptySubscribe = () => () => {}
const getClientOrigin = () => window.location.origin
const getServerOrigin = () => process.env.NEXT_PUBLIC_APP_URL || ''

const ShareButton: React.FC<ShareButtonProps> = ({ product }) => {
  const [openModal, setOpenModal] = useState<boolean>(false)
  const [copied, setCopied] = useState<boolean>(false)

  const origin = useSyncExternalStore(
    emptySubscribe,
    getClientOrigin,
    getServerOrigin
  )

  const prodId = product?.id || product?._id || product?.slug || ''
  const displayImage = product?.imageUrl || (product?.images && product.images[0]) || ''
  const baseOrigin = process.env.NEXT_PUBLIC_APP_URL || origin
  const productUrl = `${baseOrigin}/products/${prodId}`

  const handleShareTelegram = () => {
    const shareText = product?.title
      ? `Check out ${product.title} on Meka Crochet!`
      : 'Check out this handcrafted crochet item on Meka Crochet!'
    const telegramShareUrl = `https://t.me/share/url?url=${encodeURIComponent(productUrl)}&text=${encodeURIComponent(shareText)}`

    // Use Telegram Mini-App API if available, else fallback to window.open
    const tg = typeof window !== 'undefined' ? window.Telegram?.WebApp : undefined
    if (tg?.openTelegramLink) {
      tg.openTelegramLink(telegramShareUrl)
    } else if (typeof window !== 'undefined') {
      window.open(telegramShareUrl, '_blank')
    }
  }

  const handleCopyLink = async () => {
    let success = false

    if (navigator?.clipboard?.writeText) {
      try {
        await navigator.clipboard.writeText(productUrl)
        success = true
      } catch (err) {
        console.warn('Clipboard writeText failed, falling back:', err)
      }
    }

    if (!success && typeof document !== 'undefined') {
      try {
        const textarea = document.createElement('textarea')
        textarea.value = productUrl
        textarea.style.position = 'fixed'
        textarea.style.left = '-9999px'
        textarea.style.top = '-9999px'
        document.body.appendChild(textarea)
        textarea.focus()
        textarea.select()
        success = document.execCommand('copy')
        document.body.removeChild(textarea)
      } catch (err) {
        console.error('Fallback clipboard copy failed:', err)
      }
    }

    if (success) {
      setCopied(true)
      setTimeout(() => {
        setCopied(false)
      }, 2500)
    }
  }

  return (
    <>
      <Button
        color="alternative"
        onClick={() => setOpenModal(true)}
        aria-label="Share product"
        className="default border-none rounded-lg p-2 md:p-4 text-xl cursor-pointer hover:bg-primary-800/10 transition-colors"
      >
        <svg
          className="w-10 text-primary-800"
          viewBox="0 0 27 20"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M17.4895 17.0195L25.5003 10.2497C25.8166 9.9892 26 9.59922 26 9.18745C26 8.77568 25.8166 8.38588 25.5003 8.12517L17.4895 1.35547C17.0622 0.987219 16.4642 0.896926 15.9486 1.1229C15.4331 1.34888 15.0906 1.85153 15.0663 2.41774V5.08784C3.81968 3.12353 1 13.2709 1 19C3.60897 14.6357 10.3698 6.72441 15.0663 13.2709V15.9482C15.0873 16.5161 15.4286 17.0218 15.9447 17.2499C16.4609 17.4781 17.0609 17.3886 17.4895 17.0195Z"
            stroke="#2C405B"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </Button>

      <Modal
        show={openModal}
        size="md"
        onClose={() => setOpenModal(false)}
        popup
        dismissible
      >
        <ModalHeader className="bg-creamy-bg!">
          <span className="text-xl font-semibold text-primary-800 mb-2">
            Share Product
          </span>
        </ModalHeader>
        <ModalBody className="bg-creamy-bg! text-primary-800!">
          <div className="flex flex-col w-full gap-4">
            {/* Product preview snippet */}
            {product && (
              <div className="flex items-center gap-3 p-3 rounded-xl bg-primary-800/10 border border-primary-800/15">
                {displayImage && (
                  <div className="relative w-14 h-14 rounded-lg overflow-hidden shrink-0 bg-primary-800/20">
                    <Image
                      src={displayImage}
                      alt={product.title}
                      fill
                      sizes="56px"
                      className="object-cover"
                      unoptimized
                    />
                  </div>
                )}
                <div className="flex flex-col min-w-0 flex-1">
                  <h4 className="text-sm font-semibold text-primary-800 truncate">
                    {product.title}
                  </h4>
                  {product.price !== undefined && (
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-sm font-bold text-primary-800">
                        Br {product.price}
                      </span>
                      {product.originalPrice && (
                        <span className="text-xs line-through text-gray-500">
                          Br {product.originalPrice}
                        </span>
                      )}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Success alert when copied */}
            {copied && (
              <div className="p-3 text-center text-green-800 bg-green-100 rounded-xl text-sm font-medium flex items-center justify-center gap-2 animate-fade-in">
                <svg
                  className="w-5 h-5 text-green-600 shrink-0"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2.5"
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                <span>Link copied to clipboard!</span>
              </div>
            )}

            {/* Option 1: Share via Telegram */}
            <button
              type="button"
              onClick={handleShareTelegram}
              className="w-full bg-[#24A1DE] hover:bg-[#1E88BE] active:scale-[0.99] text-white rounded-xl py-3.5 px-4 shadow-sm flex items-center justify-between gap-3 transition-all cursor-pointer font-medium"
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center shrink-0">
                  <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69.01-.03.01-.14-.07-.19-.08-.05-.19-.02-.27 0-.12.03-1.99 1.27-5.63 3.73-.53.37-1.02.55-1.45.54-.48-.01-1.4-.27-2.09-.49-.84-.27-1.51-.42-1.45-.89.03-.25.38-.51 1.07-.78 4.18-1.82 6.98-3.02 8.39-3.61 3.99-1.66 4.82-1.95 5.37-1.96.12 0 .39.03.56.17.15.12.19.28.21.43 0 .06.01.2-.01.37z" />
                  </svg>
                </div>
                <div className="flex flex-col items-start text-left truncate">
                  <span className="text-base font-semibold leading-tight">
                    Share via Telegram
                  </span>
                  <span className="text-xs text-white/80 font-normal">
                    Forward to chats & groups
                  </span>
                </div>
              </div>
              <svg
                className="w-5 h-5 shrink-0 opacity-70"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </button>

            {/* Option 2: Copy Product Link */}
            <button
              type="button"
              onClick={handleCopyLink}
              className="w-full bg-primary-800! hover:bg-primary-900! active:scale-[0.99] text-creamy-bg rounded-xl py-3.5 px-4 shadow-sm flex items-center justify-between gap-3 transition-all cursor-pointer font-medium"
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-10 h-10 rounded-full bg-creamy-bg/15 flex items-center justify-center shrink-0">
                  {copied ? (
                    <svg
                      className="w-5 h-5 text-green-300"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2.5"
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  ) : (
                    <svg
                      className="w-5 h-5 text-creamy-bg"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3"
                      />
                    </svg>
                  )}
                </div>
                <div className="flex flex-col items-start text-left truncate">
                  <span className="text-base font-semibold leading-tight">
                    {copied ? 'Link Copied!' : 'Copy Product Link'}
                  </span>
                  <span className="text-xs text-creamy-bg/80 font-normal">
                    Copy to clipboard to share anywhere
                  </span>
                </div>
              </div>
              <svg
                className="w-5 h-5 shrink-0 opacity-70"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </button>

            {/* Quick URL preview with copy button */}
            <div className="flex items-center gap-2 bg-primary-800/10 rounded-xl p-2 border border-primary-800/20">
              <input
                type="text"
                readOnly
                value={productUrl}
                aria-label="Product link URL"
                className="bg-transparent border-none text-xs text-primary-900 flex-1 focus:ring-0 truncate select-all px-2 py-1 outline-none font-mono"
              />
              <button
                type="button"
                onClick={handleCopyLink}
                className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-primary-800 text-creamy-bg hover:bg-primary-900 cursor-pointer shrink-0 transition-colors"
              >
                {copied ? 'Copied' : 'Copy'}
              </button>
            </div>
          </div>
        </ModalBody>
      </Modal>
    </>
  )
}

export default ShareButton