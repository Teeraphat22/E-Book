'use client';

import { useState } from 'react';
import { processPayment } from './actions';
import { CheckCircle, Loader2 } from 'lucide-react';
import Link from 'next/link';

export default function PaymentForm({ orderCode }: { orderCode: string }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [emailStatus, setEmailStatus] = useState('');

  const handlePayment = async () => {
    setLoading(true);
    setError('');
    
    const result = await processPayment(orderCode);
    
    if (result.error) {
      setError(result.error);
      setLoading(false);
    } else if (result.success) {
      setSuccess(true);
      setEmailStatus(result.emailStatus || '');
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="text-center py-6 animate-in fade-in zoom-in duration-300">
        <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
        <h3 className="text-xl font-bold text-gray-900 mb-2">จำลองชำระเงินสำเร็จ!</h3>
        <p className="text-gray-600 mb-4">ระบบได้อัปเดตสถานะคำสั่งซื้อเรียบร้อยแล้ว</p>
        
        <div className="bg-gray-50 border p-3 rounded-lg text-sm mb-6 inline-block text-left">
          <p><span className="font-semibold">สถานะอีเมล:</span> {emailStatus}</p>
        </div>

        <div>
          <Link 
            href="/track" 
            className="inline-flex justify-center w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 px-4 rounded-xl transition-colors"
          >
            ไปหน้าติดตามคำสั่งซื้อ
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {error && (
        <div className="p-3 bg-red-50 text-red-600 text-sm rounded-lg border border-red-100">
          {error}
        </div>
      )}
      
      <button
        onClick={handlePayment}
        disabled={loading}
        className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-4 px-4 rounded-xl shadow-lg transition-transform active:scale-95 disabled:opacity-70 disabled:active:scale-100 flex items-center justify-center"
      >
        {loading ? (
          <>
            <Loader2 className="w-5 h-5 mr-2 animate-spin" />
            กำลังประมวลผล...
          </>
        ) : (
          'จำลองชำระเงินสำเร็จ'
        )}
      </button>
    </div>
  );
}
