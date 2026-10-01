import { NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'

const initialAds = [
  {
    title: 'Handcrafted Crochet Excellence',
    subtitle: 'Discover our newest summer collection woven with love and premium organic yarn.',
    badge: 'NEW ARRIVAL',
    imageUrl: 'https://picsum.photos/id/1025/1200/500',
    link: '/products',
    buttonText: 'Shop New Arrivals',
    active: true,
    order: 1,
  },
  {
    title: 'Stylish Boho & Summer Bags',
    subtitle: 'Spacious, lightweight, and durable handcrafted crochet shoulder and tote bags.',
    badge: 'TRENDING',
    imageUrl: 'https://picsum.photos/id/1062/1200/500',
    link: '/products',
    buttonText: 'Explore Bags',
    active: true,
    order: 2,
  },
  {
    title: 'Cute Baby Wear & Wearables',
    subtitle: 'Ultra-soft pure cotton baby booties, beanies, and cuddly handcrafted toys.',
    badge: 'BEST SELLER',
    imageUrl: 'https://picsum.photos/id/1068/1200/500',
    link: '/products',
    buttonText: 'View Kids & Baby',
    active: true,
    order: 3,
  },
]

export async function GET() {
  try {
    const payload = await getPayload({ config })

    let result = await payload.find({
      collection: 'ads',
      where: {
        active: {
          equals: true,
        },
      },
      sort: 'order',
    })

    if (result.totalDocs === 0) {
      for (const ad of initialAds) {
        await payload.create({
          collection: 'ads',
          data: ad,
        })
      }
      result = await payload.find({
        collection: 'ads',
        where: {
          active: {
            equals: true,
          },
        },
        sort: 'order',
      })
    }

    return NextResponse.json(result)
  } catch (error) {
    console.error('Fetch ads error:', error)
    return NextResponse.json({ success: false, error: (error as Error).message }, { status: 500 })
  }
}
