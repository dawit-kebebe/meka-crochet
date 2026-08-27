import ProductListing from "@app/components/blocks/ProductListing"
import SectionTitle from '@app/components/SectionTitle';

const FavoriteProducts = async () => {
    

  return (
    <div className='max-w-7xl w-full px-4'>
        <SectionTitle>Your Favorites</SectionTitle>
        <ProductListing />
    </div>
    
  )
}

export default FavoriteProducts