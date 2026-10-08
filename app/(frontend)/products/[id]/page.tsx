import ProductSlider from '../../components/ProductSlider';
import CheckoutForm from './CheckoutForm';
import { getPayload } from 'payload';
import config from '@payload-config';
import { ProductItem } from '../../context/CartContext';
import { formatProduct } from '@app/utils/product';
import ShareButton from '../../components/ShareButton';

interface ProductProps {
  params: Promise<{ id: string }>
}

const Product = async ({ params }: ProductProps) => {
  const { id } = await params;
  let product: ProductItem = {
    id,
    title: 'Crochet Item',
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
    const res = await payload.findByID({
      collection: 'products',
      id,
      depth: 2,
    });

    if (res) {
      product = formatProduct(res);
    }
  } catch (err) {
    console.error('Error fetching product details by id:', err);
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
          <div className='flex items-center gap-4'>
            <div className="flex items-center gap-1">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                aria-hidden="true"
                className="w-6 h-6 text-amber-400"
              >
                <path
                  fillRule="evenodd"
                  d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.006 5.404.434c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.434 2.082-5.005Z"
                  clipRule="evenodd"
                />
              </svg>
              <span className="text-primary-800 text-lg font-bold">{product.rating ?? 5}/5</span>
            </div>
            <span className='text-xl sm:text-2xl text-gray-600 font-medium'>{product.soldCount ?? 0} Sold</span>
          </div>
        </div>
      </div>
      <CheckoutForm product={product} />
    </div>
  )
}

export default Product