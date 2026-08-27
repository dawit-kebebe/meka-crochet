import ProductListing from '@app/components/blocks/ProductListing';
import SearchForm from '@app/components/blocks/SearchForm';
import type { ProductSearchParams } from '@app/types/ProductSearchParams';

interface ProductSearchProps {
  searchParams: Promise<ProductSearchParams>
}

const ProductSearch = async ({ searchParams }: ProductSearchProps) => {
  const parameter = await searchParams;
  return (
    <div className='max-w-7xl w-full px-4'>
      <SearchForm />
      <ProductListing />
    </div>
  )
}

export default ProductSearch