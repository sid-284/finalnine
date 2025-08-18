import React, { useEffect } from 'react';
import Header from '../../components/ui/Header';
import HeroSection from './components/HeroSection';
import Footer from './components/Footer';
import { useUser } from '../../context/UserContext';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';

const Homepage = () => {
  useEffect(() => {
    // Scroll to top when component mounts
    window.scrollTo(0, 0);
  }, []);

  const { user } = useUser();

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <Header />
      
      {/* User Welcome - Simplified */}
      {user && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-4">
          <span className="text-lg font-serif text-foreground">Welcome back!</span>
        </div>
      )}
      
      {/* Main Content */}
      <main className="pt-4">
        {/* Hero Section */}
        <HeroSection />
        
        {/* Brand Story Section */}
        <section className="py-24 bg-gradient-to-br from-background via-muted/5 to-accent/5 relative overflow-hidden">
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-5">
            <div className="absolute top-10 left-10 text-6xl font-bold text-accent transform rotate-12">9tyTwo</div>
            <div className="absolute bottom-20 right-20 text-4xl font-bold text-accent transform -rotate-12">Handcrafted</div>
            <div className="absolute top-1/2 left-1/4 text-3xl font-bold text-accent transform rotate-45">Bliss</div>
          </div>

          <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative">
            <div className="text-center mb-16">
              <div className="inline-flex items-center px-6 py-3 rounded-full text-sm font-medium bg-gradient-to-r from-accent/20 to-[#92b174]/20 text-accent mb-6 backdrop-blur-sm border border-accent/20">
                <Icon name="Heart" size={18} className="mr-3" />
                The 9tyTwo Story
              </div>
              <h2 className="text-4xl sm:text-5xl lg:text-6xl font-serif font-bold text-foreground mb-8">
                When Two Hearts with
                <span className="bg-gradient-to-r from-accent to-[#92b174] bg-clip-text text-transparent"> One Vision </span>
                Come Together
              </h2>
              <p className="text-xl text-muted-foreground max-w-4xl mx-auto leading-relaxed mb-12">
                Beautiful things happen. Our goal is to offer clothing that allows women to express their individuality while staying true to their beliefs. Every item in our store is handpicked with care, and we're proud to offer you something special, created with love by friends for friends.
              </p>

              {/* Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-3xl mx-auto">
                <div className="text-center">
                  <div className="text-3xl font-bold text-accent mb-2">100+</div>
                  <div className="text-sm text-muted-foreground uppercase tracking-wider">Handcrafted Pieces</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-accent mb-2">2</div>
                  <div className="text-sm text-muted-foreground uppercase tracking-wider">Best Friends</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-accent mb-2">1000+</div>
                  <div className="text-sm text-muted-foreground uppercase tracking-wider">Happy Customers</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-accent mb-2">∞</div>
                  <div className="text-sm text-muted-foreground uppercase tracking-wider">Love & Care</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Founders Section */}
        <section className="py-24 bg-background">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              {/* Content */}
              <div className="space-y-8">
                <div>
                  <div className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium bg-accent/10 text-accent mb-6">
                    <Icon name="Users" size={16} className="mr-2" />
                    Meet the Founders
                  </div>
                  <h2 className="text-4xl sm:text-5xl font-serif font-bold text-foreground mb-6">
                    A Shared Vision of
                    <span className="bg-gradient-to-r from-accent to-[#92b174] bg-clip-text text-transparent"> Modesty & Style</span>
                  </h2>
                </div>

                <div className="space-y-6">
                  <p className="text-xl text-muted-foreground leading-relaxed">
                    We are <span className="font-semibold text-accent">Suha & Rameesa</span>, two best friends bound by a shared vision of combining modesty with style. Our journey began with countless late-night conversations about our passion for fashion and our desire to create a space where modesty meets style.
                  </p>
                  <p className="text-lg text-muted-foreground leading-relaxed">
                    With love, laughter, and lots of hard work, we've brought this vision to life. Welcome to <span className="font-semibold text-accent">9tyTwo</span>, where each piece is a reflection of our friendship and dedication to timeless fashion.
                  </p>
                </div>

                {/* Enhanced Social Links */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-foreground">Connect with us</h3>
                  <div className="flex flex-col sm:flex-row gap-4">
                    <a
                      href="https://www.instagram.com/9tytwoofficial"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group inline-flex items-center px-6 py-4 rounded-xl bg-gradient-to-r from-accent to-[#92b174] text-black font-semibold hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                    >
                      <Icon name="Instagram" size={20} className="mr-3 group-hover:scale-110 transition-transform duration-300" />
                      Follow us on Instagram
                    </a>
                    <a
                      href="https://api.whatsapp.com/send/?phone=918281181992&text&type=phone_number&app_absent=0"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group inline-flex items-center px-6 py-4 rounded-xl border-2 border-accent text-accent font-semibold hover:bg-accent hover:text-black transition-all duration-300 transform hover:scale-105"
                    >
                      <Icon name="MessageCircle" size={20} className="mr-3 group-hover:scale-110 transition-transform duration-300" />
                      Chat with us on WhatsApp
                    </a>
                  </div>
                </div>
              </div>

              {/* Visual Element */}
              <div className="relative">
                <div className="aspect-square rounded-3xl bg-gradient-to-br from-accent/20 to-[#92b174]/20 p-8 relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-accent/10 to-transparent"></div>
                  <div className="relative z-10 h-full flex flex-col justify-center items-center text-center space-y-6">
                    <div className="text-6xl font-bold text-accent">9tyTwo</div>
                    <div className="text-2xl font-semibold text-foreground">Handcrafted Bliss</div>
                    <div className="text-lg text-muted-foreground max-w-xs">Where friendship meets fashion, and dreams become reality</div>
                  </div>
                  <div className="absolute top-4 right-4 w-20 h-20 bg-accent/10 rounded-full"></div>
                  
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Enhanced Values Section */}
        <section className="py-24 bg-gradient-to-br from-muted/10 via-accent/5 to-[#92b174]/5 relative overflow-hidden">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <div className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium bg-accent/10 text-accent mb-6">
                <Icon name="Sparkles" size={16} className="mr-2" />
                What Makes 9tyTwo Special
              </div>
              <h2 className="text-4xl sm:text-5xl font-serif font-bold text-foreground mb-6">
                Our Core
                <span className="bg-gradient-to-r from-accent to-[#92b174] bg-clip-text text-transparent"> Values</span>
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="group bg-background rounded-2xl p-8 text-center shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 border border-accent/10 hover:border-accent/30">
                <div className="relative mb-6">
                  <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-accent/20 to-[#92b174]/20 text-accent mb-4 group-hover:scale-110 transition-transform duration-300">
                    <Icon name="Heart" size={32} />
                  </div>
                  <div className="absolute -inset-2 bg-gradient-to-r from-accent/20 to-transparent rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-sm"></div>
                </div>
                <h3 className="font-serif font-bold text-2xl mb-4 text-foreground group-hover:text-accent transition-colors duration-300">Made with Love</h3>
                <p className="text-muted-foreground leading-relaxed">Each piece is handpicked and crafted with meticulous attention to detail and care by friends for friends. Every stitch tells a story of passion.</p>
              </div>

              <div className="group bg-background rounded-2xl p-8 text-center shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 border border-accent/10 hover:border-accent/30">
                <div className="relative mb-6">
                  <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-accent/20 to-[#92b174]/20 text-accent mb-4 group-hover:scale-110 transition-transform duration-300">
                    <Icon name="Users" size={32} />
                  </div>
                  <div className="absolute -inset-2 bg-gradient-to-r from-accent/20 to-transparent rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-sm"></div>
                </div>
                <h3 className="font-serif font-bold text-2xl mb-4 text-foreground group-hover:text-accent transition-colors duration-300">Built on Friendship</h3>
                <p className="text-muted-foreground leading-relaxed">Our brand is founded on the unbreakable bond of friendship and shared dreams between two best friends who dared to dream together.</p>
              </div>

              <div className="group bg-background rounded-2xl p-8 text-center shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 border border-accent/10 hover:border-accent/30">
                <div className="relative mb-6">
                  <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-accent/20 to-[#92b174]/20 text-accent mb-4 group-hover:scale-110 transition-transform duration-300">
                    <Icon name="Sparkles" size={32} />
                  </div>
                  <div className="absolute -inset-2 bg-gradient-to-r from-accent/20 to-transparent rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-sm"></div>
                </div>
                <h3 className="font-serif font-bold text-2xl mb-4 text-foreground group-hover:text-accent transition-colors duration-300">Timeless Style</h3>
                <p className="text-muted-foreground leading-relaxed">Designs that celebrate individuality while honoring modesty and timeless fashion principles. Style that transcends trends.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Call to Action Section */}
        <section className="py-24 bg-gradient-to-r from-accent to-[#92b174] relative overflow-hidden">
          <div className="absolute inset-0 bg-black/10"></div>
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative">
            <div className="text-center text-black">
              <h2 className="text-4xl sm:text-5xl font-serif font-bold mb-6">
                Ready to Experience 9tyTwo?
              </h2>
              <p className="text-xl mb-8 max-w-2xl mx-auto opacity-90">
                Join thousands of women who have discovered the perfect blend of modesty, style, and craftsmanship.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  variant="outline"
                  size="lg"
                  className="border-black text-black hover:bg-black hover:text-white px-8 py-4 text-lg font-semibold"
                  onClick={() => window.location.href = '/collection-universe'}
                >
                  Shop Collection
                  <Icon name="ArrowRight" size={24} className="ml-3" />
                </Button>
                
              </div>
            </div>
          </div>
        </section>
      </main>
      

      <Footer />
    </div>
  );
};

export default Homepage;
