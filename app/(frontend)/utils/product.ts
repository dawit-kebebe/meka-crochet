import { Product } from '@/payload-types'
import { ProductItem } from '@app/context/CartContext'

export function formatProduct(doc: Product): ProductItem {
  const gallery: string[] = Array.isArray(doc.images)
    ? doc.images
        .map((imgObj) => {
          if (imgObj.imageUrl) return imgObj.imageUrl
          if (typeof imgObj.image === 'object' && imgObj.image?.url) return imgObj.image.url
          return null
        })
        .filter((url): url is string => Boolean(url))
    : []

  const mainImage =
    doc.imageUrl ||
    (typeof doc.image === 'object' && doc.image?.url
      ? doc.image.url
      : 'https://picsum.photos/600/800')

  const categoryName =
    typeof doc.category === 'object' && doc.category !== null
      ? doc.category.name
      : (doc.category ?? undefined)

  return {
    id: doc.id,
    title: doc.title,
    price: doc.price,
    originalPrice: doc.originalPrice ?? undefined,
    category: categoryName,
    imageUrl: mainImage,
    images: gallery.length > 0 ? gallery : [mainImage],
    rating: doc.rating ?? undefined,
    soldCount: doc.soldCount ?? undefined,
    description: doc.description ?? undefined,
    sizes: doc.sizes ? (doc.sizes as string[]) : undefined,
  }
}
