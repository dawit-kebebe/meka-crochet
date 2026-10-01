import ProductSlider from '../../components/ProductSlider';
import CheckoutForm from './CheckoutForm';
import { getPayload } from 'payload';
import config from '@payload-config';
import { ProductItem } from '../../context/CartContext';
import { formatProduct } from '@app/utils/product';
import ShareButton from '../../components/ShareButton';

interface ProductProps {
  params: Promise<{ slug: string }>
}

const Product = async ({ params }: ProductProps) => {
  const { slug } = await params;
  let product: ProductItem = {
    title: 'Crochet Item',
    slug,
    price: 450,
    originalPrice: 600,
    soldCount: 8,
    description: 'Handcrafted premium crochet item made with care.',
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    imageUrl: 'https://picsum.photos/600/800',
    images: ['https://picsum.photos/600/800', 'https://picsum.photos/600/801'],
  };

  try {
    const payload = await getPayload({ config });
    const res = await payload.find({
      collection: 'products',
      where: {
        slug: {
          equals: slug,
        },
      },
      depth: 2,
    });

    if (res.docs.length > 0) {
      product = formatProduct(res.docs[0]);
    }
  } catch (err) {
    console.error('Error fetching product details by slug:', err);
  }

  const productImages = product.images && product.images.length > 0
    ? product.images
    : [product.imageUrl || 'https://picsum.photos/600/800'];

  return (
    <div className='max-w-7xl w-full p-4 mb-20 mx-auto'>
      <div className='w-full'>
        <ProductSlider images={productImages} title={product.title} />
      </div>
      <div className='flex items-center justify-end mt-2'>
        <ShareButton />
      </div>
      <div className='mt-3 text-primary-800'>
        <h1 className='text-3xl sm:text-4xl font-bold'>{product.title}</h1>
        <div className='flex gap-2 items-center justify-between mt-2'>
          <span className='text-2xl font-bold'>Br {product.price}
            {product.originalPrice && (
              <span className='text-xl line-through text-gray-500 ml-2'>Br {product.originalPrice}</span>
            )}
          </span>
          <span className='text-xl sm:text-2xl justify-self-end text-gray-600 font-medium'>{product.soldCount ?? 0} Sold</span>
        </div>
      </div>
      <CheckoutForm product={product} />
    </div>
  )
}

export default Product