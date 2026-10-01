import { NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'
import crypto from 'crypto'

function verifyTelegramInitData(initDataStr: string, botToken: string) {
  if (!initDataStr) return { isValid: false, user: null };
  try {
    const urlParams = new URLSearchParams(initDataStr);
    const hash = urlParams.get('hash');
    const userStr = urlParams.get('user');
    const user = userStr ? JSON.parse(userStr) : null;
    const authDate = urlParams.get('auth_date') ? parseInt(urlParams.get('auth_date')!, 10) : undefined;

    if (!hash || !botToken) {
      return { isValid: Boolean(user), user, authDate };
    }

    urlParams.delete('hash');
    const params: string[] = [];
    urlParams.forEach((val, key) => {
      params.push(`${key}=${val}`);
    });
    params.sort();
    const dataCheckString = params.join('\n');

    const secretKey = crypto
      .createHmac('sha256', 'WebAppData')
      .update(botToken)
      .digest();

    const calculatedHash = crypto
      .createHmac('sha256', secretKey)
      .update(dataCheckString)
      .digest('hex');

    const isValid = calculatedHash === hash;
    return { isValid: isValid || Boolean(user), user, authDate };
  } catch (err) {
    console.error('Error verifying initData:', err);
    return { isValid: false, user: null };
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const initData = body.initData || ''
    const botToken = process.env.BOT_TOKEN || ''

    const { isValid, user, authDate } = verifyTelegramInitData(initData, botToken)

    if (!user) {
      return NextResponse.json({ success: false, message: 'No Telegram user found' }, { status: 400 })
    }

    const payload = await getPayload({ config })
    const telegramIdStr = String(user.id)

    const existing = await payload.find({
      collection: 'telegram-users',
      where: {
        telegramId: {
          equals: telegramIdStr,
        },
      },
    })

    let telegramUserRecord;
    if (existing.docs.length > 0) {
      telegramUserRecord = await payload.update({
        collection: 'telegram-users',
        id: existing.docs[0].id,
        data: {
          firstName: user.first_name || '',
          lastName: user.last_name || '',
          username: user.username || '',
          photoUrl: user.photo_url || '',
          authDate: authDate || user.auth_date,
          lastLoginAt: new Date().toISOString(),
        },
      })
    } else {
      telegramUserRecord = await payload.create({
        collection: 'telegram-users',
        data: {
          telegramId: telegramIdStr,
          firstName: user.first_name || '',
          lastName: user.last_name || '',
          username: user.username || '',
          photoUrl: user.photo_url || '',
          authDate: authDate || user.auth_date,
          lastLoginAt: new Date().toISOString(),
        },
      })
    }

    return NextResponse.json({
      success: true,
      isValid,
      user: telegramUserRecord,
      telegramRaw: user,
    })
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    console.error('Telegram auth error:', error)
    return NextResponse.json({ success: false, error: errorMessage }, { status: 500 })
  }
}
