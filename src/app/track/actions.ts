'use server';

import { supabaseAdmin } from '@/lib/supabase/server';

export async function checkOrder(formData: FormData) {
  const orderCode = formData.get('orderCode') as string;
  const email = formData.get('email') as string;

  if (!orderCode || !email) {
    return { error: 'กรุณากรอกข้อมูลให้ครบถ้วน' };
  }

  // ค้นหา order ที่ตรงกับ order_code และ email
  const { data: order, error } = await supabaseAdmin
    .from('orders')
    .select(`
      *,
      books (
        title,
        cover_url,
        file_path
      )
    `)
    .eq('order_code', orderCode)
    .eq('customer_email', email)
    .single();

  if (error || !order) {
    // ห้ามบอกใบ้ว่าอะไรผิด เพื่อความปลอดภัย
    return { error: 'ไม่พบคำสั่งซื้อ โปรดตรวจสอบหมายเลขคำสั่งซื้อและอีเมลอีกครั้ง' };
  }

  let downloadUrl = null;

  // ถ้าจ่ายเงินแล้ว ให้สร้าง Signed URL ใหม่ (อายุ 24 ชม.)
  if (order.status === 'PAID') {
    const { data: signedUrlData, error: signedUrlError } = await supabaseAdmin
      .storage
      .from('books')
      .createSignedUrl(order.books.file_path, 86400);
      
    if (!signedUrlError && signedUrlData) {
      downloadUrl = signedUrlData.signedUrl;
    }
  }

  return {
    success: true,
    order: {
      orderCode: order.order_code,
      status: order.status,
      bookTitle: order.books.title,
      coverUrl: order.books.cover_url,
      amount: order.amount,
      paidAt: order.paid_at,
    },
    downloadUrl
  };
}
