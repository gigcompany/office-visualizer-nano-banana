import React from 'react';

const SkeletonLoader = () => {
  return (
    <div className="animate-pulse bg-gray-200 rounded-lg shadow-lg w-full h-[800px] flex flex-col items-center justify-center">
      <div className="w-3/4 h-4 bg-gray-300 rounded mb-4"></div>
      <div className="w-1/2 h-4 bg-gray-300 rounded mb-4"></div>
      <div className="w-full h-64 bg-gray-300 rounded"></div>
    </div>
  );
};

export default SkeletonLoader;
