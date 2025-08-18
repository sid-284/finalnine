import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';
import Button from '../../../components/ui/Button';
import { convertUSDToINR, formatINR } from '../../../utils/currency';

const NewArrivals = () => {
  const [hoveredItem, setHoveredItem] = useState(null);

  const newArrivals = [
    {
      id: 1,
      name: "Structured Wool Coat",
      brand: "Atelier Noir",
      price: 1899,
      originalPrice: null,
      image: "https://images.unsplash.com/photo-1544022613-e87ca75a784a?w=400&h=500&fit=crop&crop=center",
      hoverImage: "https://images.unsplash.com/photo-1445205170230-053b83016050?w=400&h=500&fit=crop&crop=center",
      colors: ["#000000", "#2C2C2C", "#8B4513"],
      sizes: ["XS", "S", "M", "L", "XL"],
      isNew: true,
      isSustainable: true,
      stylingTip: "Perfect with tailored trousers and ankle boots"
    },
    {
      id: 2,
      name: "Silk Blouse",
      brand: "Ethereal",
      price: 649,
      originalPrice: null,
      image: "https://images.pexels.com/photos/1536619/pexels-photo-1536619.jpeg?w=400&h=500&fit=crop&crop=center",
      hoverImage: "https://images.pexels.com/photos/7679720/pexels-photo-7679720.jpeg?w=400&h=500&fit=crop&crop=center",
      colors: ["#FFFFFF", "#F5F5DC", "#FFB6C1"],
      sizes: ["XS", "S", "M", "L"],
      isNew: true,
      isSustainable: false,
      stylingTip: "Tuck into high-waisted skirts or wear loose over denim"
    },
    {
      id: 3,
      name: "Cashmere Cardigan",
      brand: "Nordic Luxe",
      price: 899,
      originalPrice: null,
              image: "https://images.unsplash.com/photo-1552374196-1ab2a1c593e8?w=400&h=500&fit=crop&crop=center",
      hoverImage: "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=400&h=500&fit=crop&crop=center",
      colors: ["#F5F5DC", "#D2B48C", "#8B7355"],
      sizes: ["S", "M", "L", "XL"],
      isNew: true,
      isSustainable: true,
      stylingTip: "Layer over dresses or wear with matching knit sets"
    },
    {
      id: 4,
      name: "Pleated Midi Skirt",
      brand: "Metropolitan",
      price: 459,
      originalPrice: null,
      image: "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=400&h=500&fit=crop&crop=center",
      hoverImage: "https://images.unsplash.com/photo-1544022613-e87ca75a784a?w=400&h=500&fit=crop&crop=center",
      colors: ["#000000", "#2F4F4F", "#8B4B4B"],
      sizes: ["XS", "S", "M", "L"],
      isNew: true,
      isSustainable: false,
      stylingTip: "Style with fitted tops and statement accessories"
    },
    {
      id: 5,
      name: "Leather Ankle Boots",
      brand: "Artisan Craft",
      price: 799,
      originalPrice: null,
      image: "https://images.pexels.com/photos/7679720/pexels-photo-7679720.jpeg?w=400&h=500&fit=crop&crop=center",
              hoverImage: "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=400&h=500&fit=crop&crop=center",
      colors: ["#8B4513", "#000000", "#2F4F4F"],
      sizes: ["36", "37", "38", "39", "40", "41"],
      isNew: true,
      isSustainable: true,
      stylingTip: "Versatile with dresses, jeans, or tailored pants"
    },
    {
      id: 6,
      name: "Merino Wool Sweater",
      brand: "Scandinavian",
      price: 549,
      originalPrice: null,
      image: "https://images.unsplash.com/photo-1445205170230-053b83016050?w=400&h=500&fit=crop&crop=center",
      hoverImage: "https://images.pexels.com/photos/1536619/pexels-photo-1536619.jpeg?w=400&h=500&fit=crop&crop=center",
      colors: ["#FFFFFF", "#F5F5DC", "#D3D3D3"],
      sizes: ["XS", "S", "M", "L", "XL"],
      isNew: true,
      isSustainable: true,
      stylingTip: "Perfect for layering or wearing solo with statement jewelry"
    }
  ];

  return (
    <section className="py-16 lg:py-24 bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12 lg:mb-16">
          <div className="space-y-4">
            <p className="text-sm font-medium tracking-wider uppercase text-muted-foreground">
              New Arrivals
            </p>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-semibold text-foreground">
              Fresh Perspectives on Timeless Style
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Discover the latest additions to our curated collection, where contemporary design meets enduring craftsmanship.
            </p>
          </div>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 mb-12">
          {newArrivals.map((item) => (
            <div
              key={item.id}
              className="group cursor-pointer"
              onMouseEnter={() => setHoveredItem(item.id)}
              onMouseLeave={() => setHoveredItem(null)}
            >
              <Link to={`/product-detail?id=${item.id}`} className="block">
                <div className="relative overflow-hidden rounded-lg bg-card">
                  {/* Product Image */}
                  <div className="aspect-[3/4] overflow-hidden">
                    <Image
                      src={hoveredItem === item.id ? item.hoverImage : item.image}
                      alt={item.name}
                      className="w-full h-full object-cover transition-all duration-500 ease-luxury group-hover:scale-105"
                    />
                  </div>

                  {/* Badges */}
                  <div className="absolute top-3 left-3 flex flex-col space-y-2">
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

                  {/* Styling Tip Overlay */}
                  <div className={`absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent p-4 text-white transform transition-transform duration-300 ${
                    hoveredItem === item.id ? 'translate-y-0' : 'translate-y-full'
                  }`}>
                    <div className="space-y-2">
                      <p className="text-xs font-medium opacity-90">Styling Tip</p>
                      <p className="text-sm leading-relaxed">{item.stylingTip}</p>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-white hover:text-accent hover:bg-white/20 p-0 h-auto font-medium"
                      >
                        Quick Add
                        <Icon name="Plus" size={14} className="ml-1" />
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Product Info */}
                <div className="pt-4 space-y-2">
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-muted-foreground font-medium">
                      {item.brand}
                    </p>
                    <div className="flex items-center space-x-1">
                      {item.colors.slice(0, 3).map((color, index) => (
                        <div
                          key={index}
                          className="w-3 h-3 rounded-full border border-border"
                          style={{ backgroundColor: color }}
                        />
                      ))}
                      {item.colors.length > 3 && (
                        <span className="text-xs text-muted-foreground">
                          +{item.colors.length - 3}
                        </span>
                      )}
                    </div>
                  </div>
                  
                  <h3 className="font-medium text-foreground group-hover:text-accent transition-colors duration-200">
                    {item.name}
                  </h3>
                  
                  <div className="flex items-center justify-between">
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
                    
                    <div className="flex items-center space-x-1 text-xs text-muted-foreground">
                      <span>{item.sizes.length} sizes</span>
                    </div>
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
              Explore All New Arrivals
              <Icon name="ArrowRight" size={20} className="ml-2" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default NewArrivals;