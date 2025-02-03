import React from 'react';

const PreLoader = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="flex flex-col items-center gap-4">
        <div className="relative w-16 h-16">
          <div className="absolute top-0 left-0 right-0 bottom-0">
            <div className="w-16 h-16 rounded-full border-4 border-blue-200"></div>
            <div className="w-16 h-16 rounded-full border-4 border-blue-600 border-t-transparent animate-spin absolute top-0"></div>
          </div>
        </div>
        <div className="text-gray-600 text-lg font-medium animate-pulse">
          Loading...
        </div>
      </div>
    </div>
  );
};

export default PreLoader;