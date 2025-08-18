import React from 'react';
import Image from '../../../components/AppImage';
import Button from '../../../components/ui/Button';

const CollectionHero = ({ collection }) => {
  return (
    <div className="relative h-[70vh] min-h-[500px] overflow-hidden bg-muted">
      <Image
        src={collection.heroImage}
        alt={collection.name}
        className="absolute inset-0 w-full h-full object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/30 to-transparent" />
      
      <div className="relative h-full flex items-center">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl">
            <div className="mb-4">
              <span className="inline-block px-3 py-1 bg-accent/20 backdrop-blur-sm text-accent text-sm font-medium rounded-full">
                {collection.season} Collection
              </span>
            </div>
            
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-serif font-bold text-white mb-6 leading-tight">
              {collection.name}
            </h1>
            
            <p className="text-lg sm:text-xl text-white/90 mb-8 leading-relaxed">
              {collection.description}
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <Button 
                variant="default" 
                size="lg"
                className="bg-white text-black hover:bg-white/90"
              >
                Explore Collection
              </Button>
              
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CollectionHero;