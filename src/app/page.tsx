import { supabase } from '@/lib/supabase/client';
import BookCard from '@/components/BookCard';

export const revalidate = 60; // Revalidate every 60 seconds

export default async function Home() {
  const { data: books, error } = await supabase
    .from('books')
    .select('id, title, description, cover_url, price')
    .order('created_at', { ascending: false });

  if (error) {
    return (
      <div className="text-center py-20 text-red-500">
        <p>ไม่สามารถโหลดข้อมูลหนังสือได้ กรุณาลองใหม่อีกครั้ง</p>
      </div>
    );
  }

  if (!books || books.length === 0) {
    return (
      <div className="text-center py-20">
        <h2 className="text-xl font-medium text-gray-500">ยังไม่มีหนังสือในระบบ</h2>
      </div>
    );
  }

  return (
    <div>
      <section className="mb-10 text-center md:text-left">
        <h1 className="text-3xl font-bold text-gray-900">E-book แนะนำ</h1>
        <p className="text-gray-500 mt-2">เลือกซื้อ E-book คุณภาพเพื่อพัฒนาทักษะของคุณ</p>
      </section>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {books.map((book) => (
          <BookCard key={book.id} book={book} />
        ))}
      </div>
    </div>
  );
}
