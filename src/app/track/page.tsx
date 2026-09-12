import TrackForm from './TrackForm';
import { Search } from 'lucide-react';

export default function TrackPage() {
  return (
    <div className="max-w-2xl mx-auto">
      <div className="text-center mb-8">
        <Search className="w-12 h-12 text-indigo-600 mx-auto mb-4" />
        <h1 className="text-3xl font-bold text-gray-900">ติดตามคำสั่งซื้อ</h1>
        <p className="text-gray-500 mt-2">กรอกหมายเลขคำสั่งซื้อและอีเมลของคุณเพื่อตรวจสอบสถานะและดาวน์โหลดหนังสือ</p>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8">
        <TrackForm />
      </div>
    </div>
  );
}
