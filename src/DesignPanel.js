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

const DesignPanel = ({ image, imageURL, onRenderGenerated, onLoadingChange, hasGeneratedRender, onGeneratePhotorealisticImage, isGeneratingPhotorealistic }) => {
  const [selectedTheme, setSelectedTheme] = useState(themes[0]);
  const [brandColor, setBrandColor] = useState('#000000');
  const [selectedFloorMaterial, setSelectedFloorMaterial] = useState(floorMaterials[0]);
  const [selectedWallMaterial, setSelectedWallMaterial] = useState(wallMaterials[0]);
  const [isLoading, setIsLoading] = useState(false);
  const [openSection, setOpenSection] = useState('theme');

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
      onGeneratePhotorealisticImage({
        theme: selectedTheme.name,
        brandColor,
        floorMaterial: selectedFloorMaterial.name,
        wallMaterial: selectedWallMaterial.name,
      });
    }
  };

  const Section = ({ title, id, children }) => (
    <div className="border-b border-gray-200">
      <button
        className="w-full flex justify-between items-center p-4 focus:outline-none"
        onClick={() => setOpenSection(openSection === id ? null : id)}
      >
        <h3 className="text-lg font-medium text-gray-800">{title}</h3>
        <svg xmlns="http://www.w3.org/2000/svg" className={`h-6 w-6 transform transition-transform ${openSection === id ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      {openSection === id && <div className="p-4">{children}</div>}
    </div>
  );

  return (
    <div className="w-full h-full bg-white flex flex-col">
      <div className="flex-1 overflow-y-auto">
        <Section title="Office Theme" id="theme">
          <div className="grid grid-cols-2 gap-4">
            {themes.map((theme) => (
              <button
                type="button"
                key={theme.name}
                onClick={() => setSelectedTheme(theme)}
                className={`flex flex-col items-center p-2 border rounded-lg ${selectedTheme.name === theme.name ? 'border-indigo-500' : 'border-gray-300'}`}>
                <div className="w-full h-24 bg-gray-200 rounded-md mb-2 flex items-center justify-center">
                    <img src={theme.icon} alt={theme.name} className="w-8 h-8" />
                </div>
                <span className="text-sm">{theme.name}</span>
              </button>
            ))}
          </div>
        </Section>
        <Section title="Brand Color" id="brand-color">
            <input type="color" id="brand-color" name="brand-color" value={brandColor} onChange={(e) => setBrandColor(e.target.value)} className="w-full h-10 px-3 py-2 mt-1 border border-gray-300 rounded-md" />
        </Section>
        <Section title="Floor Material" id="floor-material">
          <div className="grid grid-cols-2 gap-4">
            {floorMaterials.map((material) => (
              <button
                type="button"
                key={material.name}
                onClick={() => setSelectedFloorMaterial(material)}
                className={`flex flex-col items-center p-2 border rounded-lg ${selectedFloorMaterial.name === material.name ? 'border-indigo-500' : 'border-gray-300'}`}>
                <div className="w-full h-24 bg-gray-200 rounded-md mb-2 flex items-center justify-center">
                    <img src={material.icon} alt={material.name} className="w-8 h-8" />
                </div>
                <span className="text-sm">{material.name}</span>
              </button>
            ))}
          </div>
        </Section>
        <Section title="Wall Material" id="wall-material">
          <div className="grid grid-cols-2 gap-4">
            {wallMaterials.map((material) => (
              <button
                type="button"
                key={material.name}
                onClick={() => setSelectedWallMaterial(material)}
                className={`flex flex-col items-center p-2 border rounded-lg ${selectedWallMaterial.name === material.name ? 'border-indigo-500' : 'border-gray-300'}`}>
                <div className="w-full h-24 bg-gray-200 rounded-md mb-2 flex items-center justify-center">
                    <img src={material.icon} alt={material.name} className="w-8 h-8" />
                </div>
                <span className="text-sm">{material.name}</span>
              </button>
            ))}
          </div>
        </Section>
      </div>
      <div className="p-4 border-t border-gray-200 flex flex-row gap-2">
        {/* Make the two buttons of the same height */}
          <button type="submit" onClick={handleSubmit} className="w-full px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 h-20" disabled={isLoading}>
            {isLoading ? 'Generating...' : 'Generate 3D Render'}
          </button>
        {hasGeneratedRender && (
            <button type="button" onClick={handleGeneratePhotorealistic} className="w-full px-4 py-2 text-sm font-medium text-white bg-green-600 border border-transparent rounded-md shadow-sm hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 h-20" disabled={isGeneratingPhotorealistic || isLoading}>
              {isGeneratingPhotorealistic ? 'Generating photos...' : 'Generate Photos'}
            </button>
        )}
      </div>
    </div>
  );
};

export default DesignPanel;