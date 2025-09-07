import React from 'react';
import SkeletonLoader from './SkeletonLoader';

const PhotorealisticImageOutput = ({ photorealisticImages, onImageClick }) => {

  const handleClick = (image) => {
    if (image && image !== 'error' && image !== null) {
      onImageClick(`data:image/jpeg;base64,${image}`);
    }
  };

  return (
    <div className="flex flex-col items-center w-full gap-4">
      <h2 className="font-semibold mb-4">Professional Photos</h2>
      {photorealisticImages.map((image, index) => (
        <div key={index} className="bg-white p-6 rounded-lg shadow-lg w-full h-[800px] overflow-hidden flex flex-col justify-center items-center">
          {image === null ? (
            <SkeletonLoader />
          ) : image === 'error' ? (
            <div className="text-red-500">Error generating image</div>
          ) : (
            <img
              src={`data:image/jpeg;base64,${image}`}
              alt={`Photorealistic Image ${index + 1}`}
              className="max-w-full max-h-full object-contain cursor-pointer"
              onClick={() => handleClick(image)}
            />
          )}
        </div>
      ))}
    </div>
  );
};

export default PhotorealisticImageOutput;
