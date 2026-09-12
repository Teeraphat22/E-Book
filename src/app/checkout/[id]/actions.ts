'use server';

import { supabaseAdmin } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';

export async function createOrder(formData: FormData) {
  const bookId = formData.get('bookId') as string;
  const name = formData.get('name') as string;
  const email = formData.get('email') as string;
  const price = Number(formData.get('price'));

  if (!bookId || !name || !email || isNaN(price)) {
    return { error: 'กรุณากรอกข้อมูลให้ครบถ้วนและถูกต้อง' };
  }

  // Generate order code (e.g. ORD-123456)
  const orderCode = `ORD-${Math.floor(100000 + Math.random() * 900000)}`;

  const { data, error } = await supabaseAdmin
    .from('orders')
    .insert([
      {
        order_code: orderCode,
        book_id: bookId,
        customer_name: name,
        customer_email: email,
        amount: price,
        status: 'PENDING',
      },
    ])
    .select('order_code')
    .single();

  if (error) {
    console.error('Error creating order:', error);
    return { error: 'ไม่สามารถสร้างคำสั่งซื้อได้ กรุณาลองใหม่อีกครั้ง' };
  }

  // Redirect ไปยังหน้าชำระเงิน
  redirect(`/payment/${data.order_code}`);
}
