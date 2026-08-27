import { Button, TabItem, Tabs } from 'flowbite-react';
import ProductSlider from '../../components/ProductSlider';
import ProductDetailTabs from '../../components/ProductDetailTabs';
import SizeSelector from '../../components/SizeSelector';
import CheckoutForm from './CheckoutForm';

interface ProductProps {
  params: Promise<{ slug: string }>
}

const Product = async ({ params }: ProductProps) => {


  return (<>
    <div className='max-w-7xl p-4'>
      <div className='h-90'>
        <ProductSlider />
      </div>
      <div className='flex items-center justify-end mt-2'>
        {/* <Button color="alternative" className='default border-none rounded-lg p-2 md:p-4 text-xl cursor-pointer'>
          <svg className='w-8 h-8 text-primary-800'  viewBox="0 0 14 16" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12.2588 15.0001L0.999531 7.75874L12.2588 1.00012" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </Button> */}
        <Button color="alternative" className='default border-none rounded-lg p-2 md:p-4 text-xl cursor-pointer'>
          <svg className='w-8 h-8 text-primary-800' viewBox="0 0 27 20" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path fillRule="evenodd" clipRule="evenodd" d="M17.4895 17.0195L25.5003 10.2497C25.8166 9.9892 26 9.59922 26 9.18745C26 8.77568 25.8166 8.38588 25.5003 8.12517L17.4895 1.35547C17.0622 0.987219 16.4642 0.896926 15.9486 1.1229C15.4331 1.34888 15.0906 1.85153 15.0663 2.41774V5.08784C3.81968 3.12353 1 13.2709 1 19C3.60897 14.6357 10.3698 6.72441 15.0663 13.2709V15.9482C15.0873 16.5161 15.4286 17.0218 15.9447 17.2499C16.4609 17.4781 17.0609 17.3886 17.4895 17.0195Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </Button>
      </div>
      <div className='mt-3 text-primary-800'>
        <h1 className='text-4xl'>Shoes</h1>
        <div className='flex gap-2 items-center justify-between'>
          <span className='text-2xl'>$120
            <span className='text-xl line-through text-gray-500 ml-2'>$180</span>
          </span>
          <span className='text-2xl justify-self-end'>8 Sold</span>
        </div>
      </div>
      <CheckoutForm />
    </div>
  </>)
}

export default Product