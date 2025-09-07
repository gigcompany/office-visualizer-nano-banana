import React from 'react';

const RenderOutput = ({ generatedRender, onImageClick }) => {
  const handleClick = () => {
    if (generatedRender) {
      onImageClick(`data:image/jpeg;base64,${generatedRender}`);
    }
  };

  return (
    <div className="flex flex-col items-center w-full">
      <h2 className="font-semibold mb-2">3D Render</h2>
      <div className="bg-white p-6 rounded-lg shadow-lg w-full h-[800px] overflow-hidden flex flex-col">
        {generatedRender ? (
          <div className="mt-4 p-4 bg-gray-100 rounded-md flex justify-center items-center cursor-pointer" onClick={handleClick}>
            <img src={`data:image/jpeg;base64,${generatedRender}`} alt="Generated 3D Render" className="max-w-full h-auto" />
          </div>
        ) : (
          <div className="mt-4 p-4 bg-gray-100 rounded-md text-center">
            <p>The generated 3D render will be displayed here.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default RenderOutput;