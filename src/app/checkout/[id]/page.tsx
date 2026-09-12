import { supabase } from '@/lib/supabase/client';
import { notFound } from 'next/navigation';
import CheckoutForm from './CheckoutForm';

export default async function CheckoutPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const { data: book, error } = await supabase
    .from('books')
    .select('*')
    .eq('id', id)
    .single();

  if (error || !book) {
    notFound();
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-6 border-b pb-4">สั่งซื้อหนังสือ</h1>
        <CheckoutForm book={book} />
      </div>
    </div>
  );
}
