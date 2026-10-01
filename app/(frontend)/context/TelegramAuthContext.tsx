'use client'

import React, { createContext, useContext, useEffect, useState } from 'react'
import type { WebAppUser, RequestContactResponse } from 'telegram-web-app'

export interface TelegramUserPayloadRecord {
  id?: string
  telegramId: string
  firstName?: string
  lastName?: string
  username?: string
  photoUrl?: string
  phone?: string
  authDate?: number
  lastLoginAt?: string
}

export interface TelegramAuthContextType {
  user: TelegramUserPayloadRecord | null
  telegramRaw: WebAppUser | null
  initData: string
  isAuthenticated: boolean
  isTelegramMiniApp: boolean
  isLoading: boolean
  setPhone: (phone: string) => void
  requestContact: () => Promise<{ phone: string; name?: string } | null>
}

const TelegramAuthContext = createContext<TelegramAuthContextType>({
  user: null,
  telegramRaw: null,
  initData: '',
  isAuthenticated: false,
  isTelegramMiniApp: false,
  isLoading: true,
  setPhone: () => {},
  requestContact: async () => null,
})

export const TelegramAuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<TelegramUserPayloadRecord | null>(null)
  const [telegramRaw, setTelegramRaw] = useState<WebAppUser | null>(null)
  const [initData, setInitData] = useState<string>('')
  const [isLoading, setIsLoading] = useState<boolean>(true)

  const setPhone = (phone: string) => {
    setUser((prev) => (prev ? { ...prev, phone } : { telegramId: String(telegramRaw?.id || ''), phone }))
  }

  const requestContact = (): Promise<{ phone: string; name?: string } | null> => {
    return new Promise((resolve) => {
      const tg = typeof window !== 'undefined' ? window.Telegram?.WebApp : undefined
      if (!tg) {
        resolve(null)
        return
      }

      if (typeof tg.requestContact === 'function') {
        try {
          tg.requestContact((shared: boolean, res: RequestContactResponse) => {
            if (shared && 'responseUnsafe' in res && res.responseUnsafe?.contact) {
              const contact = res.responseUnsafe.contact
              const phone = contact.phone_number
              const name = [contact.first_name, contact.last_name].filter(Boolean).join(' ')
              if (phone) {
                setPhone(phone)
                resolve({ phone, name })
                return
              }
            }
            resolve(null)
          })
        } catch (err) {
          console.error('Error in requestContact:', err)
          resolve(null)
        }
      } else {
        console.warn('requestContact is not supported on this Telegram WebApp version')
        resolve(null)
      }
    })
  }

  useEffect(() => {
    const authenticateTelegramUser = async () => {
      try {
        const tg = typeof window !== 'undefined' ? window.Telegram?.WebApp : undefined
        if (tg) {
          tg.ready()
          tg.expand()
        }

        const rawInitData = tg?.initData || ''
        const rawUser = tg?.initDataUnsafe?.user || null

        setInitData(rawInitData)
        if (rawUser) {
          setTelegramRaw(rawUser)
        }

        if (rawInitData || rawUser) {
          const res = await fetch('/api/telegram-auth', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              initData: rawInitData || (rawUser ? `user=${encodeURIComponent(JSON.stringify(rawUser))}` : ''),
            }),
          })
          const data = await res.json()
          if (data.success && data.user) {
            setUser(data.user)
          }
        }
      } catch (err) {
        console.error('Error authenticating Telegram user:', err)
      } finally {
        setIsLoading(false)
      }
    }

    authenticateTelegramUser()
  }, [])

  const isTelegramMiniApp = Boolean(
    user?.telegramId ||
    telegramRaw?.id ||
    (typeof window !== 'undefined' && window.Telegram?.WebApp?.initDataUnsafe?.user?.id)
  )

  return (
    <TelegramAuthContext.Provider
      value={{
        user,
        telegramRaw,
        initData,
        isAuthenticated: Boolean(user || telegramRaw),
        isTelegramMiniApp,
        isLoading,
        setPhone,
        requestContact,
      }}
    >
      {children}
    </TelegramAuthContext.Provider>
  )
}

export const useTelegramAuth = () => useContext(TelegramAuthContext)
