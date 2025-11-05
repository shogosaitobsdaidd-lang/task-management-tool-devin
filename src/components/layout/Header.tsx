import React from 'react';
import { Calendar } from 'lucide-react';

export const Header: React.FC = () => {
  return (
    <header className="bg-white border-b border-gray-200 shadow-sm">
      <div className="px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Calendar className="w-6 h-6 text-blue-600" />
          <h1 className="text-xl font-bold text-gray-900">Task Management Tool</h1>
        </div>
      </div>
    </header>
  );
};
