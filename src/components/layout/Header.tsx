import Link from 'next/link';
import { BookOpen, Search } from 'lucide-react';

export default function Header() {
  return (
    <header className="border-b bg-white sticky top-0 z-10">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 text-indigo-600">
          <BookOpen className="h-6 w-6" />
          <span className="font-bold text-xl">Demo E-book Store</span>
        </Link>
        <nav>
          <Link 
            href="/track" 
            className="text-sm font-medium text-gray-600 hover:text-indigo-600 flex items-center gap-2"
          >
            <Search className="h-4 w-4" />
            ติดตามคำสั่งซื้อ
          </Link>
        </nav>
      </div>
    </header>
  );
}
