import type { CollectionConfig } from 'payload'

export const Reviews: CollectionConfig = {
  slug: 'reviews',
  admin: {
    useAsTitle: 'author',
    defaultColumns: ['author', 'user', 'product', 'rating', 'createdAt'],
  },
  access: {
    read: () => true,
    create: () => true,
    update: ({ req: { user } }) => Boolean(user),
    delete: ({ req: { user } }) => Boolean(user),
  },
  hooks: {
    afterChange: [
      async ({ doc, req }) => {
        try {
          const productId =
            typeof doc.product === 'object' && doc.product !== null
              ? doc.product.id
              : doc.product

          if (!productId) return

          // Query all reviews for this product
          const reviews = await req.payload.find({
            collection: 'reviews',
            where: {
              product: {
                equals: productId,
              },
            },
            pagination: false,
            depth: 0,
            overrideAccess: true,
          })

          if (reviews.docs && reviews.docs.length > 0) {
            const sum = reviews.docs.reduce((acc, r) => acc + (Number(r.rating) || 0), 0)
            const average = Math.round((sum / reviews.docs.length) * 10) / 10

            await req.payload.update({
              collection: 'products',
              id: productId,
              data: {
                rating: average,
              },
              depth: 0,
              overrideAccess: true,
            })
          }
        } catch (error) {
          req.payload.logger.error(`Error calculating product rating after review change: ${error}`)
        }
      },
    ],
    afterDelete: [
      async ({ doc, req }) => {
        try {
          const productId =
            typeof doc.product === 'object' && doc.product !== null
              ? doc.product.id
              : doc.product

          if (!productId) return

          const reviews = await req.payload.find({
            collection: 'reviews',
            where: {
              product: {
                equals: productId,
              },
            },
            pagination: false,
            depth: 0,
            overrideAccess: true,
          })

          const count = reviews.docs?.length || 0
          const average =
            count > 0
              ? Math.round(
                  (reviews.docs.reduce((acc, r) => acc + (Number(r.rating) || 0), 0) / count) *
                    10
                ) / 10
              : 5

          await req.payload.update({
            collection: 'products',
            id: productId,
            data: {
              rating: average,
            },
            depth: 0,
            overrideAccess: true,
          })
        } catch (error) {
          req.payload.logger.error(`Error calculating product rating after review delete: ${error}`)
        }
      },
    ],
  },
  fields: [
    {
      name: 'product',
      type: 'relationship',
      relationTo: 'products',
      required: true,
      index: true,
    },
    {
      name: 'user',
      type: 'relationship',
      relationTo: 'telegram-users',
      index: true,
      admin: {
        description: 'Linked Telegram user account who submitted the review',
      },
    },
    {
      name: 'telegramId',
      type: 'text',
      index: true,
      admin: {
        description: 'Telegram ID of reviewer',
      },
    },
    {
      name: 'author',
      type: 'text',
      required: true,
    },
    {
      name: 'rating',
      type: 'number',
      required: true,
      min: 1,
      max: 5,
    },
    {
      name: 'comment',
      type: 'textarea',
      required: true,
    },
  ],
}
