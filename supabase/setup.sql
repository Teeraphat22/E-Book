-- ลบตารางเดิมถ้ามีอยู่
DROP TABLE IF EXISTS orders;
DROP TABLE IF EXISTS books;

-- 1. สร้างตาราง books
CREATE TABLE books (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  cover_url TEXT NOT NULL,
  price NUMERIC(10, 2) NOT NULL,
  file_path TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. สร้างตาราง orders
CREATE TABLE orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_code TEXT UNIQUE NOT NULL,
  book_id UUID NOT NULL REFERENCES books(id),
  customer_name TEXT NOT NULL,
  customer_email TEXT NOT NULL,
  amount NUMERIC(10, 2) NOT NULL,
  status TEXT NOT NULL DEFAULT 'PENDING' CHECK (status IN ('PENDING', 'PAID')),
  paid_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. เปิดการใช้งาน Row Level Security (RLS)
ALTER TABLE books ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

-- 4. ตั้งค่า RLS Policies
-- Books: ทุกคน (anon) สามารถอ่านข้อมูลหนังสือได้
CREATE POLICY "Allow public read access on books"
  ON books
  FOR SELECT
  TO public
  USING (true);

-- Orders: ปิดไม่ให้ public/anon เข้าถึงผ่าน browser โดยตรง 
-- (Service Role ที่ใช้บน Server จะสามารถ bypass RLS ได้อัตโนมัติ)
-- ดังนั้นเราไม่ต้องสร้าง policy สำหรับ anon/public บน orders

-- 5. สร้างข้อมูลตัวอย่าง (Seed Data)
INSERT INTO books (title, description, cover_url, price, file_path) VALUES
('Next.js for Beginners', 'เรียนรู้พื้นฐาน Next.js ตั้งแต่เริ่มต้นจนสามารถสร้างเว็บแอปพลิเคชันได้จริง', 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=600&auto=format&fit=crop', 290.00, 'books/nextjs-beginners.pdf'),
('Advanced TypeScript', 'เจาะลึก TypeScript สู่ระดับมืออาชีพ พร้อมตัวอย่างการใช้งานจริง', 'https://images.unsplash.com/photo-1516116216624-53e697fedbea?q=80&w=600&auto=format&fit=crop', 350.00, 'books/advanced-typescript.pdf'),
('Tailwind CSS Mastery', 'ตกแต่งเว็บไซต์ให้สวยงามและรวดเร็วด้วย Tailwind CSS', 'https://images.unsplash.com/photo-1507721999472-8ed4421c4af2?q=80&w=600&auto=format&fit=crop', 250.00, 'books/tailwind-mastery.pdf');
