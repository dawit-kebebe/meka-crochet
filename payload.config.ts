import { mongooseAdapter } from '@payloadcms/db-mongodb'
// import { payloadCloudPlugin } from '@payloadcms/payload-cloud'
// import { cloudinaryStorage } from 'payload-cloudinary'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import path from 'path'
import { buildConfig } from 'payload'
import sharp from 'sharp'
import { fileURLToPath } from 'url'

import { Products } from './collections/Products'
import { Categories } from './collections/Categories'
import { Ads } from './collections/Ads'
import { TelegramUsers } from './collections/TelegramUsers'
import { Orders } from './collections/Orders'
import { Media } from './collections/Media'
import { Reviews } from './collections/Reviews'
import { revalidatePath } from 'next/cache'


const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export default buildConfig({
	admin: {
		importMap: {
			baseDir: path.resolve(dirname),
		},
		meta: {
			icons: [
				{
					rel: 'icon',
					type: 'image/x-icon',
					url: './app/favicon.ico',
				},
			],
		},
	},
	onInit: async (payload) => {
		Object.values(payload.collections).forEach((collection) => {
			const originalAfterChange = collection.config.hooks?.afterChange || []

			collection.config.hooks = {
				...collection.config.hooks,
				afterChange: [
					...originalAfterChange,
					async () => {
						try {
							revalidatePath('/', 'layout');
						} catch (error) { console.error('Error revalidating path:', error); }
					}
				]
			}
		})
	},
	collections: [Products, Categories, Ads, TelegramUsers, Orders, Media, Reviews],
	globals: [],
	editor: lexicalEditor(),
	secret: process.env.PAYLOAD_SECRET || 'meka_crochet_payload_secret_key_2026',
	typescript: {
		outputFile: path.resolve(dirname, 'payload-types.ts'),
	},
	db: mongooseAdapter({
		url: process.env.DATABASE_URI || 'mongodb://127.0.0.1:27017/meka-crochet',
	}),
	sharp,
	plugins: [
		// payloadCloudPlugin(),
		// cloudinaryStorage({
		// 	config: {
		// 		cloud_name: process.env.CLOUDINARY_CLOUD_NAME || '',
		// 		api_key: process.env.CLOUDINARY_API_KEY || '',
		// 		api_secret: process.env.CLOUDINARY_API_SECRET || '',
		// 	},
		// 	collections: {
		// 		media: {
		// 			// ✅ This forces the 'url' field to be the Cloudinary CDN link
		// 			disablePayloadAccessControl: true,
		// 		},
		// 	},
		// 	folder: 'payload-media',
		// 	publicID: {
		// 		enabled: true,
		// 		useFilename: true,
		// 		uniqueFilename: true, // This adds the "long number" suffix you like
		// 	},
		// }),
		// storage-adapter-placeholder
	],
})
