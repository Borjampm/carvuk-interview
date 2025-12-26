export type Product = {
    id: number;
    name: string;
    price: number;
}

type Status = 'created' | 'waiting_signature' | 'completed';

export type Receipt = {
    id: number;
    status: Status;
    tax_percentage: number;
    sii_code?: string;
    pdf_link?: string;
}

export type ProductsInReceipt = {
    product_id: number;
    receipt_id: number;
    quantity: number;
}