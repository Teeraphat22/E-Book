'use client';

import { useState } from 'react';
import { checkOrder } from './actions';
import { Loader2, Download, Clock, CheckCircle2 } from 'lucide-react';
import Image from 'next/image';
import { formatCurrency } from '@/lib/utils';
import Link from 'next/link';

export default function TrackForm() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [result, setResult] = useState<any>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setResult(null);

    const formData = new FormData(e.currentTarget);
    const res = await checkOrder(formData);
    
    if (res?.error) {
      setError(res.error);
    } else if (res?.success) {
      setResult(res);
    }
    
    setLoading(false);
  };

  return (
    <div className="space-y-8">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="orderCode" className="block text-sm font-medium text-gray-700 mb-1">
            หมายเลขคำสั่งซื้อ
          </label>
          <input
            type="text"
            id="orderCode"
            name="orderCode"
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-colors uppercase"
            placeholder="ORD-XXXXXX"
          />
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
            อีเมลที่ใช้สั่งซื้อ
          </label>
          <input
            type="email"
            id="email"
            name="email"
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-colors"
            placeholder="your@email.com"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 px-4 rounded-xl transition-colors disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center mt-6"
        >
          {loading ? (
            <>
              <Loader2 className="w-5 h-5 mr-2 animate-spin" />
              กำลังตรวจสอบ...
            </>
          ) : (
            'ค้นหาคำสั่งซื้อ'
          )}
        </button>
      </form>

      {error && (
        <div className="p-4 bg-red-50 text-red-600 text-sm rounded-lg border border-red-100 text-center animate-in fade-in">
          {error}
        </div>
      )}

      {result && (
        <div className="mt-8 pt-8 border-t animate-in fade-in slide-in-from-bottom-4 duration-500">
          <h3 className="text-lg font-bold text-gray-900 mb-4">รายละเอียดคำสั่งซื้อ</h3>
          
          <div className="bg-gray-50 rounded-xl p-4 flex gap-4 mb-6">
            <div className="relative w-20 h-28 flex-shrink-0">
              <Image 
                src={result.order.coverUrl} 
                alt={result.order.bookTitle} 
                fill 
                className="object-cover rounded shadow-sm" 
              />
            </div>
            <div className="flex flex-col justify-center flex-grow">
              <p className="font-semibold text-gray-900 line-clamp-2">{result.order.bookTitle}</p>
              <p className="text-sm text-gray-500 mt-1">รหัส: {result.order.orderCode}</p>
              <p className="font-bold text-indigo-600 mt-2">{formatCurrency(result.order.amount)}</p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-white border rounded-lg">
              <div className="flex items-center gap-3">
                {result.order.status === 'PAID' ? (
                  <CheckCircle2 className="w-6 h-6 text-green-500" />
                ) : (
                  <Clock className="w-6 h-6 text-yellow-500" />
                )}
                <div>
                  <p className="font-medium text-gray-900">สถานะ</p>
                  <p className="text-sm text-gray-500">
                    {result.order.status === 'PAID' ? 'ชำระเงินแล้ว' : 'รอชำระเงิน'}
                  </p>
                </div>
              </div>
            </div>

            {result.order.status === 'PAID' && result.downloadUrl ? (
              <a 
                href={result.downloadUrl}
                target="_blank"
                rel="noreferrer"
                className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-4 px-4 rounded-xl flex items-center justify-center transition-colors shadow-md"
              >
                <Download className="w-5 h-5 mr-2" />
                ดาวน์โหลด E-book (PDF)
              </a>
            ) : result.order.status === 'PENDING' ? (
              <Link 
                href={`/payment/${result.order.orderCode}`}
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-4 px-4 rounded-xl flex items-center justify-center transition-colors shadow-md"
              >
                ไปหน้าชำระเงิน
              </Link>
            ) : null}
          </div>
        </div>
      )}
    </div>
  );
}
