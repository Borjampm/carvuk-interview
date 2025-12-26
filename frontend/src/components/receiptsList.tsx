import { useEffect, useState } from 'react'
import { supabase } from '../supabaseClient'
import type { Receipt } from '../types'
import ReceiptDetail from './receiptDetail'

export default function ReceiptsList() {
    const [receipts, setReceipts] = useState<Receipt[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [selectedReceiptId, setSelectedReceiptId] = useState<number | null>(null)

    useEffect(() => {
        async function fetchReceipts() {
            try {
                setLoading(true)

                const { data, error: receiptsError } = await supabase
                    .from('receipts')
                    .select('*')
                    .in('status', ['waiting_signature', 'completed'])
                    .order('id', { ascending: false })

                if (receiptsError) throw receiptsError

                setReceipts(data || [])
            } catch (err) {
                console.error('Error fetching receipts:', err)
                setError(err instanceof Error ? err.message : 'Failed to fetch receipts')
            } finally {
                setLoading(false)
            }
        }

        fetchReceipts()
    }, [])

    if (loading) {
        return <div className="flex justify-center p-8">Loading receipts...</div>
    }

    if (error) {
        return <div className="flex justify-center p-8 text-red-500">Error: {error}</div>
    }

    // Show detail view if a receipt is selected
    if (selectedReceiptId !== null) {
        return (
            <ReceiptDetail
                receiptId={selectedReceiptId}
                onClose={() => setSelectedReceiptId(null)}
            />
        )
    }

    return (
        <div className="flex flex-col h-full gap-8">
            <h1 className="m-0">Receipts</h1>
            <div className="flex-1 overflow-auto">
                {receipts.length === 0 ? (
                    <div className="p-8 text-center text-gray-500">
                        No receipts found
                    </div>
                ) : (
                    <table className="w-full border-collapse">
                        <thead>
                            <tr className="border-b">
                                <th className="text-left p-4 font-semibold">Receipt ID</th>
                                <th className="text-left p-4 font-semibold">Status</th>
                                <th className="text-left p-4 font-semibold">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {receipts.map((receipt) => (
                                <tr key={receipt.id} className="border-b hover:bg-gray-100 dark:hover:bg-gray-800">
                                    <td className="p-4">#{receipt.id}</td>
                                    <td className="p-4">
                                        <span className={`px-2 py-1 rounded text-sm font-medium ${
                                            receipt.status === 'completed' 
                                                ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' 
                                                : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                                        }`}>
                                            {receipt.status === 'completed' ? 'Completed' : 'Waiting Signature'}
                                        </span>
                                    </td>
                                    <td className="p-4">
                                        <button
                                            onClick={() => setSelectedReceiptId(receipt.id)}
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

