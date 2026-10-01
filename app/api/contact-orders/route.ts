import { NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { fullName, email, phone, address, paymentMethod, items, totalAmount, telegramId } = body

    if (!fullName || !phone) {
      return NextResponse.json(
        { success: false, message: 'Full name and phone number are required.' },
        { status: 400 }
      )
    }

    // If user is not authenticated through Telegram, the fillout form is strictly mandatory
    if (!telegramId && (!email || !address)) {
      return NextResponse.json(
        { success: false, message: 'Full name, email, phone, and address are required.' },
        { status: 400 }
      )
    }

    const payload = await getPayload({ config })

    let telegramUserRel;
    if (telegramId) {
      const tgUserRes = await payload.find({
        collection: 'telegram-users',
        where: {
          telegramId: {
            equals: String(telegramId),
          },
        },
      })
      if (tgUserRes.docs.length > 0) {
        telegramUserRel = tgUserRes.docs[0].id
        // Save/update phone on TelegramUser record if provided
        if (phone && tgUserRes.docs[0].phone !== phone) {
          try {
            await payload.update({
              collection: 'telegram-users',
              id: tgUserRes.docs[0].id,
              data: { phone },
            })
          } catch (updateErr) {
            console.error('Failed to update Telegram user phone:', updateErr)
          }
        }
      }
    }

    const orderRecord = await payload.create({
      collection: 'orders',
      data: {
        fullName,
        email: email || (telegramId ? `tg_${telegramId}@telegram.org` : ''),
        phone,
        address: address || (telegramId ? 'Telegram Mini-App Order' : ''),
        paymentMethod: paymentMethod || 'cash',
        items: items || [],
        totalAmount: totalAmount || 0,
        telegramUser: telegramUserRel,
        telegramId: telegramId ? String(telegramId) : undefined,
        status: 'pending',
      },
    })

    return NextResponse.json({
      success: true,
      message: 'Order placed successfully!',
      order: orderRecord,
    })
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    console.error('Contact order submission error:', error)
    return NextResponse.json({ success: false, error: errorMessage }, { status: 500 })
  }
}
