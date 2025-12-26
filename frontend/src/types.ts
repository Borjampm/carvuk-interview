export type Product = {
    id: number;
    name: string;
    price: number;
}

type Receipt = {
    id: number;
}

type ProductsInReceipt = {
    productId: number;
    receiptId: number;
    quantity: number;
}