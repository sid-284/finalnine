import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const HeroSection = () => {
  const [isVideoLoaded, setIsVideoLoaded] = useState(false);
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);

  // YouTube video ID extracted from the URL
  const videoId = 'VaXxN31Pwzs';
  const videoUrl = `https://www.youtube.com/embed/${videoId}?autoplay=1&mute=1&loop=1&playlist=${videoId}&controls=0&showinfo=0&rel=0&iv_load_policy=3&modestbranding=1&playsinline=1&enablejsapi=1`;

  useEffect(() => {
    // Simulate video loading
    const timer = setTimeout(() => {
      setIsVideoLoaded(true);
      setIsVideoPlaying(true);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const toggleVideo = () => {
    const iframe = document.getElementById('hero-video');
    if (iframe && iframe.contentWindow) {
      if (isVideoPlaying) {
        iframe.contentWindow.postMessage('{"event":"command","func":"pauseVideo","args":""}', '*');
      } else {
        iframe.contentWindow.postMessage('{"event":"command","func":"playVideo","args":""}', '*');
      }
      setIsVideoPlaying(!isVideoPlaying);
    }
  };

  return (
    <section className="relative h-screen overflow-hidden bg-background">
      {/* Video Background */}
      <div className="absolute inset-0 w-full h-full">
        {/* Loading placeholder */}
        {!isVideoLoaded && (
          <div className="absolute inset-0 bg-gradient-to-br from-black via-gray-900 to-black flex items-center justify-center">
            <div className="text-center space-y-4">
              <div className="w-16 h-16 border-4 border-accent border-t-transparent rounded-full animate-spin mx-auto"></div>
              <p className="text-white text-lg font-medium">Loading Experience...</p>
            </div>
          </div>
        )}

        {/* YouTube Video Embed - Optimized for Shorts on Desktop */}
        <iframe
          id="hero-video"
          src={videoUrl}
          className={`transition-opacity duration-1000 ${
            isVideoLoaded ? 'opacity-100' : 'opacity-0'
          }`}
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            // For YouTube Shorts (9:16 aspect ratio) on desktop
            // Scale up to fill height and center horizontally
            width: '177.78vh', // Height * (16/9) to get proper width for 16:9 scaling
            height: '100vh',
            minWidth: '100vw', // Ensure it covers full width
            minHeight: '177.78vw', // Width * (16/9) for minimum height
            transform: 'translate(-50%, -50%) scale(1.2)', // Scale up to crop and zoom
            transformOrigin: 'center center',
            zIndex: 1,
            objectFit: 'cover'
          }}
          onLoad={() => setIsVideoLoaded(true)}
        />

        {/* Alternative styling for better mobile responsiveness */}
        <style jsx>{`
          @media (max-width: 768px) {
            #hero-video {
              width: 100vw !important;
              height: 177.78vw !important; /* 9:16 aspect ratio for mobile */
              min-width: 100vw !important;
              min-height: 100vh !important;
              transform: translate(-50%, -50%) scale(1) !important;
            }
          }
          
          @media (min-width: 769px) {
            #hero-video {
              /* Desktop: Scale the short video to fill width, crop top/bottom */
              width: 100vw !important;
              height: 177.78vw !important; /* This makes it tall enough */
              min-width: 100vw !important;
              min-height: 100vh !important;
              transform: translate(-50%, -50%) !important;
            }
          }
        `}</style>

        {/* Video Overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-black/20 z-10" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent z-10" />
      </div>

      {/* Content Overlay */}
      <div className="absolute inset-0 flex items-center z-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl">
            <div className="space-y-8 text-white">
              {/* Accent Badge */}
              <div className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-accent/20 to-amber-400/20 backdrop-blur-sm rounded-full border border-accent/30">
                <span className="text-sm font-medium tracking-wider uppercase text-accent">
                  Handcrafted Bliss
                </span>
              </div>

              {/* Main Content */}
              <div className="space-y-6">
                <p className="text-lg font-medium tracking-wide uppercase opacity-90 text-accent">
                  Where Craftsmanship Meets Contemporary Elegance
                </p>
                <h1 className="text-5xl sm:text-6xl lg:text-8xl font-display font-bold leading-tight">
                  <span className="bg-gradient-to-r from-white via-accent to-white bg-clip-text text-transparent">
                    9ty two
                  </span>
                </h1>
              </div>

              <p className="text-xl sm:text-2xl leading-relaxed opacity-95 max-w-3xl font-light">
                Discover timeless pieces that transcend seasons, crafted with meticulous attention to detail and sustainable practices. Each creation tells a story of passion, precision, and purpose.
              </p>

              {/* Enhanced CTAs */}
              <div className="pt-6 flex flex-col sm:flex-row gap-4">
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
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
