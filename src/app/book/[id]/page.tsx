import { supabase } from '@/lib/supabase/client';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { formatCurrency } from '@/lib/utils';
import { ArrowLeft, ShoppingCart } from 'lucide-react';

export const revalidate = 60;

export default async function BookDetailsPage({ params }: { params: Promise<{ id: string }> }) {
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
    <div className="max-w-4xl mx-auto">
      <Link href="/" className="inline-flex items-center text-indigo-600 hover:text-indigo-800 mb-6 transition-colors">
        <ArrowLeft className="w-4 h-4 mr-2" />
        กลับไปหน้าร้าน
      </Link>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden flex flex-col md:flex-row">
        <div className="relative w-full md:w-2/5 aspect-[3/4] bg-gray-100">
          <Image
            src={book.cover_url}
            alt={book.title}
            fill
            className="object-cover"
            priority
            sizes="(max-width: 768px) 100vw, 40vw"
          />
        </div>
        
        <div className="p-8 flex flex-col md:w-3/5">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">{book.title}</h1>
          <div className="prose prose-indigo mb-8 flex-grow">
            <p className="text-gray-600 leading-relaxed whitespace-pre-wrap">{book.description}</p>
          </div>
          
          <div className="mt-auto pt-6 border-t border-gray-100">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <p className="text-sm text-gray-500 mb-1">ราคา</p>
                <p className="text-3xl font-bold text-indigo-600">{formatCurrency(book.price)}</p>
              </div>
              <Link 
                href={`/checkout/${book.id}`}
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-4 rounded-xl font-semibold flex items-center justify-center gap-2 transition-colors shadow-md hover:shadow-lg"
              >
                <ShoppingCart className="w-5 h-5" />
                สั่งซื้อเลย
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
