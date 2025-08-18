import React from 'react';
import Image from '../../../components/AppImage';
import Icon from '../../../components/AppIcon';

const DesignerSpotlight = ({ designer }) => {
  return (
    <div className="bg-card py-16 lg:py-24">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          <div className="order-2 lg:order-1">
            <div className="mb-6">
              <span className="text-accent text-sm font-medium uppercase tracking-wider">
                Designer Spotlight
              </span>
            </div>
            
            <h2 className="text-3xl lg:text-4xl font-serif font-bold text-foreground mb-6">
              Meet {designer.name}
            </h2>
            
            <div className="prose prose-lg max-w-none">
              <p className="text-muted-foreground leading-relaxed mb-6">
                {designer.bio}
              </p>
              
              <blockquote className="border-l-4 border-accent pl-6 font-italic text-lg text-foreground mb-8">
                "{designer.quote}"
              </blockquote>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <Icon name="MapPin" size={20} className="text-accent" />
                <span className="text-muted-foreground">{designer.location}</span>
              </div>
              
              <div className="flex items-center space-x-3">
                <Icon name="Calendar" size={20} className="text-accent" />
                <span className="text-muted-foreground">Founded {designer.founded}</span>
              </div>
              
              <div className="flex items-center space-x-3">
                <Icon name="Award" size={20} className="text-accent" />
                <span className="text-muted-foreground">{designer.awards} Awards</span>
              </div>
            </div>
            
            <div className="mt-8 flex flex-wrap gap-2">
              {designer.specialties.map((specialty, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-muted text-muted-foreground text-sm rounded-full"
                >
                  {specialty}
                </span>
              ))}
            </div>
          </div>
          
          <div className="order-1 lg:order-2">
            <div className="relative">
              <Image
                src={designer.image}
                alt={designer.name}
                className="w-full h-[500px] object-cover rounded-lg"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent rounded-lg" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DesignerSpotlight;