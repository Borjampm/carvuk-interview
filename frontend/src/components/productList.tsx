import { useEffect, useState } from 'react'
import { supabase } from '../supabaseClient'
import type { Product } from '../types'

export default function ProductList() {
    const [products, setProducts] = useState<Product[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        async function fetchProducts() {
            try {
                setLoading(true)
                const { data, error } = await supabase
                    .from('products')
                    .select('*')
                    .order('id', { ascending: true })

                if (error) throw error

                setProducts(data || [])
            } catch (err) {
                console.error('Error fetching products:', err)
                setError(err instanceof Error ? err.message : 'Failed to fetch products')
            } finally {
                setLoading(false)
            }
        }

        fetchProducts()
    }, [])

    if (loading) {
        return <div className="flex justify-center p-8">Loading products...</div>
    }

    if (error) {
        return <div className="flex justify-center p-8 text-red-500">Error: {error}</div>
    }

    return (
        <div className="flex flex-col h-full gap-8">
            <h1 className="m-0">Products</h1>
            <div className="flex-1 overflow-auto">
                <table className="w-full border-collapse">
                    <thead>
                        <tr className="border-b">
                            <th className="text-left p-4 font-semibold">ID</th>
                            <th className="text-left p-4 font-semibold">Name</th>
                            <th className="text-left p-4 font-semibold">Price</th>
                        </tr>
                    </thead>
                    <tbody>
                        {products.length === 0 ? (
                            <tr>
                                <td colSpan={3} className="p-4 text-center text-gray-500">
                                    No products found
                                </td>
                            </tr>
                        ) : (
                            products.map(product => (
                                <tr key={product.id} className="border-b hover:bg-gray-100 dark:hover:bg-gray-800">
                                    <td className="p-4">{product.id}</td>
                                    <td className="p-4">{product.name}</td>
                                    <td className="p-4">${product.price.toFixed(2)}</td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    )
}

