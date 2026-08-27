import CheckoutProductCard from '@app/components/CheckoutProductCard'
import SectionTitle from '@app/components/SectionTitle'
import CheckoutModals from './CheckoutModals'

const Cart = async () => {
  return (
    <div className='max-w-7xl w-full px-4'>
      <SectionTitle>Your Cart</SectionTitle>
      <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-8'>
        <CheckoutProductCard />
        <CheckoutProductCard />
        <CheckoutProductCard />
      </div>
      <CheckoutModals />
    </div>
  )
}

export default Cart