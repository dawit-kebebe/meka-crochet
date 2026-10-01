import type { CollectionConfig } from 'payload'

export const Ads: CollectionConfig = {
  slug: 'ads',
  admin: {
    useAsTitle: 'title',
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
    },
    {
      name: 'subtitle',
      type: 'text',
    },
    {
      name: 'badge',
      type: 'text',
    },
    {
      name: 'image',
      type: 'upload',
      relationTo: 'media',
    },
    {
      name: 'imageUrl',
      type: 'text',
    },
    {
      name: 'link',
      type: 'text',
      defaultValue: '/products',
    },
    {
      name: 'buttonText',
      type: 'text',
      defaultValue: 'Shop Now',
    },
    {
      name: 'active',
      type: 'checkbox',
      defaultValue: true,
    },
    {
      name: 'order',
      type: 'number',
      defaultValue: 1,
    },
  ],
}
