import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const HeroSection = () => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);

  const images = [
    'https://res.cloudinary.com/dv7i5i3ed/image/upload/v1759233345/WhatsApp_Image_2025-09-30_at_16.52.29_vlqlvc.jpg',
    'https://res.cloudinary.com/dv7i5i3ed/image/upload/v1759233582/WhatsApp_Image_2025-09-30_at_16.52.29_1_g6ev52.jpg',
    'https://res.cloudinary.com/dv7i5i3ed/image/upload/v1759233618/WhatsApp_Image_2025-09-30_at_16.52.29_2_cbofhd.jpg'
  ];

  useEffect(() => {
    setIsLoaded(true);
    
    // Auto-rotate images every 5 seconds
    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % images.length);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative h-[58vh] sm:h-[65vh] md:h-screen overflow-hidden bg-background">
      {/* Image Background */}
      <div className="absolute inset-0 w-full h-full">
        {/* Loading placeholder */}
        {!isLoaded && (
          <div className="absolute inset-0 bg-gradient-to-br from-black via-gray-900 to-black flex items-center justify-center">
            <div className="text-center space-y-4">
              <div className="w-16 h-16 border-4 border-accent border-t-transparent rounded-full animate-spin mx-auto"></div>
              <p className="text-white text-lg font-medium">Loading Experience...</p>
            </div>
          </div>
        )}

        {/* Image Carousel */}
        <div className="relative w-full h-full">
          {images.map((image, index) => (
            <img
              key={index}
              src={image}
              alt={`Hero ${index + 1}`}
              className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ${
                index === currentImageIndex ? 'opacity-100' : 'opacity-0'
              }`}
              onLoad={() => setIsLoaded(true)}
            />
          ))}
        </div>

        {/* Image Overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-black/20 z-10" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent z-10" />
      </div>

      {/* Content Overlay */}
      <div className="absolute inset-0 flex items-center z-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl">
            <div className="space-y-8 text-white">
              {/* Main Heading */}
              
            </div>
          </div>
        </div>
      </div>

      {/* Image Navigation Dots */}
      <div className="absolute bottom-24 left-1/2 transform -translate-x-1/2 z-20 flex gap-2">
        {images.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentImageIndex(index)}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
              index === currentImageIndex 
                ? 'bg-accent w-8' 
                : 'bg-white/50 hover:bg-white/80'
            }`}
            aria-label={`Go to image ${index + 1}`}
          />
        ))}
      </div>

      {/* Bottom Center Button */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20">
        <Link to="/collection-universe">
          <Button
            variant="default"
            size="lg"
            className="bg-gradient-to-r from-accent to-[#92b174] text-black hover:from-accent/90 hover:to-[#92b174]/90 px-8 py-4 text-lg font-semibold shadow-xl hover:shadow-2xl transition-all duration-300 group"
          >
            Explore Collection
            <Icon name="ArrowRight" size={24} className="ml-3 group-hover:translate-x-1 transition-transform duration-300" />
          </Button>
        </Link>
      </div>
    </section>
  );
};

export default HeroSection;