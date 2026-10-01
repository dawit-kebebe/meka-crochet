import { NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'

const initialCategories = [
  { name: 'New Product', slug: 'new-products' },
  { name: 'Baby Clothing', slug: 'baby-clothing' },
  { name: 'Bag', slug: 'bag' },
  { name: 'Kids', slug: 'kids' },
  { name: 'Men', slug: 'men' },
  { name: 'Women', slug: 'women' },
  { name: 'Summer Collection', slug: 'summer-collection' },
]

export async function GET() {
  try {
    const payload = await getPayload({ config })

    let result = await payload.find({
      collection: 'categories',
      limit: 100,
      sort: 'createdAt',
    })

    if (result.totalDocs === 0) {
      // Auto seed initial dynamic categories if empty
      for (const cat of initialCategories) {
        await payload.create({
          collection: 'categories',
          data: cat,
        })
      }
      result = await payload.find({
        collection: 'categories',
        limit: 100,
        sort: 'createdAt',
      })
    }

    return NextResponse.json(result)
  } catch (error) {
    console.error('Fetch categories error:', error)
    return NextResponse.json({ success: false, error: (error as Error).message }, { status: 500 })
  }
}
