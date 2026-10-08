"use client"

import { Button, Modal, ModalBody, ModalHeader } from "flowbite-react";
import { useState, useEffect } from "react";
import { useCart } from "../context/CartContext";
import { useTelegramAuth } from "../context/TelegramAuthContext";

const CheckoutModals = () => {
  const [openModal, setOpenModal] = useState<boolean>(false);
  const [openContactModal, setOpenContactModal] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [successMessage, setSuccessMessage] = useState<string>('');
  const [telegramError, setTelegramError] = useState<string>('');

  const { cart, totalPrice, clearCart } = useCart();
  const { user, telegramRaw, isTelegramMiniApp, requestContact, setPhone } = useTelegramAuth();

  const isTelegram = isTelegramMiniApp || Boolean(user?.telegramId || telegramRaw?.id);

  const initialName = user?.firstName
    ? `${user.firstName} ${user.lastName || ''}`.trim()
    : telegramRaw?.first_name
    ? `${telegramRaw.first_name} ${telegramRaw.last_name || ''}`.trim()
    : '';

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    payment_method: 'cash',
  });

  useEffect(() => {
    if (!initialName && !user?.phone) return;
    const handle = requestAnimationFrame(() => {
      setFormData((prev) => ({
        ...prev,
        name: prev.name || initialName,
        phone: prev.phone || user?.phone || '',
      }));
    });
    return () => cancelAnimationFrame(handle);
  }, [initialName, user?.phone]);

  // const openPayNow = () => {
  //   window.open(process.env.NEXT_PUBLIC_PAYMENT_URL!, '_blank', 'noopener,noreferrer');
  // };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const submitOrderWithData = async (orderInfo: {
    fullName: string;
    phone: string;
    email?: string;
    address?: string;
    paymentMethod?: string;
  }) => {
    setLoading(true);
    setSuccessMessage('');
    setTelegramError('');

    try {
      const orderData = {
        fullName: orderInfo.fullName,
        email: orderInfo.email || (user?.username ? `@${user.username}` : user?.telegramId ? `tg_${user.telegramId}@telegram.org` : ''),
        phone: orderInfo.phone,
        address: orderInfo.address || 'Order placed via Telegram Mini-App',
        paymentMethod: orderInfo.paymentMethod || 'cash',
        items: cart.map((item) => ({
          title: item.product.title,
          productId: item.product.id || item.product.slug,
          quantity: item.quantity,
          size: item.selectedSize,
          price: item.product.price,
          totalPrice: item.product.price * item.quantity,
        })),
        totalAmount: totalPrice,
        telegramId: user?.telegramId || (telegramRaw?.id ? String(telegramRaw.id) : null),
      };

      const res = await fetch('/api/contact-orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderData),
      });

      const data = await res.json();
      if (data.success) {
        setSuccessMessage(`Thank you, ${orderInfo.fullName}! Your order has been placed successfully. We will contact you at ${orderInfo.phone}.`);
        clearCart();
        setTimeout(() => {
          setOpenModal(false);
          setOpenContactModal(false);
          setSuccessMessage('');
        }, 2500);
      } else {
        alert(data.message || 'Failed to submit order request.');
      }
    } catch (err) {
      console.error('Error submitting order:', err);
      alert('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSharePhoneOrder = async () => {
    setTelegramError('');
    // If phone is already saved in profile
    if (user?.phone) {
      await submitOrderWithData({
        fullName: initialName || 'Telegram Customer',
        phone: user.phone,
      });
      return;
    }

    // Request contact via native Telegram WebApp API
    setLoading(true);
    try {
      const contactRes = await requestContact();
      if (contactRes && contactRes.phone) {
        setPhone(contactRes.phone);
        await submitOrderWithData({
          fullName: contactRes.name || initialName || 'Telegram Customer',
          phone: contactRes.phone,
        });
      } else {
        setLoading(false);
        setTelegramError('Contact sharing was cancelled. You can try again or fill out the form manually.');
      }
    } catch (err) {
      console.error('Telegram contact request error:', err);
      setLoading(false);
      setTelegramError('Unable to access Telegram contact. Please enter your details below.');
      setOpenModal(false);
      setOpenContactModal(true);
    }
  };

  const handleConfirmOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    await submitOrderWithData({
      fullName: formData.name,
      email: formData.email,
      phone: formData.phone,
      address: formData.address,
      paymentMethod: formData.payment_method,
    });
  };

  return (
    <>
      <Modal show={openModal} size="md" onClose={() => setOpenModal(false)} popup dismissible>
        <ModalHeader className='bg-creamy-bg!' >
          <span className="text-xl font-semibold text-primary-800 mb-2">
            Select Checkout Method
          </span>
        </ModalHeader>
        <ModalBody className='bg-creamy-bg! text-primary-800!'>
          {successMessage ? (
            <div className="p-4 text-center text-green-800 bg-green-100 rounded-lg text-base font-medium flex flex-col items-center gap-2">
              <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
              </svg>
              <span>{successMessage}</span>
            </div>
          ) : (
            <div className="flex flex-col w-full gap-3">
              {isTelegram ? (
                <>
                  {/* Telegram 1-tap Phone Share Order Button */}
                  <button
                    type="button"
                    onClick={handleSharePhoneOrder}
                    disabled={loading || cart.length === 0}
                    className="w-full bg-[#24A1DE] hover:bg-[#1E88BE] active:scale-[0.99] text-white rounded-xl py-3.5 px-4 shadow-sm flex items-center justify-center gap-3 transition-all cursor-pointer font-medium disabled:opacity-50"
                  >
                    <svg className="w-6 h-6 shrink-0 fill-current" viewBox="0 0 24 24">
                      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69.01-.03.01-.14-.07-.19-.08-.05-.19-.02-.27 0-.12.03-1.99 1.27-5.63 3.73-.53.37-1.02.55-1.45.54-.48-.01-1.4-.27-2.09-.49-.84-.27-1.51-.42-1.45-.89.03-.25.38-.51 1.07-.78 4.18-1.82 6.98-3.02 8.39-3.61 3.99-1.66 4.82-1.95 5.37-1.96.12 0 .39.03.56.17.15.12.19.28.21.43 0 .06.01.2-.01.37z" />
                    </svg>
                    <div className="flex flex-col items-start text-left">
                      <span className="text-base font-semibold leading-tight">
                        {loading
                          ? 'Placing Order...'
                          : user?.phone
                          ? `Order with Phone (${user.phone})`
                          : 'Share Phone to Order'}
                      </span>
                      <span className="text-xs text-white/80 font-normal">
                        Quick 1-tap checkout via Telegram — no form needed
                      </span>
                    </div>
                  </button>

                  {telegramError && (
                    <p className="text-xs text-red-600 bg-red-50 p-2 rounded-lg text-center">
                      {telegramError}
                    </p>
                  )}

                  <div className="relative flex py-1 items-center">
                    <div className="flex-grow border-t border-primary-800/15"></div>
                    <span className="flex-shrink mx-3 text-xs text-gray-400 font-medium">or</span>
                    <div className="flex-grow border-t border-primary-800/15"></div>
                  </div>

                  {/* Manual form option if Telegram user wants to enter custom delivery address */}
                  <Button
                    onClick={() => {
                      setOpenModal(false);
                      setOpenContactModal(true);
                    }}
                    className="bg-primary-800/10! text-primary-800! hover:bg-primary-800/20! border border-primary-800/25 rounded-lg text-base py-2.5! cursor-pointer shadow-none"
                  >
                    Enter Delivery Details Manually
                  </Button>
                </>
              ) : (
                /* Non-Telegram Users: The contact form is mandatory */
                <Button
                  onClick={() => {
                    setOpenModal(false);
                    setOpenContactModal(true);
                  }}
                  className="bg-primary-800! text-creamy-bg rounded-lg text-xl py-4! cursor-pointer"
                >
                  Contact Back (Fill Delivery Form)
                </Button>
              )}

              {/* <Button
                onClick={() => {
                  setOpenModal(false);
                  openPayNow();
                }}
                className="bg-primary-800! text-creamy-bg rounded-lg text-xl py-4! cursor-pointer"
              >
                Pay Now
              </Button> */}
            </div>
          )}
        </ModalBody>
      </Modal>

      {/* Contact Form Modal */}
      <Modal show={openContactModal} size="md" onClose={() => setOpenContactModal(false)} popup dismissible>
        <ModalHeader className='bg-creamy-bg!' >
          <span className="text-xl font-semibold text-primary-800 mb-2">
            Contact & Delivery Information
          </span>
        </ModalHeader>
        <ModalBody className='bg-creamy-bg! text-primary-800!'>
          {successMessage ? (
            <div className="p-4 text-center text-green-800 bg-green-100 rounded-lg text-base font-medium flex flex-col items-center gap-2">
              <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
              </svg>
              <span>{successMessage}</span>
            </div>
          ) : (
            <form onSubmit={handleConfirmOrder} className="flex flex-col w-full gap-2.5">
              {!isTelegram && (
                <p className="text-xs text-primary-800/70 mb-1">
                  Please fill out all required fields so we can deliver your order.
                </p>
              )}

              <div>
                <label htmlFor="name" className="text-xs font-semibold text-primary-800 block mb-1">
                  Full Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="px-3 py-2 border border-creamy-bg-darker text-heading text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 outline-none! block w-full bg-white"
                  placeholder="Enter your full name"
                  required
                />
              </div>

              <div>
                <label htmlFor="email" className="text-xs font-semibold text-primary-800 block mb-1">
                  Email {!isTelegram && <span className="text-red-500">*</span>}
                </label>
                <input
                  type="email"
                  id="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="px-3 py-2 border border-creamy-bg-darker text-heading text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 outline-none! block w-full bg-white"
                  placeholder="Enter email address"
                  required={!isTelegram}
                />
              </div>

              <div>
                <div className="flex justify-between items-center mb-1">
                  <label htmlFor="phone" className="text-xs font-semibold text-primary-800">
                    Phone Number <span className="text-red-500">*</span>
                  </label>
                  {isTelegram && (
                    <button
                      type="button"
                      onClick={async () => {
                        const res = await requestContact();
                        if (res?.phone) {
                          setFormData((prev) => ({
                            ...prev,
                            phone: res.phone,
                            name: res.name || prev.name,
                          }));
                        }
                      }}
                      className="text-[11px] text-[#24A1DE] hover:underline cursor-pointer font-medium"
                    >
                      Autofill from Telegram
                    </button>
                  )}
                </div>
                <input
                  type="tel"
                  id="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="px-3 py-2 border border-creamy-bg-darker text-heading text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 outline-none! block w-full bg-white"
                  placeholder="e.g. +251 91 234 5678"
                  required
                />
              </div>

              <div>
                <label htmlFor="address" className="text-xs font-semibold text-primary-800 block mb-1">
                  Delivery Address {!isTelegram && <span className="text-red-500">*</span>}
                </label>
                <input
                  type="text"
                  id="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  className="px-3 py-2 border border-creamy-bg-darker text-heading text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 outline-none! block w-full bg-white"
                  placeholder="City, subcity, specific location"
                  required={!isTelegram}
                />
              </div>

              <div>
                <label htmlFor="payment_method" className="text-xs font-semibold text-primary-800 block mb-1">
                  Payment Method <span className="text-red-500">*</span>
                </label>
                <select
                  id="payment_method"
                  value={formData.payment_method}
                  onChange={handleInputChange}
                  className="px-3 py-2 border border-creamy-bg-darker text-heading text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 outline-none! block w-full bg-white"
                  required
                >
                  <option value="cash">Cash on Delivery</option>
                  <option value="card">Card Payment</option>
                </select>
              </div>

              <Button
                type="submit"
                disabled={loading || cart.length === 0}
                className="w-full bg-primary-800! text-creamy-bg rounded-lg text-lg py-3! cursor-pointer mt-2"
              >
                {loading ? 'Submitting Order...' : 'Confirm & Place Order'}
              </Button>
            </form>
          )}
        </ModalBody>
      </Modal>

      <div className='max-w-7xl w-full fixed bottom-0 left-1/2 -translate-x-1/2 mx-auto mb-1 px-4 z-10'>
        <Button
          onClick={() => setOpenModal(true)}
          disabled={cart.length === 0}
          className='w-full bg-primary-800! text-creamy-bg rounded-lg text-xl py-4! cursor-pointer'
        >
          <svg width="20" height="22" viewBox="0 0 20 22" fill="none" className="w-6 h-6 text-creamy-bg" xmlns="http://www.w3.org/2000/svg">
            <path d="M9.99055 1.92C10.5207 1.91858 10.9494 1.48763 10.948 0.957444C10.9466 0.427255 10.5156 -0.00140454 9.98543 3.45869e-06L9.99055 1.92ZM5.19826 4.86912C5.19826 5.39931 5.62808 5.82912 6.15826 5.82912C6.68847 5.82912 7.11823 5.39931 7.11823 4.86912H5.19826ZM5.19826 6.08C5.19826 6.61019 5.62808 7.04 6.15826 7.04C6.68847 7.04 7.11823 6.61019 7.11823 6.08H5.19826ZM7.11823 4.86912C7.11823 4.33893 6.68847 3.90912 6.15826 3.90912C5.62808 3.90912 5.19826 4.33893 5.19826 4.86912H7.11823ZM6.04328 3.91603C5.51691 3.97954 5.14167 4.45773 5.20518 4.98411C5.26868 5.51048 5.74687 5.88571 6.27325 5.82221L6.04328 3.91603ZM7.43822 4.8L7.42658 5.76H7.43822V4.8ZM12.4123 4.8V5.76008L12.4241 5.75993L12.4123 4.8ZM13.5774 5.82221C14.1037 5.88571 14.5819 5.51048 14.6454 4.98411C14.7089 4.45773 14.3337 3.97954 13.8074 3.91603L13.5774 5.82221ZM6.28949 5.82064C6.81499 5.75029 7.18402 5.26724 7.11362 4.74174C7.04322 4.21623 6.56023 3.84726 6.03472 3.91761L6.28949 5.82064ZM2.3285 9.92L1.40558 9.65581C1.4026 9.66618 1.3998 9.67667 1.39718 9.68717L2.3285 9.92ZM1.0485 15.04L0.117175 14.8072C0.110967 14.832 0.105771 14.857 0.101572 14.8822L1.0485 15.04ZM18.7944 15.04L19.7415 14.8828C19.7372 14.8573 19.732 14.8321 19.7257 14.8072L18.7944 15.04ZM17.5144 9.92L18.4457 9.68717C18.4433 9.67706 18.4405 9.66695 18.4377 9.65683L17.5144 9.92ZM13.8129 3.91772C13.2874 3.84689 12.8041 4.21541 12.7333 4.74085C12.6624 5.26629 13.0309 5.74967 13.5564 5.82051L13.8129 3.91772ZM7.11823 9.4336C7.11823 8.90343 6.68847 8.4736 6.15826 8.4736C5.62808 8.4736 5.19826 8.90343 5.19826 9.4336H7.11823ZM5.19826 10.56C5.19826 11.0902 5.62808 11.52 6.15826 11.52C6.68847 11.52 7.11823 11.0902 7.11823 10.56H5.19826ZM9.86255 3.45869e-06C9.33237 -0.00140454 8.90139 0.427255 8.89999 0.957444C8.89858 1.48763 9.32725 1.91858 9.85743 1.92L9.86255 3.45869e-06ZM12.7297 4.86912C12.7297 5.39931 13.1596 5.82912 13.6897 5.82912C14.2199 5.82912 14.6497 5.39931 14.6497 4.86912H12.7297ZM14.6497 4.86912C14.6497 4.33893 14.2199 3.90912 13.6897 3.90912C13.1596 3.90912 12.7297 4.33893 12.7297 4.86912H14.6497ZM12.7297 6.08C12.7297 6.61019 13.1596 7.04 13.6897 7.04C14.2199 7.04 14.6497 6.61019 14.6497 6.08H12.7297ZM14.6497 9.43488C14.6497 8.90471 14.2199 8.47488 13.6897 8.47488C13.1596 8.47488 12.7297 8.90471 12.7297 9.43488H14.6497ZM12.7297 10.56C12.7297 11.0902 13.1596 11.52 13.6897 11.52C14.2199 11.52 14.6497 11.0902 14.6497 10.56H12.7297ZM9.98543 3.45869e-06C7.33954 0.00706906 5.19826 2.15403 5.19826 4.8H7.11823C7.11823 3.21242 8.40296 1.92423 9.99055 1.92L9.98543 3.45869e-06ZM5.19826 4.8V4.86912H7.11823V4.8H5.19826ZM7.11823 6.08V4.86912H5.19826V6.08H7.11823ZM6.27325 5.82221C6.6559 5.77604 7.04117 5.75532 7.42658 5.76L7.45 3.84008C6.97986 3.83436 6.50998 3.85973 6.04328 3.91603L6.27325 5.82221ZM7.43822 5.76L12.4123 5.76008V3.84H7.43822V5.76ZM12.4241 5.75993C12.8095 5.75524 13.1948 5.77604 13.5774 5.82221L13.8074 3.91603C13.3407 3.85973 12.8707 3.83436 12.4007 3.84008L12.4241 5.75993ZM6.04328 3.91761C4.8871 4.07125 3.94596 4.50332 3.17474 5.50611C2.46591 6.42775 1.94152 7.78381 1.40558 9.65581L3.25142 10.1842C3.78302 8.32755 4.22887 7.28489 4.69668 6.67661C5.1021 6.14948 5.544 5.92044 6.28949 5.82064L6.04328 3.91603ZM1.39718 9.68717L0.117175 14.8072L1.97984 15.2728L3.25984 10.1528L1.39718 9.68717ZM0.101572 14.8822C-0.267362 17.0958 0.391697 18.7437 1.70578 19.7908C2.94691 20.7798 4.63227 21.12 6.15442 21.12V19.2C4.85675 19.2 3.66914 18.9002 2.90228 18.2892C2.20835 17.7363 1.72437 16.8242 1.99545 15.1978L0.101572 14.8822ZM6.15442 21.12H9.98799V19.2H6.15442V21.12ZM9.98799 21.12H13.6885V19.2H9.98799V21.12ZM13.6885 21.12C15.209 21.12 16.8936 20.7796 18.1347 19.7908C19.4486 18.7441 20.1089 17.0966 19.7415 14.8828L17.8474 15.1972C18.1174 16.8234 17.6328 17.7359 16.9383 18.2892C16.1712 18.9004 14.984 19.2 13.6885 19.2V21.12ZM19.7257 14.8072L18.4457 9.68717L16.5831 10.1528L17.8631 15.2728L19.7257 14.8072ZM18.4377 9.65683C17.904 7.78483 17.3797 6.42887 16.6705 5.50697C15.8994 4.5046 14.9585 4.07217 13.8129 3.91772L13.5564 5.82051C14.3002 5.9208 14.7429 6.15012 15.1487 6.67767C15.6165 7.2857 16.0624 8.32781 16.5912 10.1832L18.4377 9.65683ZM5.19826 9.4336V10.56H7.11823V9.4336H5.19826ZM9.85743 1.92C11.445 1.92423 12.7297 3.21242 12.7297 4.8H14.6497C14.6497 2.15403 12.5086 0.00706906 9.86255 3.45869e-06L9.85743 1.92ZM12.7297 4.8V4.86912H14.6497V4.8H12.7297ZM12.7297 4.86912V6.08H14.6497V4.86912H12.7297ZM12.7297 9.43488V10.56H14.6497V9.43488H12.7297Z" fill="currentColor" />
          </svg>
          <span className='ml-2'>Checkout ({totalPrice} Br)</span>
        </Button>
      </div>
    </>
  )
}

export default CheckoutModals