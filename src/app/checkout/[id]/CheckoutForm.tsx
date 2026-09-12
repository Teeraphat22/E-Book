'use client';

import { useState } from 'react';
import Image from 'next/image';
import { formatCurrency } from '@/lib/utils';
import { createOrder } from './actions';
import { Loader2 } from 'lucide-react';

export default function CheckoutForm({ book }: { book: any }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const formData = new FormData(e.currentTarget);
    const result = await createOrder(formData);
    
    if (result?.error) {
      setError(result.error);
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <input type="hidden" name="bookId" value={book.id} />
      <input type="hidden" name="price" value={book.price} />

      <div className="flex gap-4 p-4 bg-gray-50 rounded-lg border border-gray-100">
        <div className="relative w-16 h-24 flex-shrink-0">
          <Image src={book.cover_url} alt={book.title} fill className="object-cover rounded" />
        </div>
        <div className="flex flex-col justify-center">
          <p className="font-semibold text-gray-900">{book.title}</p>
          <p className="text-indigo-600 font-bold mt-1">{formatCurrency(book.price)}</p>
        </div>
      </div>

      {error && (
        <div className="p-3 bg-red-50 text-red-600 text-sm rounded-lg border border-red-100">
          {error}
        </div>
      )}

      <div className="space-y-4">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
            ชื่อ-นามสกุล <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="name"
            name="name"
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-colors"
            placeholder="เช่น สมชาย ใจดี"
          />
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
            อีเมล <span className="text-red-500">*</span>
          </label>
          <input
            type="email"
            id="email"
            name="email"
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-colors"
            placeholder="เช่น somchai@example.com"
          />
          <p className="text-xs text-gray-500 mt-1">เราจะส่งลิงก์ดาวน์โหลดหนังสือไปยังอีเมลนี้</p>
        </div>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 px-4 rounded-xl transition-colors disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center"
      >
        {loading ? (
          <>
            <Loader2 className="w-5 h-5 mr-2 animate-spin" />
            กำลังดำเนินการ...
          </>
        ) : (
          'ยืนยันคำสั่งซื้อ'
        )}
      </button>
    </form>
  );
}
