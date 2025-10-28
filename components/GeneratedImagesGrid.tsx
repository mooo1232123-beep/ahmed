
import React from 'react';
import { DownloadIcon, ImageIcon } from './icons';

interface GeneratedImagesGridProps {
  generatedImages: string[];
  originalFileName: string | undefined;
}

const GeneratedImagesGrid: React.FC<GeneratedImagesGridProps> = ({ generatedImages, originalFileName }) => {
  if (generatedImages.length === 0) {
    return (
      <div className="text-center text-gray-500 flex flex-col items-center">
        <ImageIcon />
        <p className="mt-2">ستظهر الصور التي تم إنشاؤها هنا</p>
      </div>
    );
  }
  
  const getFileName = (index: number) => {
    const name = originalFileName?.split('.')[0] || 'crochet-product';
    return `${name}-staged-${index + 1}.png`;
  }

  return (
    <div className="w-full">
      <h2 className="text-xl font-bold mb-4 text-gray-700 text-center">النتائج</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {generatedImages.map((image, index) => (
          <div key={index} className="relative group rounded-lg overflow-hidden shadow-md">
            <img src={image} alt={`Generated background ${index + 1}`} className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-all duration-300 flex items-center justify-center">
              <a
                href={image}
                download={getFileName(index)}
                className="opacity-0 group-hover:opacity-100 transform group-hover:scale-100 scale-90 transition-all duration-300 bg-white text-pink-600 rounded-full p-3 shadow-lg hover:bg-pink-100"
                aria-label="Download image"
              >
                <DownloadIcon />
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default GeneratedImagesGrid;
