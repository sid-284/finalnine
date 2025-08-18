import React from 'react';
import { Link } from 'react-router-dom';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';
import { convertUSDToINR, formatINR } from '../../../utils/currency';
import Button from '../../../components/ui/Button';

const CuratedSection = () => {
  const curatedItems = [
    {
      id: 1,
      name: "Cashmere Blend Coat",
      brand: "Atelier Moderne",
      price: 1299,
      originalPrice: 1599,
      image: "https://images.unsplash.com/photo-1544022613-e87ca75a784a?w=400&h=500&fit=crop&crop=center",
      badge: "Editor\'s Choice",
      colors: ["#2C2C2C", "#8B4513", "#000080"],
      isNew: false,
      isSustainable: true
    },
    {
      id: 2,
      name: "Silk Midi Dress",
      brand: "Ethereal Studio",
      price: 899,
      originalPrice: null,
      image: "https://images.pexels.com/photos/1536619/pexels-photo-1536619.jpeg?w=400&h=500&fit=crop&crop=center",
      badge: "Trending",
      colors: ["#8B4B4B", "#2F4F4F", "#D2691E"],
      isNew: true,
      isSustainable: false
    },
    {
      id: 3,
      name: "Merino Wool Sweater",
      brand: "Nordic Craft",
      price: 459,
      originalPrice: null,
              image: "https://images.unsplash.com/photo-1552374196-1ab2a1c593e8?w=400&h=500&fit=crop&crop=center",
      badge: "Sustainable",
      colors: ["#F5F5DC", "#708090", "#2F4F4F"],
      isNew: false,
      isSustainable: true
    },
    {
      id: 4,
      name: "Tailored Blazer",
      brand: "Metropolitan",
      price: 799,
      originalPrice: 999,
      image: "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=400&h=500&fit=crop&crop=center",
      badge: "Classic",
      colors: ["#000000", "#2C2C2C", "#8B8B8B"],
      isNew: false,
      isSustainable: false
    }
  ];

  return (
    <section className="py-16 lg:py-24 bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12 lg:mb-16">
          <div className="space-y-4">
            <p className="text-sm font-medium tracking-wider uppercase text-muted-foreground">
              Curated for You
            </p>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-semibold text-foreground">
              Personal Style Recommendations
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Discover pieces selected specifically for your style profile, combining your preferences with our expert curation.
            </p>
          </div>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8 mb-12">
          {curatedItems.map((item) => (
            <div
              key={item.id}
              className="group cursor-pointer"
            >
              <Link to={`/product-detail?id=${item.id}`} className="block">
                <div className="relative overflow-hidden rounded-lg bg-card">
                  {/* Product Image */}
                  <div className="aspect-[3/4] overflow-hidden">
                    <Image
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-luxury"
                    />
                  </div>

                  {/* Badges */}
                  <div className="absolute top-3 left-3 flex flex-col space-y-2">
                    {item.badge && (
                      <span className="px-2 py-1 text-xs font-medium bg-accent text-accent-foreground rounded-full">
                        {item.badge}
                      </span>
                    )}
                    {item.isNew && (
                      <span className="px-2 py-1 text-xs font-medium bg-foreground text-background rounded-full">
                        New
                      </span>
                    )}
                    {item.isSustainable && (
                      <span className="px-2 py-1 text-xs font-medium bg-success text-success-foreground rounded-full">
                        Sustainable
                      </span>
                    )}
                  </div>

                  {/* Quick Actions */}
                  <div className="absolute top-3 right-3 flex flex-col space-y-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <button className="w-8 h-8 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center text-foreground hover:bg-white transition-colors duration-200">
                      <Icon name="Heart" size={16} />
                    </button>
                    <button className="w-8 h-8 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center text-foreground hover:bg-white transition-colors duration-200">
                      <Icon name="Eye" size={16} />
                    </button>
                  </div>

                  {/* Hover Overlay */}
                  <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>

                {/* Product Info */}
                <div className="pt-4 space-y-2">
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-muted-foreground font-medium">
                      {item.brand}
                    </p>
                    <div className="flex items-center space-x-1">
                      {item.colors.map((color, index) => (
                        <div
                          key={index}
                          className="w-3 h-3 rounded-full border border-border"
                          style={{ backgroundColor: color }}
                        />
                      ))}
                    </div>
                  </div>
                  
                  <h3 className="font-medium text-foreground group-hover:text-accent transition-colors duration-200">
                    {item.name}
                  </h3>
                  
                  <div className="flex items-center space-x-2">
                    <span className="text-lg font-semibold text-foreground">
                      {formatINR(convertUSDToINR(item.price))}
                    </span>
                    {item.originalPrice && (
                      <span className="text-sm text-muted-foreground line-through">
                        {formatINR(convertUSDToINR(item.originalPrice))}
                      </span>
                    )}
                  </div>
                </div>
              </Link>
            </div>
          ))}
        </div>

        {/* View All Button */}
        <div className="text-center">
          <Link to="/collection-universe">
            <Button
              variant="outline"
              size="lg"
              className="px-8 py-3"
            >
              View All Recommendations
              <Icon name="ArrowRight" size={20} className="ml-2" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default CuratedSection;