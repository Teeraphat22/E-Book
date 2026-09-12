import Image from 'next/image';
import Link from 'next/link';
import { formatCurrency } from '@/lib/utils';

interface Book {
  id: string;
  title: string;
  description: string;
  cover_url: string;
  price: number;
}

export default function BookCard({ book }: { book: Book }) {
  return (
    <Link href={`/book/${book.id}`} className="group h-full">
      <div className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300 overflow-hidden border border-gray-100 flex flex-col h-full">
        <div className="relative aspect-[3/4] w-full overflow-hidden bg-gray-100">
          <Image
            src={book.cover_url}
            alt={book.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        </div>
        <div className="p-4 flex flex-col flex-grow">
          <h3 className="font-semibold text-lg text-gray-900 line-clamp-1">{book.title}</h3>
          <p className="text-sm text-gray-500 mt-1 line-clamp-2 flex-grow">{book.description}</p>
          <div className="mt-4 flex items-center justify-between">
            <span className="font-bold text-indigo-600">{formatCurrency(book.price)}</span>
            <span className="text-sm font-medium text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full group-hover:bg-indigo-100 transition-colors">
              ดูรายละเอียด
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}
