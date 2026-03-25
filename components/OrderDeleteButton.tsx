'use client'

import { useState } from 'react'
import { deleteOrder } from '@/app/admin/order-actions'

export default function OrderDeleteButton({ orderId }: { orderId: string }) {
  const [isDeleting, setIsDeleting] = useState(false)

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this order? This cannot be undone.')) return
    
    setIsDeleting(true)
    const result = await deleteOrder(orderId)
    if (!result.success) {
      alert('Error: ' + result.error)
      setIsDeleting(false)
    }
  }

  return (
    <button
      onClick={handleDelete}
      disabled={isDeleting}
      className="text-[10px] uppercase tracking-widest text-red-500 hover:text-red-700 font-bold transition-colors disabled:opacity-50"
    >
      {isDeleting ? 'Deleting...' : 'Delete Order'}
    </button>
  )
}
