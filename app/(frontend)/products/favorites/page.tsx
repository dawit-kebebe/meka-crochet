import ProductListing from "@app/components/blocks/ProductListing"
import SectionTitle from '@app/components/SectionTitle';

const FavoriteProducts = async () => {
    

  return (
    <div className='max-w-7xl w-full px-4'>
        <SectionTitle>Your Favorites</SectionTitle>
        <ProductListing
          emptyTitle="No Favorites Yet"
          emptyDescription="You haven't added any products to your favorites yet. Explore our collection and add your favorite items!"
        />
    </div>
    
  )
}

export default FavoriteProducts