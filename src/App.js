import React, { useState } from 'react';
import './App.css';
import FloorPlanUpload from './FloorPlanUpload';
import DesignPanel from './DesignPanel';
import RenderOutput from './RenderOutput';
import SkeletonLoader from './SkeletonLoader';
import FullScreenImageViewer from './FullScreenImageViewer';
import PhotorealisticImageOutput from './PhotorealisticImageOutput';
import { generatePhotorealisticImage } from './gemini';

function App() {
  const [uploadedImage, setUploadedImage] = useState(null);
  const [uploadedImageURL, setUploadedImageURL] = useState(null);
  const [generatedRender, setGeneratedRender] = useState(null);
  const [photorealisticImages, setPhotorealisticImages] = useState([]); // Changed to array
  const [isDesignPanelOpen, setIsDesignPanelOpen] = useState(true);
  const [isGeneratingRender, setIsGeneratingRender] = useState(false);
  const [isGeneratingPhotorealistic, setIsGeneratingPhotorealistic] = useState(false);
  const [fullScreenImage, setFullScreenImage] = useState(null);

  const handleImageUpload = (image, imageURL) => {
    setUploadedImage(image);
    setUploadedImageURL(imageURL);
    setGeneratedRender(null); // Clear previous render when new image is uploaded
    setPhotorealisticImages([]); // Clear previous photorealistic images
    setIsGeneratingRender(false); // Reset loading state
    setIsGeneratingPhotorealistic(false); // Reset photorealistic loading state
  };

  const handleRenderGenerated = (render) => {
    setGeneratedRender(render);
    setIsGeneratingRender(false); // Render generation complete
  };

  const handleLoadingChange = (isLoading) => {
    setIsGeneratingRender(isLoading);
  };

  const handleGeneratePhotorealisticImage = async () => {
    if (!generatedRender) {
      alert('Please generate a 3D render first.');
      return;
    }
    setIsGeneratingPhotorealistic(true); // Set loading state for photorealistic image
    setPhotorealisticImages([]); // Clear previous photorealistic images

    // const prompts = [
    //   "Generate a photorealistic image of the office space when a human has just entered the office. Add humans working in this office. Add AC ducts and WiFi devices on the roof. Make the AC ducts black in color. Also add lighting fixtures. Add some potted plants.",
    //   "Generate a photorealistic image of one of the rooms in the office space. Add humans working in this office. Add AC ducts and WiFi devices on the roof. Make the AC ducts black in color. Also add lighting fixtures. Add some potted plants.",
    //   "Generate a photorealistic image of the office space from one of the corners. Add humans working in this office. Add AC ducts and WiFi devices on the roof. Make the AC ducts black in color. Also add lighting fixtures. Add some potted plants."
    // ];
    const prompts = [
      "You are an expert 3D designer. You will be given a 3D render. Your task is to generate a photorealistic image of the office space from the perspective of a human when they has just entered the office. Keep the angle of view to that of a human of height 6 feet. Add humans working in this office. Add AC ducts and WiFi devices on the roof. Remove all labels from the 3D render. Make the AC ducts black in color. Also add lighting fixtures. Add some potted plants.",
      // "Generate a photorealistic image of one of the rooms in the office space. Add humans working in this office. Add AC ducts and WiFi devices on the roof. Make the AC ducts black in color. Also add lighting fixtures. Add some potted plants."
    ];

    const generatedImages = [];
    for (const prompt of prompts) {
      try {
        const photoImage = await generatePhotorealisticImage({
          image: generatedRender,
          prompt: prompt
        });
        generatedImages.push(photoImage);
      } catch (error) {
        console.error("Error generating photorealistic image:", error);
        alert("An error occurred while generating a photorealistic image. Please check the console for more details.");
        // Continue to next prompt even if one fails
      }
    }
    setPhotorealisticImages(generatedImages);
    setIsGeneratingPhotorealistic(false); // Reset loading state for photorealistic image
  };

  const toggleDesignPanel = () => {
    setIsDesignPanelOpen(!isDesignPanelOpen);
  };

  const handleImageClick = (imageUrl) => {
    setFullScreenImage(imageUrl);
  };

  const handleCloseFullScreen = () => {
    setFullScreenImage(null);
  };

  const handleDownloadImage = (imageUrl) => {
    const link = document.createElement('a');
    link.href = imageUrl;
    link.download = 'photorealistic_image.jpeg'; // You can make this dynamic if needed
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="App flex h-screen">
      {/* Main Content */}
      <div className="main-content flex-1 flex flex-col">
        {/* Header */}
        <header className="app-header flex justify-between items-center p-4 bg-gray-800 text-white">
          <h1 className="text-xl font-bold">Office Visualizer</h1>
        </header>

        {/* Image Carousel */}
        <div className="image-carousel flex-1 overflow-y-auto p-4">
          <div className="carousel-item mb-8">
            <FloorPlanUpload onImageUpload={handleImageUpload} />
          </div>
          {isGeneratingRender ? (
            <div className="carousel-item">
              <SkeletonLoader />
            </div>
          ) : generatedRender && (
            <div className="carousel-item">
              <RenderOutput generatedRender={generatedRender} onImageClick={handleImageClick} />
            </div>
          )}
          {isGeneratingPhotorealistic ? (
            <div className="carousel-item">
              <SkeletonLoader />
            </div>
          ) : photorealisticImages.length > 0 && (
            <div className="carousel-item">
              <PhotorealisticImageOutput photorealisticImages={photorealisticImages} onImageClick={handleImageClick} />
            </div>
          )}
        </div>
      </div>

      {/* Design Panel */}
      <div className={`design-panel ${isDesignPanelOpen ? 'open' : 'closed'} h-screen`}>
        <DesignPanel
          image={uploadedImage}
          imageURL={uploadedImageURL}
          onRenderGenerated={handleRenderGenerated}
          onLoadingChange={handleLoadingChange}
          hasGeneratedRender={!!generatedRender}
          onGeneratePhotorealisticImage={handleGeneratePhotorealisticImage}
        />
      </div>

      {/* Floating Design Toggle Button */}
      <button onClick={toggleDesignPanel} className="floating-design-toggle-button fixed bottom-8 right-8 bg-blue-500 hover:bg-blue-700 text-white p-3 rounded-full shadow-lg flex items-center justify-center">
        {isDesignPanelOpen ? (
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        ) : (
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9.53 16.122a3 3 0 00-5.78 1.128 2.25 2.25 0 01-2.4 2.245 4.5 4.5 0 008.4-2.245c.39-.091.654-.352.8-.659l2.288-5.29A6.5 6.5 0 0018 6.75h-.75a.75.75 0 00-1.5 0v.75H15a.75.75 0 000 1.5h.75v.75a.75.75 0 001.5 0v-.75h.75c.723 0 1.426.14 2.087.42A4.5 4.5 0 0022.5 18.75c0-2.071-1.122-4.01-2.831-5.099l-2.288-5.29a4.5 4.5 0 00-7.044-2.064L9.53 16.122z" />
          </svg>
        )}
      </button>

      {fullScreenImage && (
        <FullScreenImageViewer
          imageUrl={fullScreenImage}
          onClose={handleCloseFullScreen}
          onDownload={handleDownloadImage}
        />
      )}
    </div>
  );
}

export default App;
