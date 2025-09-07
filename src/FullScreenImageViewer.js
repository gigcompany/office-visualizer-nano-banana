import React from 'react';

const FullScreenImageViewer = ({ imageUrl, onClose, onDownload }) => {
  const handleDownload = () => {
    onDownload(imageUrl);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
      <div className="relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-white text-2xl font-bold p-2 rounded-full bg-gray-800 hover:bg-gray-700"
        >
          &times;
        </button>
        <img src={imageUrl} alt="Full Screen Render" className="max-w-screen max-h-screen object-contain" />
        <button
          onClick={handleDownload}
          className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Download Image
        </button>
      </div>
    </div>
  );
};

export default FullScreenImageViewer;
