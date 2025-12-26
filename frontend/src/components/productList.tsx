import { useEffect, useState } from 'react'
import { supabase } from '../supabaseClient'
import type { Product, ProductsInReceipt } from '../types'

export default function ProductList() {
    const [products, setProducts] = useState<Product[]>([])
    const [productsInReceipt, setProductsInReceipt] = useState<ProductsInReceipt[]>([])
    const [receiptId, setReceiptId] = useState<number | null>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        async function initialize() {
            try {
                setLoading(true)
                
                // Fetch products
                const { data: productsData, error: productsError } = await supabase
                    .from('products')
                    .select('*')
                    .order('id', { ascending: true })

                if (productsError) throw productsError
                setProducts(productsData || [])

                // Create or get a draft receipt
                const { data: receiptData, error: receiptError } = await supabase
                    .from('receipts')
                    .insert({})
                    .select()
                    .single()

                if (receiptError) throw receiptError
                setReceiptId(receiptData.id)

                // Fetch products in receipt
                await fetchCartItems(receiptData.id)
            } catch (err) {
                console.error('Error initializing:', err)
                setError(err instanceof Error ? err.message : 'Failed to initialize')
            } finally {
                setLoading(false)
            }
        }

        initialize()
    }, [])

    async function fetchCartItems(currentReceiptId: number) {
        try {
            const { data, error } = await supabase
                .from('products_in_receipt')
                .select('*')
                .eq('receipt_id', currentReceiptId)

            if (error) throw error
            setProductsInReceipt(data || [])
        } catch (err) {
            console.error('Error fetching cart items:', err)
        }
    }

    async function addToCart(productId: number) {
        if (!receiptId) return

        try {
            // Check if product already in cart
            const existing = productsInReceipt.find(p => p.product_id === productId)
            
            if (existing) {
                // Update quantity
                const { error } = await supabase
                    .from('products_in_receipt')
                    .update({ quantity: existing.quantity + 1 })
                    .eq('product_id', productId)
                    .eq('receipt_id', receiptId)

                if (error) throw error
            } else {
                // Insert new item
                const { error } = await supabase
                    .from('products_in_receipt')
                    .insert({
                        product_id: productId,
                        receipt_id: receiptId,
                        quantity: 1
                    })

                if (error) throw error
            }

            await fetchCartItems(receiptId)
        } catch (err) {
            console.error('Error adding to cart:', err)
            alert('Failed to add product to cart')
        }
    }

    async function removeFromCart(productId: number) {
        if (!receiptId) return

        try {
            const { error } = await supabase
                .from('products_in_receipt')
                .delete()
                .eq('product_id', productId)
                .eq('receipt_id', receiptId)

            if (error) throw error

            await fetchCartItems(receiptId)
        } catch (err) {
            console.error('Error removing from cart:', err)
            alert('Failed to remove product from cart')
        }
    }

    function getProductById(productId: number): Product | undefined {
        return products.find(p => p.id === productId)
    }

    function calculateTotal(): number {
        return productsInReceipt.reduce((sum, item) => {
            const product = getProductById(item.product_id)
            return sum + (product ? product.price * item.quantity : 0)
        }, 0)
    }

    if (loading) {
        return <div className="flex justify-center p-8">Loading products...</div>
    }

    if (error) {
        return <div className="flex justify-center p-8 text-red-500">Error: {error}</div>
    }

    return (
        <div className="flex flex-col lg:flex-row h-full gap-8">
            {/* Products Section */}
            <div className="flex-1 flex flex-col gap-4">
                <h1 className="m-0">Products</h1>
                <div className="flex-1 overflow-auto">
                    <table className="w-full border-collapse">
                        <thead>
                            <tr className="border-b">
                                <th className="text-left p-4 font-semibold">ID</th>
                                <th className="text-left p-4 font-semibold">Name</th>
                                <th className="text-left p-4 font-semibold">Price</th>
                                <th className="text-left p-4 font-semibold">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {products.length === 0 ? (
                                <tr>
                                    <td colSpan={4} className="p-4 text-center text-gray-500">
                                        No products found
                                    </td>
                                </tr>
                            ) : (
                                products.map(product => (
                                    <tr key={product.id} className="border-b hover:bg-gray-100 dark:hover:bg-gray-800">
                                        <td className="p-4">{product.id}</td>
                                        <td className="p-4">{product.name}</td>
                                        <td className="p-4">${product.price.toFixed(0)}</td>
                                        <td className="p-4">
                                            <button
                                                onClick={() => addToCart(product.id)}
                                                className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
                                            >
                                                Add to Cart
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Cart Section */}
            <div className="flex-1 flex flex-col gap-4">
                <h2 className="m-0">Cart (Receipt #{receiptId})</h2>
                <div className="flex-1 overflow-auto">
                    {productsInReceipt.length === 0 ? (
                        <div className="p-4 text-center text-gray-500">
                            Cart is empty. Add products to get started!
                        </div>
                    ) : (
                        <table className="w-full border-collapse">
                            <thead>
                                <tr className="border-b">
                                    <th className="text-left p-4 font-semibold">Product</th>
                                    <th className="text-left p-4 font-semibold">Qty</th>
                                    <th className="text-left p-4 font-semibold">Price</th>
                                    <th className="text-left p-4 font-semibold">Total</th>
                                    <th className="text-left p-4 font-semibold">Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {productsInReceipt.map(item => {
                                    const product = getProductById(item.product_id)
                                    if (!product) return null
                                    
                                    return (
                                        <tr key={item.product_id} className="border-b hover:bg-gray-100 dark:hover:bg-gray-800">
                                            <td className="p-4">{product.name}</td>
                                            <td className="p-4">{item.quantity}</td>
                                            <td className="p-4">${product.price.toFixed(0)}</td>
                                            <td className="p-4">${(product.price * item.quantity).toFixed(0)}</td>
                                            <td className="p-4">
                                                <button
                                                    onClick={() => removeFromCart(item.product_id)}
                                                    className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
                                                >
                                                    Remove
                                                </button>
                                            </td>
                                        </tr>
                                    )
                                })}
                            </tbody>
                            <tfoot>
                                <tr className="border-t-2 font-semibold">
                                    <td colSpan={3} className="p-4 text-right">Total:</td>
                                    <td className="p-4">${calculateTotal().toFixed(0)}</td>
                                    <td className="p-4"></td>
                                </tr>
                            </tfoot>
                        </table>
                    )}
                </div>
            </div>
        </div>
    )
}

