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
  };

  const handleRenderGenerated = (render) => {
    setGeneratedRender(render);
    setIsGeneratingRender(false); // Render generation complete
  };

  const handleLoadingChange = (isLoading) => {
    setIsGeneratingRender(isLoading);
  };

  const handleGeneratePhotorealisticImage = async (designDetails) => {
    if (!generatedRender) {
      alert('Please generate a 3D render first.');
      return;
    }

    setIsGeneratingPhotorealistic(true);

    const prompts = [
      `Generate a hyper-realistic, professional photograph of a modern office space, exactly as per the supplied 3D model. Retain the seating arrangement, table top materials and textures, floor materials and textures, wall materials and texture as per the 3D render. The camera is positioned at eye-level, approximately 6 feet from the ground, capturing the perspective of someone walking into the office and seeing the main workstation area. The design follows a [${designDetails.theme}] aesthetic, with the brand's signature [${designDetails.brandColor}] subtly integrated into the decor like privacy screens between the workstations. Add some lively posters on the hard walls (i.e.) non partition walls. Overhead, the ceiling is detailed with sleek, black AC ducts, discreet WiFi access points, and contemporary lighting that casts a warm, inviting glow. Lush potted plants are strategically placed to bring life and color to the environment. Important: The final output must be a photograph, not a 3D rendering. Ensure all labels from the 3D model are removed. The composition should be horizontal and at human eye-level, avoiding any high-angle or aerial perspectives. `,
      `Generate a hyper-realistic, professional photograph of a modern office space, exactly as per the supplied 3D model. Retain the seating arrangement, table top materials and textures, floor materials and textures, wall materials and texture as per the 3D render. The camera is positioned at eye-level, approximately 6 feet from the ground, capturing the perspective of someone walking into the office and seeing the main collaboration or collab or meeting room. Collaboration areas are labeled "Colab Area" or "Collaboration Area" in the 3D Render. Meting rooms are labled "PAX Meeting" or "Meeting Room" in the 3D render. The design follows a [${designDetails.theme}] aesthetic, with the brand's signature [${designDetails.brandColor}] subtly integrated into the decor like privacy screens between the workstations. Add some lively posters on the hard walls (i.e.) non partition walls. Overhead, the ceiling is detailed with sleek, black AC ducts, discreet WiFi access points, and contemporary lighting that casts a warm, inviting glow. Lush potted plants are strategically placed to bring life and color to the environment. Important: The final output must be a photograph, not a 3D rendering. Ensure all labels from the 3D model are removed. The composition should be horizontal and at human eye-level, avoiding any high-angle or aerial perspectives. `,
      // `You are an expert 3D designer. You will be given a 3D render. Your task is to generate a photorealistic landscape image of the office space from the horizontal perspective of a human as they enter one of the cabins. Keep the angle of view to that of a human of height 6 feet. Add humans working in this office. Add AC ducts and WiFi devices on the roof. Remove all labels from the 3D render. Make the AC ducts black in color. Also add lighting fixtures. The office theme is ${designDetails.theme}. Stick to te element of the 3D render. Do not create new elements. Stick to the theme. Dont generate an aereal view. `
    ];

    setPhotorealisticImages(Array(prompts.length).fill(null));

    const promises = prompts.map((prompt, index) =>
      generatePhotorealisticImage({
        image: generatedRender,
        prompt: prompt,
      }).then(photoImage => {
        setPhotorealisticImages(prevImages => {
          const newImages = [...prevImages];
          newImages[index] = photoImage;
          return newImages;
        });
      }).catch(error => {
        console.error(`Error generating photorealistic image ${index + 1}:`, error);
        setPhotorealisticImages(prevImages => {
          const newImages = [...prevImages];
          newImages[index] = 'error';
          return newImages;
        });
      })
    );

    await Promise.all(promises);
    setIsGeneratingPhotorealistic(false);
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
      {/* Design Panel */}
      <div className={`design-panel ${isDesignPanelOpen ? 'open' : 'closed'} h-screen`}>
        <DesignPanel
          image={uploadedImage}
          imageURL={uploadedImageURL}
          onRenderGenerated={handleRenderGenerated}
          onLoadingChange={handleLoadingChange}
          hasGeneratedRender={!!generatedRender}
          onGeneratePhotorealisticImage={handleGeneratePhotorealisticImage}
          isGeneratingPhotorealistic={isGeneratingPhotorealistic}
        />
      </div>

      {/* Main Content */}
      <div className="main-content flex-1 flex flex-col">
        {/* Header */}
        <header className="app-header flex justify-between items-center p-4">
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
          {photorealisticImages.length > 0 && (
            <div className="carousel-item">
              <PhotorealisticImageOutput photorealisticImages={photorealisticImages} onImageClick={handleImageClick} />
            </div>
          )}
        </div>
      </div>

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