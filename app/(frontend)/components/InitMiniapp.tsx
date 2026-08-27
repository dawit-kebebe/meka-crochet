'use client'

import Script from 'next/script'
import { useEffect } from 'react'

const InitMiniapp = () => {
  useEffect(() => {
    const tg = window.Telegram?.WebApp;
    tg?.ready();
    tg?.expand();
  }, []);

  return (
    <Script
      src="https://telegram.org/js/telegram-web-app.js?63"
      strategy="beforeInteractive"
    />
  )
    }

export default InitMiniapp