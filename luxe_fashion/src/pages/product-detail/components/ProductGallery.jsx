import React, { useState } from 'react';
import Image from '../../../components/AppImage';
import Icon from '../../../components/AppIcon';

const ProductGallery = ({ images, productName }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false);

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const toggleZoom = () => {
    setIsZoomed(!isZoomed);
  };

  return (
    <div className="space-y-4">
      {/* Main Image */}
      <div className="relative bg-muted rounded-lg overflow-hidden group">
        <div 
          className={`relative transition-transform duration-300 ${
            isZoomed ? 'scale-150 cursor-zoom-out' : 'cursor-zoom-in'
          }`}
          onClick={toggleZoom}
        >
          <Image
            src={images[currentImageIndex]}
            alt={`${productName} - View ${currentImageIndex + 1}`}
            className="w-full h-96 md:h-[600px] object-cover"
          />
        </div>
        
        {/* Navigation Arrows */}
        {images.length > 1 && (
          <>
            <button
              onClick={prevImage}
              className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-background/80 backdrop-blur-sm rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 hover:bg-background"
            >
              <Icon name="ChevronLeft" size={20} />
            </button>
            <button
              onClick={nextImage}
              className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-background/80 backdrop-blur-sm rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 hover:bg-background"
            >
              <Icon name="ChevronRight" size={20} />
            </button>
          </>
        )}

        {/* Image Counter */}
        <div className="absolute bottom-4 right-4 bg-background/80 backdrop-blur-sm px-3 py-1 rounded-full text-sm">
          {currentImageIndex + 1} / {images.length}
        </div>

        {/* Zoom Indicator */}
        <div className="absolute top-4 right-4 bg-background/80 backdrop-blur-sm p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <Icon name={isZoomed ? "ZoomOut" : "ZoomIn"} size={16} />
        </div>
      </div>

      {/* Thumbnail Gallery */}
      <div className="flex space-x-2 overflow-x-auto scrollbar-hide">
        {images.map((image, index) => (
          <button
            key={index}
            onClick={() => setCurrentImageIndex(index)}
            className={`flex-shrink-0 w-16 h-16 md:w-20 md:h-20 rounded-lg overflow-hidden border-2 transition-colors duration-300 ${
              index === currentImageIndex
                ? 'border-accent' :'border-transparent hover:border-muted-foreground/30'
            }`}
          >
            <Image
              src={image}
              alt={`${productName} thumbnail ${index + 1}`}
              className="w-full h-full object-cover"
            />
          </button>
        ))}
      </div>

      {/* 360 View Button */}
      <button className="w-full py-3 border border-border rounded-lg hover:bg-muted/50 transition-colors duration-300 flex items-center justify-center space-x-2">
        <Icon name="RotateCcw" size={18} />
        <span className="text-sm font-medium">360° View</span>
      </button>
    </div>
  );
};

export default ProductGallery;