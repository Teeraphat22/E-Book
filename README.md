# E-book Demo Store

ร้านขาย E-book แบบสาธิต (Demo) สร้างด้วย Next.js (App Router), Supabase และ Resend

## ฟีเจอร์
- หน้าร้านแสดง E-book 3 เล่ม
- ระบบจำลองการสั่งซื้อและชำระเงิน (ไม่มีการตัดเงินจริง)
- ระบบส่งอีเมลแจ้งลิงก์ดาวน์โหลดด้วย Resend
- ลิงก์ดาวน์โหลดแบบ Signed URL (มีวันหมดอายุ) ปลอดภัย
- ระบบตรวจสอบสถานะคำสั่งซื้อ
- รองรับ Mobile-first responsive

## เทคโนโลยี
- Next.js (App Router) + TypeScript
- Tailwind CSS
- Supabase (Database & Storage & Auth/RLS)
- Resend (Email Service)
- Vercel (Deployment)

## การติดตั้งและรันในเครื่อง (Local Setup)

1. **โคลนโปรเจกต์และติดตั้ง Dependencies**
   ```bash
   npm install
   ```

2. **ตั้งค่า Environment Variables**
   คัดลอกไฟล์ `.env.example` เป็น `.env.local`
   ```bash
   cp .env.example .env.local
   ```
   แล้วแก้ไขค่าตาม Supabase และ Resend ของคุณ:
   - `NEXT_PUBLIC_SUPABASE_URL`: Project URL ของ Supabase
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Project API keys (anon/public)
   - `SUPABASE_SERVICE_ROLE_KEY`: Project API keys (service_role/secret)
   - `RESEND_API_KEY`: API Key จาก Resend

3. **ตั้งค่า Supabase Database**
   - ไปที่ SQL Editor ใน Supabase Dashboard
   - คัดลอกโค้ดจากไฟล์ `supabase/setup.sql` ไปรันเพื่อสร้างตาราง, ตั้งค่า RLS และเพิ่มข้อมูล E-book ตัวอย่าง

4. **ตั้งค่า Supabase Storage (สำหรับเก็บไฟล์ E-book)**
   - ไปที่เมนู Storage สร้าง Bucket ใหม่ชื่อ `books`
   - ตรวจสอบให้แน่ใจว่าไม่ได้เปิด Public (เป็น Private Bucket)
   - อัปโหลดไฟล์ PDF ตัวอย่างไปเก็บไว้ใน Path `books/nextjs-beginners.pdf`, `books/advanced-typescript.pdf`, `books/tailwind-mastery.pdf` 
     *(สามารถใช้ไฟล์ PDF เปล่าๆ หรือ dummy PDF ได้ตามสะดวก และตั้งชื่อไฟล์ให้ตรงกับ file_path ในตาราง books)*

5. **รันโปรเจกต์**
   ```bash
   npm run dev
   ```
   เปิดเบราว์เซอร์ไปที่ [http://localhost:3000](http://localhost:3000)

## การนำขึ้นเซิร์ฟเวอร์ (Deploy to Vercel)
1. นำโค้ดขึ้น GitHub repository
2. ล็อกอินเข้า Vercel แล้วเลือก "Add New Project"
3. เลือก Repository ที่นำโค้ดขึ้นไป
4. ในส่วน "Environment Variables" ให้นำค่าจากไฟล์ `.env.local` ทั้งหมดไปใส่
5. กด Deploy!
