import React, { useState } from 'react';

const PhotorealisticImageOutput = ({ photorealisticImages, onImageClick }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const handleNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % photorealisticImages.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + photorealisticImages.length) % photorealisticImages.length);
  };

  const currentImage = photorealisticImages[currentIndex];

  const handleClick = () => {
    if (currentImage) {
      onImageClick(`data:image/jpeg;base64,${currentImage}`);
    }
  };

  return (
    <div className="flex flex-col items-center w-full">
      <h2 className="text-xl font-semibold mb-4">Photorealistic Images</h2>
      <div className="bg-white p-6 rounded-lg shadow-lg w-full h-[800px] overflow-hidden flex flex-col justify-between">
        {photorealisticImages.length > 0 ? (
          <div className="flex-grow flex items-center justify-center relative">
            <img src={`data:image/jpeg;base64,${currentImage}`} alt="Photorealistic Image" className="max-w-full max-h-full object-contain cursor-pointer" onClick={handleClick} />
            {photorealisticImages.length > 1 && (
              <>
                <button onClick={handlePrev} className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-gray-800 text-white p-2 rounded-full opacity-75 hover:opacity-100">
                  &#10094;
                </button>
                <button onClick={handleNext} className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-gray-800 text-white p-2 rounded-full opacity-75 hover:opacity-100">
                  &#10095;
                </button>
              </>
            )}
          </div>
        ) : (
          <div className="flex-grow flex items-center justify-center text-center">
            <p>The photorealistic images will be displayed here.</p>
          </div>
        )}
        {photorealisticImages.length > 1 && (
          <div className="flex justify-center mt-4">
            {photorealisticImages.map((_, index) => (
              <span
                key={index}
                className={`dot w-3 h-3 mx-1 rounded-full bg-gray-400 cursor-pointer ${currentIndex === index ? 'bg-gray-800' : ''}`}
                onClick={() => setCurrentIndex(index)}
              ></span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default PhotorealisticImageOutput;
