import type { CollectionConfig } from 'payload'

export const TelegramUsers: CollectionConfig = {
  slug: 'telegram-users',
  admin: {
    useAsTitle: 'username',
  },
  access: {
    read: () => true,
    create: () => true,
    update: () => true,
  },
  fields: [
    {
      name: 'telegramId',
      type: 'text',
      required: true,
      unique: true,
      index: true,
    },
    {
      name: 'firstName',
      type: 'text',
    },
    {
      name: 'lastName',
      type: 'text',
    },
    {
      name: 'username',
      type: 'text',
    },
    {
      name: 'photoUrl',
      type: 'text',
    },
    {
      name: 'authDate',
      type: 'number',
    },
    {
      name: 'phone',
      type: 'text',
    },
    {
      name: 'lastLoginAt',
      type: 'date',
    },
  ],
}
