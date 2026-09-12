'use server';

import { supabaseAdmin } from '@/lib/supabase/server';
import { resend } from '@/lib/resend';

export async function processPayment(orderCode: string) {
  try {
    // 1. ดึงข้อมูล order และหนังสือ
    const { data: order, error: fetchError } = await supabaseAdmin
      .from('orders')
      .select(`
        *,
        books (
          title,
          file_path
        )
      `)
      .eq('order_code', orderCode)
      .single();

    if (fetchError || !order) {
      return { error: 'ไม่พบคำสั่งซื้อนี้' };
    }

    if (order.status === 'PAID') {
      return { error: 'คำสั่งซื้อนี้ชำระเงินไปแล้ว' };
    }

    // 2. สร้าง Signed URL สำหรับดาวน์โหลด (อายุ 24 ชั่วโมง = 86400 วินาที)
    const { data: signedUrlData, error: signedUrlError } = await supabaseAdmin
      .storage
      .from('books')
      .createSignedUrl(order.books.file_path, 86400);

    let downloadUrl = '';
    if (signedUrlError) {
      console.error('Error creating signed URL:', signedUrlError);
      // ไม่ return error ทันที เผื่อส่งอีเมลแจ้งว่าเกิดปัญหา แต่จะใช้วิธี track แทน
      // เพื่อความเรียบง่าย จะตั้งค่าเป็นลิงก์ไปหน้า track แทน
    } else {
      downloadUrl = signedUrlData.signedUrl;
    }

    // 3. อัปเดตสถานะเป็น PAID
    const { error: updateError } = await supabaseAdmin
      .from('orders')
      .update({ 
        status: 'PAID', 
        paid_at: new Date().toISOString() 
      })
      .eq('id', order.id);

    if (updateError) {
      return { error: 'เกิดข้อผิดพลาดในการอัปเดตสถานะคำสั่งซื้อ' };
    }

    // 4. ส่งอีเมลด้วย Resend
    let emailStatus = 'ยังไม่ได้ตั้งค่า Resend API Key หรือส่งไม่สำเร็จ';
    
    if (process.env.RESEND_API_KEY) {
      const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
      const trackUrl = `${siteUrl}/track`;
      const dlLink = downloadUrl ? `<p><strong>ดาวน์โหลดหนังสือของคุณ:</strong> <a href="${downloadUrl}">คลิกที่นี่</a> (ลิงก์มีอายุ 24 ชั่วโมง)</p>` : '';

      try {
        const { error: emailError } = await resend.emails.send({
          from: 'E-book Store <noreply@e-book-tp.me>', // ใช้อีเมลโดเมนตัวเอง
          to: order.customer_email,
          subject: `ยืนยันการสั่งซื้อหนังสือ ${order.books.title} เรียบร้อยแล้ว`,
          html: `
            <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
              <h2>ขอบคุณสำหรับการสั่งซื้อคุณ ${order.customer_name}</h2>
              <p>เราได้รับยอดชำระเงินสำหรับคำสั่งซื้อ <strong>${order.order_code}</strong> เรียบร้อยแล้ว</p>
              <div style="padding: 16px; background-color: #f3f4f6; border-radius: 8px; margin: 20px 0;">
                <h3 style="margin-top: 0;">รายละเอียด</h3>
                <p><strong>หนังสือ:</strong> ${order.books.title}</p>
                <p><strong>ยอดชำระ:</strong> ฿${order.amount.toLocaleString()}</p>
              </div>
              ${dlLink}
              <p>หากลิงก์หมดอายุ คุณสามารถไปสร้างลิงก์ใหม่ได้ที่ <a href="${trackUrl}">หน้าติดตามคำสั่งซื้อ</a></p>
            </div>
          `,
        });

        if (emailError) {
          console.error('Resend error:', emailError);
          emailStatus = 'ส่งอีเมลล้มเหลว (ตรวจสอบ Resend logs)';
        } else {
          emailStatus = 'ส่งอีเมลสำเร็จ';
        }
      } catch (err) {
        console.error('Email sending exception:', err);
        emailStatus = 'เกิดข้อผิดพลาดขณะส่งอีเมล';
      }
    }

    return { 
      success: true, 
      emailStatus 
    };

  } catch (error) {
    console.error('Process payment error:', error);
    return { error: 'เกิดข้อผิดพลาดบางอย่าง กรุณาลองใหม่อีกครั้ง' };
  }
}
