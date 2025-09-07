import React, { useState } from 'react';
import { generate3DRender } from './gemini';

const themes = [
  { name: 'Modern', icon: 'https://raw.githubusercontent.com/tailwindlabs/heroicons/master/src/24/outline/building-office.svg' },
  { name: 'Vibrant', icon: 'https://raw.githubusercontent.com/tailwindlabs/heroicons/master/src/24/outline/sparkles.svg' },
  { name: 'Minimalist', icon: 'https://raw.githubusercontent.com/tailwindlabs/heroicons/master/src/24/outline/viewfinder-circle.svg' },
  { name: 'Industrial', icon: 'https://raw.githubusercontent.com/tailwindlabs/heroicons/master/src/24/outline/wrench-screwdriver.svg' },
];

const floorMaterials = [
  { name: 'Carpet', icon: 'https://raw.githubusercontent.com/tailwindlabs/heroicons/master/src/24/outline/rectangle-stack.svg' },
  { name: 'Wood', icon: 'https://raw.githubusercontent.com/tailwindlabs/heroicons/master/src/24/outline/table-cells.svg' },
  { name: 'Tiles', icon: 'https://raw.githubusercontent.com/tailwindlabs/heroicons/master/src/24/outline/squares-2x2.svg' },
];

const wallMaterials = [
  { name: 'Paint', icon: 'https://raw.githubusercontent.com/tailwindlabs/heroicons/master/src/24/outline/paint-brush.svg' },
  { name: 'Bricks', icon: 'https://raw.githubusercontent.com/tailwindlabs/heroicons/master/src/24/outline/building-library.svg' },
  { name: 'Glass', icon: 'https://raw.githubusercontent.com/tailwindlabs/heroicons/master/src/24/outline/cube-transparent.svg' },
];

const DesignPanel = ({ image,imageURL, onRenderGenerated, onLoadingChange, hasGeneratedRender, onGeneratePhotorealisticImage }) => {
  const [selectedTheme, setSelectedTheme] = useState(themes[0]);
  const [brandColor, setBrandColor] = useState('#000000');
  const [selectedFloorMaterial, setSelectedFloorMaterial] = useState(floorMaterials[0]);
  const [selectedWallMaterial, setSelectedWallMaterial] = useState(wallMaterials[0]);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!image) {
      alert('Please upload a floor plan image first.');
      return;
    }

    setIsLoading(true);
    onLoadingChange(true);

    try {
      const render = await generate3DRender({
        theme: selectedTheme.name,
        brandColor,
        floorMaterial: selectedFloorMaterial.name,
        wallMaterial: selectedWallMaterial.name,
        image,
        imageURL
      });
      onRenderGenerated(render);
    } catch (error) {
      alert(error.message);
    }

    setIsLoading(false);
    onLoadingChange(false);
  };

  const handleGeneratePhotorealistic = () => {
    if (onGeneratePhotorealisticImage) {
      onGeneratePhotorealisticImage();
    }
  };

  return (
    <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
      <div>
        <h2 className="text-2xl font-bold text-center">Design Your Office</h2>
      </div>
      <form className="space-y-6" onSubmit={handleSubmit}>
        <div>
          <label className="text-sm font-medium text-gray-700">Office Theme</label>
          <div className="grid grid-cols-2 gap-4 mt-2">
            {themes.map((theme) => (
              <button
                type="button"
                key={theme.name}
                onClick={() => setSelectedTheme(theme)}
                className={`flex flex-col items-center p-4 border rounded-lg ${selectedTheme.name === theme.name ? 'border-indigo-500' : 'border-gray-300'}`}>
                <img src={theme.icon} alt={theme.name} className="w-8 h-8 mb-2" />
                <span>{theme.name}</span>
              </button>
            ))}
          </div>
        </div>
        <div>
          <label htmlFor="brand-color" className="text-sm font-medium text-gray-700">Brand Color</label>
          <input type="color" id="brand-color" name="brand-color" value={brandColor} onChange={(e) => setBrandColor(e.target.value)} className="w-full h-10 px-3 py-2 mt-1 border border-gray-300 rounded-md" />
        </div>
        <div>
          <label className="text-sm font-medium text-gray-700">Floor Material</label>
          <div className="grid grid-cols-3 gap-4 mt-2">
            {floorMaterials.map((material) => (
              <button
                type="button"
                key={material.name}
                onClick={() => setSelectedFloorMaterial(material)}
                className={`flex flex-col items-center p-4 border rounded-lg ${selectedFloorMaterial.name === material.name ? 'border-indigo-500' : 'border-gray-300'}`}>
                <img src={material.icon} alt={material.name} className="w-8 h-8 mb-2" />
                <span>{material.name}</span>
              </button>
            ))}
          </div>
        </div>
        <div>
          <label className="text-sm font-medium text-gray-700">Wall Material</label>
          <div className="grid grid-cols-3 gap-4 mt-2">
            {wallMaterials.map((material) => (
              <button
                type="button"
                key={material.name}
                onClick={() => setSelectedWallMaterial(material)}
                className={`flex flex-col items-center p-4 border rounded-lg ${selectedWallMaterial.name === material.name ? 'border-indigo-500' : 'border-gray-300'}`}>
                <img src={material.icon} alt={material.name} className="w-8 h-8 mb-2" />
                <span>{material.name}</span>
              </button>
            ))}
          </div>
        </div>
        <div>
          <button type="submit" className="w-full px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500" disabled={isLoading}>
            {isLoading ? 'Generating...' : 'Generate 3D Render'}
          </button>
        </div>
        {hasGeneratedRender && (
          <div>
            <button type="button" onClick={handleGeneratePhotorealistic} className="w-full px-4 py-2 mt-4 text-sm font-medium text-white bg-green-600 border border-transparent rounded-md shadow-sm hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500" disabled={isLoading}>
              {isLoading ? 'Generating...' : 'Generate Photos'}
            </button>
          </div>
        )}
      </form>
    </div>
  );
};

export default DesignPanel;
