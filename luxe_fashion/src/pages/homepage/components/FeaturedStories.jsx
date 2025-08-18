import React from 'react';
import { Link } from 'react-router-dom';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';
import Button from '../../../components/ui/Button';

const FeaturedStories = () => {
  const stories = [
    {
      id: 1,
      title: "The Art of Sustainable Cashmere",
      subtitle: "Behind the Craft",
      excerpt: "Journey to the highlands of Mongolia where our partner artisans practice centuries-old techniques to create the world\'s finest sustainable cashmere.",
      image: "https://images.unsplash.com/photo-1445205170230-053b83016050?w=600&h=400&fit=crop&crop=center",
      author: "Elena Rodriguez",
      readTime: "8 min read",
      category: "Sustainability",
      date: "December 8, 2024",
      featured: true
    },
    {
      id: 2,
      title: "Designer Spotlight: Minimalist Maximalism",
      subtitle: "Creative Vision",
      excerpt: "Meet the visionary behind our latest collection who believes that true luxury lies in the perfect balance of simplicity and sophistication.",
      image: "https://images.pexels.com/photos/7679720/pexels-photo-7679720.jpeg?w=600&h=400&fit=crop&crop=center",
      author: "Marcus Chen",
      readTime: "6 min read",
      category: "Designer Interview",
      date: "December 5, 2024",
      featured: false
    },
    {
      id: 3,
      title: "The Future of Fashion Technology",
      subtitle: "Innovation",
      excerpt: "Exploring how cutting-edge technology is revolutionizing the way we design, create, and experience luxury fashion.",
              image: "https://images.unsplash.com/photo-1552374196-1ab2a1c593e8?w=600&h=400&fit=crop&crop=center",
      author: "Sarah Kim",
      readTime: "10 min read",
      category: "Technology",
      date: "December 3, 2024",
      featured: false
    }
  ];

  const featuredStory = stories.find(story => story.featured);
  const regularStories = stories.filter(story => !story.featured);

  return (
    <section className="py-16 lg:py-24 bg-muted/30">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12 lg:mb-16">
          <div className="space-y-4">
            <p className="text-sm font-medium tracking-wider uppercase text-muted-foreground">
              Featured Stories
            </p>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-semibold text-foreground">
              Where Fashion Meets Narrative
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Dive deep into the stories behind our collections, the artisans who create them, and the vision that drives our brand.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Featured Story */}
          {featuredStory && (
            <div className="lg:col-span-1">
              <Link to="/collection-universe" className="group block">
                <div className="relative overflow-hidden rounded-lg bg-card">
                  <div className="aspect-[4/3] overflow-hidden">
                    <Image
                      src={featuredStory.image}
                      alt={featuredStory.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-luxury"
                    />
                  </div>
                  
                  {/* Featured Badge */}
                  <div className="absolute top-4 left-4">
                    <span className="px-3 py-1 text-xs font-medium bg-accent text-accent-foreground rounded-full">
                      Featured Story
                    </span>
                  </div>

                  {/* Content Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                  
                  <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                    <div className="space-y-3">
                      <div className="flex items-center space-x-2 text-sm opacity-90">
                        <span className="px-2 py-1 bg-white/20 backdrop-blur-sm rounded text-xs font-medium">
                          {featuredStory.category}
                        </span>
                        <span>•</span>
                        <span>{featuredStory.readTime}</span>
                      </div>
                      
                      <div className="space-y-2">
                        <p className="text-sm font-medium opacity-90">
                          {featuredStory.subtitle}
                        </p>
                        <h3 className="text-2xl font-serif font-semibold leading-tight">
                          {featuredStory.title}
                        </h3>
                      </div>
                      
                      <p className="text-sm leading-relaxed opacity-90 line-clamp-3">
                        {featuredStory.excerpt}
                      </p>
                      
                      <div className="flex items-center justify-between pt-2">
                        <div className="flex items-center space-x-2 text-sm">
                          <span>By {featuredStory.author}</span>
                          <span>•</span>
                          <span>{featuredStory.date}</span>
                        </div>
                        
                        <div className="flex items-center space-x-1 text-sm font-medium group-hover:translate-x-1 transition-transform duration-300">
                          <span>Read More</span>
                          <Icon name="ArrowRight" size={16} />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            </div>
          )}

          {/* Regular Stories */}
          <div className="lg:col-span-1 space-y-6">
            {regularStories.map((story) => (
              <Link
                key={story.id}
                to="/collection-universe"
                className="group block"
              >
                <div className="flex space-x-4 bg-card rounded-lg p-4 hover:shadow-card transition-shadow duration-300">
                  <div className="flex-shrink-0">
                    <div className="w-24 h-24 sm:w-32 sm:h-32 overflow-hidden rounded-lg">
                      <Image
                        src={story.image}
                        alt={story.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-luxury"
                      />
                    </div>
                  </div>
                  
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                      <span className="px-2 py-1 bg-muted rounded text-xs font-medium">
                        {story.category}
                      </span>
                      <span>•</span>
                      <span>{story.readTime}</span>
                    </div>
                    
                    <div className="space-y-1">
                      <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                        {story.subtitle}
                      </p>
                      <h4 className="font-serif font-semibold text-foreground group-hover:text-accent transition-colors duration-200 line-clamp-2">
                        {story.title}
                      </h4>
                    </div>
                    
                    <p className="text-sm text-muted-foreground leading-relaxed line-clamp-2">
                      {story.excerpt}
                    </p>
                    
                    <div className="flex items-center justify-between pt-1">
                      <div className="text-xs text-muted-foreground">
                        <span>By {story.author}</span>
                        <span className="mx-1">•</span>
                        <span>{story.date}</span>
                      </div>
                      
                      <div className="flex items-center space-x-1 text-xs font-medium text-accent group-hover:translate-x-1 transition-transform duration-300">
                        <span>Read</span>
                        <Icon name="ArrowRight" size={12} />
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* View All Collections Button */}
        <div className="text-center mt-12">
          <Link to="/collection-universe">
            <Button
              variant="outline"
              size="lg"
              className="px-8 py-3"
            >
              Explore All Collections
              <Icon name="Grid3X3" size={20} className="ml-2" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default FeaturedStories;