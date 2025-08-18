import React from 'react';
import Image from '../../../components/AppImage';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import { convertUSDToINR, formatINR } from '../../../utils/currency';

const StyleItSection = () => {
  const stylingExamples = [
    {
      id: 1,
      title: "Office Elegance",
      description: "Perfect for professional settings with a touch of sophistication",
      image: "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=400&h=500&fit=crop",
      user: {
        name: "Sarah Chen",
        avatar: "https://randomuser.me/api/portraits/women/32.jpg",
        verified: true
      },
      likes: 234,
      products: [
        { name: "Silk Blouse", price: 1180 },
        { name: "Tailored Trousers", price: 1220 },
        { name: "Leather Pumps", price: 1160 }
      ]
    },
    {
      id: 2,
      title: "Weekend Casual",
      description: "Effortless style for relaxed days with friends",
      image: "https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=400&h=500&fit=crop",
      user: {
        name: "Emma Rodriguez",
        avatar: "https://randomuser.me/api/portraits/women/45.jpg",
        verified: false
      },
      likes: 189,
      products: [
        { name: "Cashmere Sweater", price: 1280 },
        { name: "Denim Jeans", price: 1150 },
        { name: "Sneakers", price: 1120 }
      ]
    },
    {
      id: 3,
      title: "Evening Glamour",
      description: "Statement pieces for special occasions",
      image: "https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=400&h=500&fit=crop",
      user: {
        name: "Professional Stylist",
        avatar: "https://randomuser.me/api/portraits/women/28.jpg",
        verified: true
      },
      likes: 456,
      products: [
        { name: "Silk Dress", price: 1420 },
        { name: "Statement Earrings", price: 1085 },
        { name: "Evening Clutch", price: 1180 }
      ]
    },
    {
      id: 4,
      title: "Minimalist Chic",
      description: "Clean lines and neutral tones for timeless appeal",
      image: "https://images.unsplash.com/photo-1487222477894-8943e31ef7b2?w=400&h=500&fit=crop",
      user: {
        name: "Alex Kim",
        avatar: "https://randomuser.me/api/portraits/women/19.jpg",
        verified: true
      },
      likes: 312,
      products: [
        { name: "Wool Coat", price: 1380 },
        { name: "Turtleneck", price: 1095 },
        { name: "Ankle Boots", price: 1240 }
      ]
    }
  ];

  return (
    <div className="bg-muted py-16 lg:py-24">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl lg:text-4xl font-serif font-bold text-foreground mb-4">
            Style It Your Way
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Get inspired by our community and professional stylists. See how others style pieces from this collection.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {stylingExamples.map((example) => (
            <div key={example.id} className="bg-card rounded-lg overflow-hidden shadow-sm border border-border hover:shadow-md transition-shadow duration-300 group">
              <div className="relative h-64 overflow-hidden">
                <Image
                  src={example.image}
                  alt={example.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                
                <div className="absolute bottom-4 left-4 right-4">
                  <h3 className="text-white font-semibold mb-1">{example.title}</h3>
                  <p className="text-white/80 text-sm line-clamp-2">{example.description}</p>
                </div>
                
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute top-2 right-2 bg-white/20 hover:bg-white/30 text-white"
                >
                  <Icon name="Heart" size={16} />
                </Button>
              </div>
              
              <div className="p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-2">
                    <Image
                      src={example.user.avatar}
                      alt={example.user.name}
                      className="w-6 h-6 rounded-full"
                    />
                    <span className="text-sm text-muted-foreground">{example.user.name}</span>
                    {example.user.verified && (
                      <Icon name="BadgeCheck" size={14} className="text-accent" />
                    )}
                  </div>
                  
                  <div className="flex items-center space-x-1">
                    <Icon name="Heart" size={14} className="text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">{example.likes}</span>
                  </div>
                </div>
                
                <div className="space-y-1 mb-3">
                  {example.products.map((product, index) => (
                    <div key={index} className="flex items-center justify-between text-xs">
                      <span className="text-muted-foreground">{product.name}</span>
                      <span className="text-foreground font-medium">{formatINR(convertUSDToINR(product.price))}</span>
                    </div>
                  ))}
                </div>
                
                <Button variant="outline" size="sm" className="w-full">
                  Shop This Look
                </Button>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center">
          <Button variant="default" size="lg" iconName="Plus" iconPosition="left">
            Share Your Style
          </Button>
          <p className="text-sm text-muted-foreground mt-2">
            Tag us @luxefashion to be featured
          </p>
        </div>
      </div>
    </div>
  );
};

export default StyleItSection;