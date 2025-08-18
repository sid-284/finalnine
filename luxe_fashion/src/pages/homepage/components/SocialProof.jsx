import React from 'react';
import { Link } from 'react-router-dom';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';

const SocialProof = () => {
  const customerShowcase = [
    {
      id: 1,
      name: "Sarah Chen",
      location: "New York",
      image: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=300&h=300&fit=crop&crop=face",
      outfitImage: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400&h=500&fit=crop&crop=center",
      review: "The cashmere coat exceeded all my expectations. The quality is exceptional and it fits perfectly.",
      rating: 5,
      verified: true,
      styleTag: "@9tytwoofficial #sustainablestyle"
    },
    {
      id: 2,
      name: "Emma Rodriguez",
      location: "Los Angeles",
      image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=300&h=300&fit=crop&crop=face",
      outfitImage: "https://images.pexels.com/photos/1536619/pexels-photo-1536619.jpeg?w=400&h=500&fit=crop&crop=center",
      review: "Love how the silk dress drapes. Perfect for both work meetings and dinner dates.",
      rating: 5,
      verified: true,
      styleTag: "@9tytwoofficial #workwear"
    },
    {
      id: 3,
      name: "Maya Patel",
      location: "Chicago",
      image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&h=300&fit=crop&crop=face",
              outfitImage: "https://images.unsplash.com/photo-1552374196-1ab2a1c593e8?w=400&h=500&fit=crop&crop=center",
      review: "The attention to detail in the merino sweater is incredible. Soft, warm, and beautifully crafted.",
      rating: 5,
      verified: true,
      styleTag: "@9tytwoofficial #cozyvibes"
    },
    {
      id: 4,
      name: "Jessica Kim",
      location: "San Francisco",
      image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=300&h=300&fit=crop&crop=face",
      outfitImage: "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=400&h=500&fit=crop&crop=center",
      review: "Finally found a blazer that fits like it was made for me. The tailoring is impeccable.",
      rating: 5,
      verified: true,
      styleTag: "@9tytwoofficial #tailored"
    }
  ];

  const pressFeatures = [
    {
      id: 1,
      publication: "Vogue",
      logo: "https://images.unsplash.com/photo-1586953208448-b95a79798f07?w=120&h=60&fit=crop&crop=center",
      quote: "9ty two is redefining sustainable luxury with their impeccable curation.",
      date: "December 2024"
    },
    {
      id: 2,
      publication: "Harper\'s Bazaar",
      logo: "https://images.pexels.com/photos/7679720/pexels-photo-7679720.jpeg?w=120&h=60&fit=crop&crop=center",
      quote: "The future of fashion retail lies in experiences like 9ty two's curated collections.",
      date: "November 2024"
    },
    {
      id: 3,
      publication: "Elle",
              logo: "https://images.unsplash.com/photo-1552374196-1ab2a1c593e8?w=120&h=60&fit=crop&crop=center",
      quote: "A masterclass in combining technology with timeless style.",
      date: "October 2024"
    }
  ];

  const trustMetrics = [
    { label: "Customer Satisfaction", value: "98%", icon: "Heart" },
    { label: "Verified Reviews", value: "12,000+", icon: "Shield" },
    { label: "Return Rate", value: "<2%", icon: "RotateCcw" },
    { label: "Repeat Customers", value: "85%", icon: "Users" }
  ];

  return (
    <section className="py-16 lg:py-24 bg-muted/20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12 lg:mb-16">
          <div className="space-y-4">
            <p className="text-sm font-medium tracking-wider uppercase text-muted-foreground">
              Social Proof
            </p>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-semibold text-foreground">
              Loved by 9ty two Fans Worldwide
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Join thousands of satisfied customers who have discovered their perfect style with 9ty two.
            </p>
          </div>
        </div>

        {/* Trust Metrics */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {trustMetrics.map((metric, index) => (
            <div key={index} className="text-center bg-card rounded-lg p-6">
              <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center mx-auto mb-3">
                <Icon name={metric.icon} size={24} className="text-accent" />
              </div>
              <div className="space-y-1">
                <p className="text-2xl font-serif font-semibold text-foreground">
                  {metric.value}
                </p>
                <p className="text-sm text-muted-foreground">
                  {metric.label}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Customer Showcase */}
        <div className="mb-12">
          <h3 className="text-2xl font-serif font-semibold text-center mb-8">
            Customer Style Showcase
          </h3>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {customerShowcase.map((customer) => (
              <div key={customer.id} className="group">
                <div className="bg-card rounded-lg overflow-hidden hover:shadow-card transition-shadow duration-300">
                  {/* Outfit Image */}
                  <div className="aspect-[3/4] overflow-hidden">
                    <Image
                      src={customer.outfitImage}
                      alt={`${customer.name}'s style`}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-luxury"
                    />
                  </div>
                  
                  {/* Customer Info */}
                  <div className="p-4 space-y-3">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 overflow-hidden rounded-full">
                        <Image
                          src={customer.image}
                          alt={customer.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center space-x-1">
                          <h4 className="font-medium text-sm text-foreground">
                            {customer.name}
                          </h4>
                          {customer.verified && (
                            <Icon name="BadgeCheck" size={14} className="text-accent" />
                          )}
                        </div>
                        <p className="text-xs text-muted-foreground">
                          {customer.location}
                        </p>
                      </div>
                    </div>
                    
                    {/* Rating */}
                    <div className="flex items-center space-x-1">
                      {[...Array(customer.rating)].map((_, i) => (
                        <Icon key={i} name="Star" size={12} className="text-accent fill-current" />
                      ))}
                    </div>
                    
                    {/* Review */}
                    <p className="text-sm text-muted-foreground leading-relaxed line-clamp-3">
                      "{customer.review}"
                    </p>
                    
                    {/* Style Tag */}
                    <p className="text-xs text-accent font-medium">
                      {customer.styleTag}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Press Features */}
        <div className="bg-card rounded-lg p-8">
          <h3 className="text-2xl font-serif font-semibold text-center mb-8">
            Featured In
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {pressFeatures.map((feature) => (
              <div key={feature.id} className="text-center space-y-4">
                <div className="w-24 h-12 mx-auto overflow-hidden rounded">
                  <Image
                    src={feature.logo}
                    alt={feature.publication}
                    className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-300"
                  />
                </div>
                
                <blockquote className="text-sm text-muted-foreground font-italic leading-relaxed">
                  "{feature.quote}"
                </blockquote>
                
                <div className="space-y-1">
                  <p className="font-medium text-foreground">
                    {feature.publication}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {feature.date}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="text-center mt-12">
          <p className="text-muted-foreground mb-4">
            Join our community of style enthusiasts
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center space-y-3 sm:space-y-0 sm:space-x-4">
            <Link to="/collection-universe" className="inline-block">
              <button className="px-6 py-2 bg-accent text-accent-foreground rounded-lg font-medium hover:bg-accent/90 transition-colors duration-300">
                Start Shopping
              </button>
            </Link>
            <button className="px-6 py-2 border border-border rounded-lg font-medium text-foreground hover:bg-muted/50 transition-colors duration-300">
              Share Your Style
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SocialProof;