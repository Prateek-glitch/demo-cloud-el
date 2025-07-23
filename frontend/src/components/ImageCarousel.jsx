// src/components/ImageCarousel.jsx
import React, { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

function ImageCarousel({ images }) {
  const [currentIndex, setCurrentIndex] = useState(0);

  if (!images || images.length === 0) {
    return null;
  }

  const goToNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
  };

  const goToPrev = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + images.length) % images.length);
  };

  if (images.length === 1) {
    return (
      <img src={images[0]} alt="Note image" className="w-full rounded-md object-cover max-h-52" />
    );
  }

  return (
    <div className="relative w-full h-52 rounded-md overflow-hidden group">
      <img
        src={images[currentIndex]}
        alt={`Note image ${currentIndex + 1}`}
        className="w-full h-full object-cover transition-opacity duration-300"
      />
      {images.length > 1 && (
        <>
          <button
            onClick={goToPrev}
            className="absolute left-1 top-1/2 -translate-y-1/2 p-1 bg-black bg-opacity-40 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200"
          >
            <ChevronLeft size={20} />
          </button>
          <button
            onClick={goToNext}
            className="absolute right-1 top-1/2 -translate-y-1/2 p-1 bg-black bg-opacity-40 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200"
          >
            <ChevronRight size={20} />
          </button>
          <div className="absolute bottom-2 left-0 right-0 flex justify-center gap-1">
            {images.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentIndex(idx)}
                className={`w-2 h-2 rounded-full ${
                  currentIndex === idx ? 'bg-white' : 'bg-gray-400'
                }`}
              ></button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

export default ImageCarousel;