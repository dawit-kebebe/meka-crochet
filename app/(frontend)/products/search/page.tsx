import SearchClient from './SearchClient';
import type { ProductSearchParams } from '@app/types/ProductSearchParams';

interface ProductSearchProps {
  searchParams: Promise<ProductSearchParams>
}

const ProductSearch = async ({ searchParams }: ProductSearchProps) => {
  await searchParams;
  return <SearchClient />
}

export default ProductSearch