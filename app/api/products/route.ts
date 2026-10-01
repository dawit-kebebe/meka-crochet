import { NextResponse } from 'next/server'
import { getPayload, Where } from 'payload'
import config from '@payload-config'

type InitialProduct = {
  title: string
  slug: string
  price: number
  originalPrice?: number
  categorySlug: string
  imageUrl?: string
  images?: { imageUrl: string }[]
  rating?: number
  soldCount?: number
  sizes?: ('S' | 'M' | 'L' | 'XL' | 'XXL')[]
  description?: string
}

const initialProductsData: InitialProduct[] = [
  {
    title: 'Crochet Cute Teddy',
    slug: 'crochet-cute-teddy',
    price: 450,
    originalPrice: 600,
    categorySlug: 'baby-clothing',
    imageUrl: 'https://picsum.photos/id/1025/600/800',
    images: [
      { imageUrl: 'https://picsum.photos/id/1025/600/800' },
      { imageUrl: 'https://picsum.photos/id/1068/600/800' },
      { imageUrl: 'https://picsum.photos/id/1027/600/800' },
    ],
    rating: 5,
    soldCount: 12,
    sizes: ['S', 'M'],
    description: 'Handmade adorable crochet teddy bear soft toy crafted with premium hypoallergenic yarn.',
  },
  {
    title: 'Handcrafted Boho Bag',
    slug: 'handcrafted-boho-bag',
    price: 850,
    originalPrice: 1100,
    categorySlug: 'bag',
    imageUrl: 'https://picsum.photos/id/1062/600/800',
    images: [
      { imageUrl: 'https://picsum.photos/id/1062/600/800' },
      { imageUrl: 'https://picsum.photos/id/1040/600/800' },
      { imageUrl: 'https://picsum.photos/id/1080/600/800' },
    ],
    rating: 5,
    soldCount: 28,
    sizes: ['M', 'L'],
    description: 'Stylish bohemian crochet shoulder bag with spacious inner storage.',
  },
  {
    title: 'Knitted Summer Top',
    slug: 'knitted-summer-top',
    price: 1200,
    originalPrice: 1500,
    categorySlug: 'summer-collection',
    imageUrl: 'https://picsum.photos/id/1027/600/800',
    images: [
      { imageUrl: 'https://picsum.photos/id/1027/600/800' },
      { imageUrl: 'https://picsum.photos/id/1005/600/800' },
      { imageUrl: 'https://picsum.photos/id/1069/600/800' },
    ],
    rating: 5,
    soldCount: 15,
    sizes: ['S', 'M', 'L'],
    description: 'Breathable lightweight crochet top ideal for warm summer days.',
  },
  {
    title: 'Vintage Men Beanie',
    slug: 'vintage-men-beanie',
    price: 350,
    originalPrice: 450,
    categorySlug: 'men',
    imageUrl: 'https://picsum.photos/id/1069/600/800',
    images: [
      { imageUrl: 'https://picsum.photos/id/1069/600/800' },
      { imageUrl: 'https://picsum.photos/id/1005/600/800' },
    ],
    rating: 5,
    soldCount: 42,
    sizes: ['M', 'L', 'XL'],
    description: 'Warm and cozy vintage style knitted beanie.',
  },
  {
    title: 'Deemah Date Bars Bag',
    slug: 'deemah-date-bars-bag',
    price: 58,
    originalPrice: 80,
    categorySlug: 'new-products',
    imageUrl: 'https://picsum.photos/id/1080/600/800',
    images: [
      { imageUrl: 'https://picsum.photos/id/1080/600/800' },
      { imageUrl: 'https://picsum.photos/id/1062/600/800' },
    ],
    rating: 5,
    soldCount: 8,
    sizes: ['S', 'M', 'L', 'XL'],
    description: 'Deemah Date Bars woven craft bag.',
  },
  {
    title: 'Crochet Baby Booties',
    slug: 'crochet-baby-booties',
    price: 250,
    originalPrice: 320,
    categorySlug: 'baby-clothing',
    imageUrl: 'https://picsum.photos/id/1068/600/800',
    images: [
      { imageUrl: 'https://picsum.photos/id/1068/600/800' },
      { imageUrl: 'https://picsum.photos/id/1025/600/800' },
    ],
    rating: 5,
    soldCount: 19,
    sizes: ['S'],
    description: 'Soft baby booties handcrafted with pure cotton yarn.',
  },
  {
    title: 'Summer Tote Bag',
    slug: 'summer-tote-bag',
    price: 650,
    originalPrice: 800,
    categorySlug: 'summer-collection',
    imageUrl: 'https://picsum.photos/id/1040/600/800',
    images: [
      { imageUrl: 'https://picsum.photos/id/1040/600/800' },
      { imageUrl: 'https://picsum.photos/id/1062/600/800' },
    ],
    rating: 5,
    soldCount: 35,
    sizes: ['M', 'L'],
    description: 'Spacious knitted summer tote bag for beach outings.',
  },
  {
    title: 'Men Crochet Cardigan',
    slug: 'men-crochet-cardigan',
    price: 1800,
    originalPrice: 2200,
    categorySlug: 'men',
    imageUrl: 'https://picsum.photos/id/1005/600/800',
    images: [
      { imageUrl: 'https://picsum.photos/id/1005/600/800' },
      { imageUrl: 'https://picsum.photos/id/1069/600/800' },
    ],
    rating: 5,
    soldCount: 9,
    sizes: ['M', 'L', 'XL', 'XXL'],
    description: 'Premium handcrafted crochet cardigan for men.',
  },
]

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const page = parseInt(searchParams.get('page') || '1', 10)
    const limit = parseInt(searchParams.get('limit') || '8', 10)
    const search = searchParams.get('search') || ''
    const categoryParam = searchParams.get('category') || searchParams.get('tag') || ''

    const payload = await getPayload({ config })

    const whereClause: Where = {}

    if (search.trim()) {
      whereClause.title = {
        like: search.trim(),
      }
    }

    if (categoryParam && categoryParam !== 'All') {
      // Find category matching slug, name, or id
      const catRes = await payload.find({
        collection: 'categories',
        where: {
          or: [
            { slug: { equals: categoryParam } },
            { name: { equals: categoryParam } },
            { id: { equals: categoryParam } },
          ],
        },
      })

      if (catRes.docs.length > 0) {
        whereClause.category = {
          equals: catRes.docs[0].id,
        }
      } else {
        // Fallback filter
        whereClause.category = {
          equals: categoryParam,
        }
      }
    }

    let result = await payload.find({
      collection: 'products',
      where: Object.keys(whereClause).length > 0 ? whereClause : undefined,
      depth: 2,
      page,
      limit,
    })

    if (result.totalDocs === 0 && !search && (!categoryParam || categoryParam === 'All') && page === 1) {
      // Fetch categories to link relationships
      const catDocsRes = await payload.find({
        collection: 'categories',
        limit: 100,
      })

      const catMap: Record<string, string> = {}
      catDocsRes.docs.forEach((c) => {
        catMap[c.slug] = c.id
        catMap[c.name.toLowerCase()] = c.id
      })

      for (const item of initialProductsData) {
        const { categorySlug, ...prodData } = item
        const categoryId = catMap[categorySlug] || catDocsRes.docs[0]?.id

        await payload.create({
          collection: 'products',
          data: {
            ...prodData,
            category: categoryId,
          },
        })
      }

      result = await payload.find({
        collection: 'products',
        depth: 2,
        page,
        limit,
      })
    }

    return NextResponse.json(result)
  } catch (error) {
    console.error('Fetch products error:', error)
    return NextResponse.json({ success: false, error: (error as Error).message }, { status: 500 })
  }
}
