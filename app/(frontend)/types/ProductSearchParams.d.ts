export type ProductSearchParams = {
    category?: string;
    s?: string;
}

export type ProductParams = Omit<ProductSearchParams, 's'>;