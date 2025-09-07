import React, { useState, useCallback } from 'react';
import sample1 from './assets/2D Floor Plan - Sample 1.png';
import sample2 from './assets/2D Floor Plan - Sample 2.png';
import sample3 from './assets/2D Floor Plan - Sample 3.png';
import sample4 from './assets/2D Floor Plan - Sample 4.png';

const sampleImages = [
  { name: 'Sample 1', src: sample1 },
  { name: 'Sample 2', src: sample2 },
  { name: 'Sample 3', src: sample3 },
  { name: 'Sample 4', src: sample4 },
];

const FloorPlanUpload = ({ onImageUpload }) => {
  const [imageUrl, setImageUrl] = useState(null);

  const handleDrop = useCallback((event) => {
    event.preventDefault();
    const file = event.dataTransfer.files[0];
    if (file && (file.type === 'image/png' || file.type === 'image/jpeg')) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImageUrl(reader.result);
        onImageUpload({ type: file.type, data: reader.result.split(',')[1] }, reader.result);
      };
      reader.readAsDataURL(file);
    } else {
      alert('Please drop a PNG or JPG file.');
    }
  }, [onImageUpload]);

  const handleDragOver = useCallback((event) => {
    event.preventDefault();
  }, []);

  const handleSampleImageClick = async (imageSrc) => {
    setImageUrl(imageSrc);
    const response = await fetch(imageSrc);
    const blob = await response.blob();
    const file = new File([blob], 'sample_image.png', { type: 'image/png' });
    const reader = new FileReader();
    reader.onloadend = () => {
        onImageUpload({ type: file.type, data: reader.result.split(',')[1] }, reader.result);
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="flex flex-col items-center w-full">
      <h2 className="font-semibold mb-2">2D Floor Plan</h2>
      <div className="bg-white p-6 rounded-lg shadow-lg w-full flex flex-col">
      <div className="flex flex-col items-center w-full mb-4">
            <h3 className="font-semibold mb-2">Select a sample</h3>
            <div className="grid grid-cols-4 gap-4">
                {sampleImages.map((image) => (
                    <div key={image.name} className="cursor-pointer border-2 border-gray-300 hover:border-indigo-500 rounded-lg overflow-hidden" onClick={() => handleSampleImageClick(image.src)}>
                        <img src={image.src} alt={image.name} className="w-full h-auto" />
                    </div>
                ))}
            </div>
        </div>
        <div
          className="w-full h-64 border-4 border-dashed border-gray-400 rounded-lg flex items-center justify-center text-gray-500 text-xl mb-4"
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