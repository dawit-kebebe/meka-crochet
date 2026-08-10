import { mongooseAdapter } from '@payloadcms/db-mongodb'
// import { payloadCloudPlugin } from '@payloadcms/payload-cloud'
// import { cloudinaryStorage } from 'payload-cloudinary'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import path from 'path'
import { buildConfig } from 'payload'
import sharp from 'sharp'
import { fileURLToPath } from 'url'

// import { Authors } from './collections/Authors.ts'
// import { BlogCategories } from './collections/BlogCategories.ts'
// import { Blogs } from './collections/Blogs.ts'
// import { Media } from './collections/Media.ts'
// import { Socials } from './collections/Socials.ts'
// import { Users } from './collections/Users.ts'
// import { About } from './globals/About.ts'
// import { Header } from './globals/Header.ts'
// import { Landing } from './globals/Landing.ts'
// import { BlogPage } from './globals/Blog.ts'
// import { ImagePortfolio } from './collections/ImagePortfolio.ts'
// import { ContactUs } from './collections/ContactUs.ts'
import { revalidatePath } from 'next/cache'


const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export default buildConfig({
	admin: {
		// user: Users.slug,
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
	collections: [],
	globals: [],
	editor: lexicalEditor(),
	secret: process.env.PAYLOAD_SECRET || '',
	typescript: {
		outputFile: path.resolve(dirname, 'payload-types.ts'),
	},
	db: mongooseAdapter({
		url: process.env.DATABASE_URI || '',
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
