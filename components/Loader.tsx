
import React from 'react';

const Loader: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center space-y-4">
      <div className="w-16 h-16 border-4 border-dashed rounded-full animate-spin border-pink-500"></div>
      <p className="text-lg text-gray-600">...جاري إعداد منتجك</p>
      <p className="text-sm text-gray-500">قد يستغرق هذا بضع لحظات</p>
    </div>
  );
};

export default Loader;
