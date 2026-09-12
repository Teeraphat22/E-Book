import { supabaseAdmin } from '@/lib/supabase/server';
import { notFound } from 'next/navigation';
import PaymentForm from './PaymentForm';
import { AlertTriangle } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';

export default async function PaymentPage({ params }: { params: Promise<{ orderCode: string }> }) {
  const { orderCode } = await params;

  // Fetch order and book details
  const { data: order, error } = await supabaseAdmin
    .from('orders')
    .select(`
      *,
      books (
        title,
        price,
        cover_url
      )
    `)
    .eq('order_code', orderCode)
    .single();

  if (error || !order) {
    notFound();
  }

  // ถ้าจ่ายเงินแล้ว ให้ไปหน้าติดตามคำสั่งซื้อ
  if (order.status === 'PAID') {
    return (
      <div className="max-w-xl mx-auto text-center py-12">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">คำสั่งซื้อนี้ชำระเงินเรียบร้อยแล้ว</h1>
        <p className="text-gray-600 mb-6">ระบบได้ส่งลิงก์ดาวน์โหลดไปที่อีเมล {order.customer_email} แล้ว</p>
        <a href="/track" className="text-indigo-600 font-medium hover:underline">
          ไปที่หน้าติดตามคำสั่งซื้อ
        </a>
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto">
      {/* DEMO Banner */}
      <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-800 p-4 mb-6 rounded-r-lg flex items-start">
        <AlertTriangle className="w-6 h-6 mr-3 flex-shrink-0 mt-0.5" />
        <div>
          <h3 className="font-bold">DEMO ONLY - ระบบสาธิต</h3>
          <p className="text-sm mt-1">นี่คือหน้าระบบชำระเงินจำลอง <strong>ไม่มีการรับชำระเงินจริง</strong> กรุณากดปุ่มด้านล่างเพื่อจำลองการชำระเงินสำเร็จ</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-6 border-b pb-4">จำลองการชำระเงิน</h1>
        
        <div className="mb-8 space-y-4">
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">หมายเลขคำสั่งซื้อ:</span>
            <span className="font-medium text-gray-900">{order.order_code}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">ชื่อลูกค้า:</span>
            <span className="font-medium text-gray-900">{order.customer_name}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">หนังสือ:</span>
            <span className="font-medium text-gray-900">{order.books.title}</span>
          </div>
          <div className="pt-4 border-t flex justify-between items-center">
            <span className="font-medium text-gray-700">ยอดชำระสุทธิ:</span>
            <span className="text-2xl font-bold text-indigo-600">{formatCurrency(order.amount)}</span>
          </div>
        </div>

        <PaymentForm orderCode={order.order_code} />
      </div>
    </div>
  );
}
