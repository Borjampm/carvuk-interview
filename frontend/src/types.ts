export type Product = {
    id: number;
    name: string;
    price: number;
}

export type Receipt = {
    id: number;
    is_completed: boolean;
    tax_percentage: number;
    sii_code?: string;
    pdf_link?: string;
}

export type ProductsInReceipt = {
    product_id: number;
    receipt_id: number;
    quantity: number;
}