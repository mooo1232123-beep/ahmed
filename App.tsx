import React, { useState, useCallback } from 'react';
import { generateImageWithPrompt } from './services/geminiService';
import ImageUploader from './components/ImageUploader';
import StyleSelector from './components/StyleSelector';
import GeneratedImagesGrid from './components/GeneratedImagesGrid';
import Loader from './components/Loader';
import { PREDEFINED_STYLES } from './constants';
import type { UploadedImage } from './types';
import { GithubIcon } from './components/icons';

const App: React.FC = () => {
  const [originalImage, setOriginalImage] = useState<UploadedImage | null>(null);
  const [generatedImages, setGeneratedImages] = useState<string[]>([]);
  const [customPrompt, setCustomPrompt] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleImageUpload = (image: UploadedImage) => {
    setOriginalImage(image);
    setGeneratedImages([]);
    setError(null);
  };

  const handleGeneration = useCallback(async () => {
    if (!originalImage) {
      setError('يرجى تحميل صورة أولاً.');
      return;
    }

    setIsLoading(true);
    setGeneratedImages([]);
    setError(null);

    const promptsToRun = customPrompt ? [customPrompt] : PREDEFINED_STYLES.map(style => style.prompt);
    
    const generationPromises = promptsToRun.map(prompt => 
      generateImageWithPrompt(originalImage.base64, originalImage.file.type, prompt)
    );

    const results = await Promise.allSettled(generationPromises);

    const successfulImages: string[] = [];
    let hasError = false;

    // FIX: Handle rejected promises from Promise.allSettled correctly.
    // The 'reason' property is only available on rejected promises, so we must check the 'status'.
    results.forEach(result => {
      if (result.status === 'fulfilled' && result.value) {
        successfulImages.push(result.value);
      } else {
        hasError = true;
        if (result.status === 'rejected') {
          console.error('Generation failed:', result.reason);
        } else {
          console.error('Generation failed: result was fulfilled but value is null.');
        }
      }
    });

    setGeneratedImages(successfulImages);

    if (hasError && successfulImages.length === 0) {
      setError('فشل إنشاء الصور. قد تكون الصورة غير واضحة أو أن هناك مشكلة في الخدمة. حاول مرة أخرى.');
    }

    setIsLoading(false);
  }, [originalImage, customPrompt]);

  return (
    <div className="min-h-screen bg-pink-50 text-gray-800 flex flex-col items-center p-4 sm:p-6 md:p-8">
      <header className="w-full max-w-5xl text-center mb-8">
        <h1 className="text-4xl sm:text-5xl font-bold text-pink-600">مولّد خلفيات صور الكروشيه</h1>
        <p className="mt-2 text-lg text-gray-600">حوّل صور منتجاتك بخلفيات احترافية من صنع الذكاء الاصطناعي</p>
      </header>

      <main className="w-full max-w-5xl flex-grow">
        <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="flex flex-col space-y-6">
              <ImageUploader onImageUpload={handleImageUpload} />
              {originalImage && (
                <StyleSelector 
                  customPrompt={customPrompt} 
                  onCustomPromptChange={setCustomPrompt} 
                />
              )}
            </div>

            <div className="flex flex-col">
              <div className="flex-grow bg-gray-50 rounded-lg p-4 min-h-[300px] flex items-center justify-center">
                {isLoading ? (
                  <Loader />
                ) : (
                  <GeneratedImagesGrid generatedImages={generatedImages} originalFileName={originalImage?.file.name} />
                )}
              </div>
            </div>
          </div>
          
          {originalImage && (
            <div className="mt-8 text-center">
              <button
                onClick={handleGeneration}
                disabled={isLoading}
                className="w-full sm:w-auto bg-pink-600 text-white font-bold py-3 px-10 rounded-full hover:bg-pink-700 focus:outline-none focus:ring-4 focus:ring-pink-300 transition-all duration-300 ease-in-out disabled:bg-gray-400 disabled:cursor-not-allowed transform hover:scale-105"
              >
                {isLoading ? '...جاري الإنشاء' : '✨ إنشاء الخلفيات'}
              </button>
              {error && <p className="text-red-500 mt-4">{error}</p>}
            </div>
          )}
        </div>
      </main>

      <footer className="w-full max-w-5xl text-center mt-8 py-4 text-gray-500">
        <p>
          تم إنشاؤه بواسطة الذكاء الاصطناعي. قد تكون الصور غير دقيقة في بعض الأحيان.
        </p>
        <a href="https://github.com/google/genai-api" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 mt-2 hover:text-pink-600 transition-colors">
            <GithubIcon />
            <span>View on GitHub</span>
        </a>
      </footer>
    </div>
  );
};

export default App;