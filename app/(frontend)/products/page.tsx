import type { ProductParams } from '@app/types/ProductSearchParams';
import TaggedProductsGrid from '@app/components/TaggedProductsGrid';

interface ProductsProps {
    searchParams: Promise<ProductParams>
}

const Products = async ({searchParams}: ProductsProps) => {
    const queries = await searchParams;
    console.log(queries);

  return (
    <TaggedProductsGrid />
  )
}

export default Products