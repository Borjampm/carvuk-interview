import { useEffect, useState } from 'react'
import { supabase } from '../supabaseClient'
import type { Receipt, Product, ProductsInReceipt } from '../types'

type ReceiptDetailProps = {
    receiptId: number
    onClose: () => void
}

type ProductInReceiptWithDetails = ProductsInReceipt & {
    product: Product
}

export default function ReceiptDetail({ receiptId, onClose }: ReceiptDetailProps) {
    const [receipt, setReceipt] = useState<Receipt | null>(null)
    const [products, setProducts] = useState<ProductInReceiptWithDetails[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        async function fetchReceiptDetails() {
            try {
                setLoading(true)

                // Fetch the receipt
                const { data: receiptData, error: receiptError } = await supabase
                    .from('receipts')
                    .select('*')
                    .eq('id', receiptId)
                    .single()

                if (receiptError) throw receiptError

                setReceipt(receiptData)

                // Fetch products in this receipt
                const { data: productsInReceiptData, error: productsInReceiptError } = await supabase
                    .from('products_in_receipt')
                    .select('*')
                    .eq('receipt_id', receiptId)

                if (productsInReceiptError) throw productsInReceiptError

                // Fetch all products details
                const productIds = productsInReceiptData.map(pir => pir.product_id)
                const { data: productsData, error: productsError } = await supabase
                    .from('products')
                    .select('*')
                    .in('id', productIds)

                if (productsError) throw productsError

                // Combine the data
                const productsMap = new Map(productsData.map(p => [p.id, p]))
                const productsWithDetails = productsInReceiptData.map(pir => ({
                    ...pir,
                    product: productsMap.get(pir.product_id)!
                }))

                setProducts(productsWithDetails)
            } catch (err) {
                console.error('Error fetching receipt details:', err)
                setError(err instanceof Error ? err.message : 'Failed to fetch receipt details')
            } finally {
                setLoading(false)
            }
        }

        fetchReceiptDetails()
    }, [receiptId])

    if (loading) {
        return (
            <div className="flex justify-center p-8">
                <div>Loading receipt details...</div>
            </div>
        )
    }

    if (error || !receipt) {
        return (
            <div className="flex flex-col gap-4 p-8">
                <div className="text-red-500">Error: {error || 'Receipt not found'}</div>
                <button
                    onClick={onClose}
                    className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 transition-colors"
                >
                    Close
                </button>
            </div>
        )
    }

    const subtotal = products.reduce((sum, item) => {
        return sum + (item.product.price * item.quantity)
    }, 0)

    const taxAmount = (subtotal * receipt.tax_percentage) / 100
    const total = subtotal + taxAmount

    return (
        <div className="flex flex-col h-full gap-6 p-6">
            <div className="flex justify-between items-center">
                <h1 className="m-0">Receipt #{receipt.id}</h1>
                <button
                    onClick={onClose}
                    className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 transition-colors"
                >
                    Close
                </button>
            </div>

            <div className="flex-1 overflow-auto">
                {products.length === 0 ? (
                    <div className="p-8 text-center text-gray-500">
                        No products in this receipt
                    </div>
                ) : (
                    <table className="w-full border-collapse">
                        <thead>
                            <tr className="border-b">
                                <th className="text-left p-4 font-semibold">Product</th>
                                <th className="text-right p-4 font-semibold">Price</th>
                                <th className="text-right p-4 font-semibold">Quantity</th>
                                <th className="text-right p-4 font-semibold">Subtotal</th>
                            </tr>
                        </thead>
                        <tbody>
                            {products.map((item) => (
                                <tr key={item.product_id} className="border-b">
                                    <td className="p-4">{item.product.name}</td>
                                    <td className="p-4 text-right">${item.product.price.toFixed(0)}</td>
                                    <td className="p-4 text-right">{item.quantity}</td>
                                    <td className="p-4 text-right">${(item.product.price * item.quantity).toFixed(0)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>

            <div className="border-t pt-4">
                <div className="flex justify-between items-center mb-2">
                    <span className="text-lg">Brute value:</span>
                    <span className="text-lg">${subtotal.toFixed(0)}</span>
                </div>
                <div className="flex justify-between items-center mb-2">
                    <span className="text-lg">Tax ({receipt.tax_percentage}%):</span>
                    <span className="text-lg">${taxAmount.toFixed(0)}</span>
                </div>
                <div className="flex justify-between items-center border-t pt-2">
                    <span className="text-2xl font-bold">Net value:</span>
                    <span className="text-2xl font-bold">${total.toFixed(0)}</span>
                </div>
            </div>
        </div>
    )
}

