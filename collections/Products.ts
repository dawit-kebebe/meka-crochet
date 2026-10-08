import type { CollectionConfig } from 'payload'

export const Products: CollectionConfig = {
  slug: 'products',
  admin: {
    useAsTitle: 'title',
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: 'General',
          fields: [
            {
              name: 'title',
              type: 'text',
              required: true,
            },
            {
              name: 'description',
              type: 'textarea',
            },
            {
              name: 'price',
              type: 'number',
              required: true,
            },
            {
              name: 'originalPrice',
              type: 'number',
            },
            {
              name: 'category',
              type: 'relationship',
              relationTo: 'categories',
              hasMany: false,
            },
          ],
        },
        {
          label: 'Media',
          fields: [
            {
              name: 'image',
              type: 'upload',
              relationTo: 'media',
            },
            {
              name: 'imageUrl',
              type: 'text',
              defaultValue: 'https://picsum.photos/600/800',
              admin: {
                description: 'Fallback image URL if no upload is provided.',
              },
            },
            {
              name: 'images',
              type: 'array',
              fields: [
                {
                  name: 'image',
                  type: 'upload',
                  relationTo: 'media',
                },
                {
                  name: 'imageUrl',
                  type: 'text',
                },
              ],
            },
          ],
        },
        {
          label: 'Inventory & Variations',
          fields: [
            {
              name: 'sizes',
              type: 'select',
              hasMany: true,
              options: ['S', 'M', 'L', 'XL', 'XXL'],
              defaultValue: ['S', 'M', 'L', 'XL'],
            },
            {
              name: 'inStock',
              type: 'checkbox',
              defaultValue: true,
            },
          ],
        },
        {
          label: 'Metrics',
          fields: [
            {
              name: 'rating',
              type: 'number',
              defaultValue: 5,
              admin: {
                readOnly: true,
              },
            },
            {
              name: 'soldCount',
              type: 'number',
              defaultValue: 0,
              admin: {
                readOnly: true,
              },
            },
          ],
        },
      ],
    },
  ],
}
