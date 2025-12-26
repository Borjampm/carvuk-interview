import { useEffect, useState } from 'react'
import { supabase } from '../supabaseClient'
import type { Receipt } from '../types'

export default function ReceiptsList() {
    const [receipts, setReceipts] = useState<Receipt[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        async function fetchCompletedReceipts() {
            try {
                setLoading(true)

                const { data, error: receiptsError } = await supabase
                    .from('receipts')
                    .select('*')
                    .eq('is_completed', true)
                    .order('id', { ascending: false })

                if (receiptsError) throw receiptsError

                setReceipts(data || [])
            } catch (err) {
                console.error('Error fetching completed receipts:', err)
                setError(err instanceof Error ? err.message : 'Failed to fetch receipts')
            } finally {
                setLoading(false)
            }
        }

        fetchCompletedReceipts()
    }, [])

    if (loading) {
        return <div className="flex justify-center p-8">Loading receipts...</div>
    }

    if (error) {
        return <div className="flex justify-center p-8 text-red-500">Error: {error}</div>
    }

    function handleViewDetails(receiptId: number) {
        // TODO: Implement detail view
        console.log('View details for receipt:', receiptId)
    }

    return (
        <div className="flex flex-col h-full gap-8">
            <h1 className="m-0">Completed Receipts</h1>
            <div className="flex-1 overflow-auto">
                {receipts.length === 0 ? (
                    <div className="p-8 text-center text-gray-500">
                        No completed receipts found
                    </div>
                ) : (
                    <table className="w-full border-collapse">
                        <thead>
                            <tr className="border-b">
                                <th className="text-left p-4 font-semibold">Receipt ID</th>
                                <th className="text-left p-4 font-semibold">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {receipts.map((receipt) => (
                                <tr key={receipt.id} className="border-b hover:bg-gray-100 dark:hover:bg-gray-800">
                                    <td className="p-4">#{receipt.id}</td>
                                    <td className="p-4">
                                        <button
                                            onClick={() => handleViewDetails(receipt.id)}
                                            className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
                                        >
                                            View Details
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    )
}

