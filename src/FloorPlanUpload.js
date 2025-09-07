import React, { useState, useCallback } from 'react';

const FloorPlanUpload = ({ onImageUpload }) => {
  const [imageUrl, setImageUrl] = useState(null);

  const handleDrop = useCallback((event) => {
    event.preventDefault();
    const file = event.dataTransfer.files[0];
    if (file && (file.type === 'image/png' || file.type === 'image/jpeg')) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImageUrl(reader.result);
        console.log("reader.result",reader.result);
        onImageUpload({ type: file.type, data: reader.result.split(',')[1] },reader.result);
      };
      reader.readAsDataURL(file);
    } else {
      alert('Please drop a PNG or JPG file.');
    }
  }, [onImageUpload]);

  const handleDragOver = useCallback((event) => {
    event.preventDefault();
  }, []);

  return (
    <div className="flex flex-col items-center w-full">
      <h2 className="font-semibold mb-2">2D Floor Plan</h2>
      <div className="bg-white p-6 rounded-lg shadow-lg w-full h-[800px] overflow-hidden flex flex-col">
        <div
          className="w-full h-64 border-4 border-dashed border-gray-400 rounded-lg flex items-center justify-center text-gray-500 text-xl"
          onDrop={handleDrop}
          onDragOver={handleDragOver}
        >
          {imageUrl ? (
            <img src={imageUrl} alt="Floor Plan" className="max-h-full" />
          ) : (
            <p>Drag and drop your floor plan image here</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default FloorPlanUpload;
