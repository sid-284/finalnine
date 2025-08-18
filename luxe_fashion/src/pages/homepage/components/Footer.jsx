import React from 'react';
import { Link } from 'react-router-dom';
import Icon from '../../../components/AppIcon';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const footerSections = [
    {
      title: "Shop",
      links: [
        { name: "New Arrivals", path: "/collection-universe" },
        { name: "Collections", path: "/collection-universe" },
        { name: "Sale", path: "/collection-universe" },
        { name: "Gift Cards", path: "/collection-universe" }
      ]
    },
    {
      title: "Experience",
      links: [
        { name: "Personal Shopping", path: "/collection-universe" },
        { name: "Virtual Appointments", path: "/collection-universe" }
      ]
    },
    {
      title: "Support",
      links: [
        { name: "Care Instructions", path: "/collection-universe" },
        { name: "Returns & Exchanges", path: "/collection-universe" },
        { name: "Contact Us", path: "/collection-universe" }
      ]
    },
    {
      title: "Company",
      links: [
        { name: "About Us", path: "/collection-universe" },
        { name: "Sustainability", path: "/collection-universe" },
        { name: "Careers", path: "/collection-universe" },
        { name: "Press", path: "/collection-universe" }
      ]
    }
  ];

  const socialLinks = [
    { name: "Instagram", icon: "Instagram", url: "https://www.instagram.com/9tytwoofficial" },
    { name: "Facebook", icon: "Facebook", url: "https://www.facebook.com/@nintytwo/?hr=1&_rdr" },
    { name: "WhatsApp", icon: "MessageCircle", url: "https://api.whatsapp.com/send/?phone=918281181992&text&type=phone_number&app_absent=0" },
    { name: "Twitter", icon: "Twitter", url: "#" },
    { name: "Pinterest", icon: "PinIcon", url: "#" },
    { name: "YouTube", icon: "Youtube", url: "#" }
  ];

  const paymentMethods = [
    { name: "Visa", icon: "CreditCard" },
    { name: "Mastercard", icon: "CreditCard" },
    { name: "American Express", icon: "CreditCard" },
    { name: "PayPal", icon: "Wallet" },
    { name: "Apple Pay", icon: "Smartphone" },
    { name: "Google Pay", icon: "Smartphone" }
  ];

  return (
    <footer className="bg-foreground text-background">
      {/* Newsletter Section */}
      <div className="border-b border-background/10">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="max-w-2xl mx-auto text-center space-y-6">
            <div className="space-y-2">
              <h3 className="text-2xl font-semibold">
                Stay in Style
              </h3>
              <p className="text-background/80 leading-relaxed">
                Be the first to know about new arrivals, exclusive events, and styling tips from our fashion experts.
              </p>
            </div>
            
          </div>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-8">
          {/* Brand Section */}
          <div className="lg:col-span-2 space-y-6">
            <Link to="/homepage" className="flex items-center space-x-2">
              <img 
                src="/assets/images/logos/9ty-two-logo.svg" 
                alt="9ty two logo" 
                className="h-30 w-auto filter brightness-0 invert"
              />
            </Link>
            
            <p className="text-background/80 leading-relaxed max-w-sm">
              Where craftsmanship meets contemporary design. Discover timeless pieces that transcend seasons and trends.
            </p>
            
            <div className="space-y-4">
              <div className="flex items-center space-x-2 text-sm text-background/80">
                <Icon name="MapPin" size={16} />
                <span>Ettikulam, Kerala, 670308, India</span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-background/80">
                <Icon name="Phone" size={16} />
                <span>+91 82811 81992</span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-background/80">
                <Icon name="Mail" size={16} />
                <span>199tytwo@gmail.com</span>
              </div>
            </div>
          </div>

          {/* Footer Links */}
          {footerSections.map((section) => (
            <div key={section.title} className="space-y-4">
              <h4 className="font-semibold text-background">
                {section.title}
              </h4>
              <ul className="space-y-2">
                {section.links.map((link) => (
                  <li key={link.name}>
                    <Link
                      to={link.path}
                      className="text-sm text-background/80 hover:text-accent transition-colors duration-200"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Footer */}
      <div className="border-t border-background/10">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col lg:flex-row items-center justify-between space-y-6 lg:space-y-0">
            {/* Copyright */}
            <div className="text-sm text-background/60 text-center lg:text-left">
              <p>© {currentYear} 9ty two. All rights reserved.</p>
              <div className="flex items-center justify-center lg:justify-start space-x-4 mt-2">
                <Link to="/collection-universe" className="hover:text-accent transition-colors duration-200">
                  Privacy Policy
                </Link>
                <span>•</span>
                <Link to="/collection-universe" className="hover:text-accent transition-colors duration-200">
                  Terms of Service
                </Link>
                <span>•</span>
                <Link to="/collection-universe" className="hover:text-accent transition-colors duration-200">
                  Accessibility
                </Link>
              </div>
            </div>

            {/* Social Links */}
            <div className="flex items-center space-x-4">
              <span className="text-sm text-background/60">Follow us:</span>
              {socialLinks.map((social) => (
                <a
                  key={social.name}
                  href={social.url}
                  className="w-8 h-8 bg-background/10 rounded-full flex items-center justify-center text-background/80 hover:bg-accent hover:text-accent-foreground transition-colors duration-200"
                  aria-label={social.name}
                >
                  <Icon name={social.icon} size={16} />
                </a>
              ))}
            </div>

            {/* Payment Methods */}
            <div className="flex items-center space-x-2">
              <span className="text-sm text-background/60 mr-2">We accept:</span>
              {paymentMethods.map((method, index) => (
                <div
                  key={index}
                  className="w-8 h-8 bg-background/10 rounded flex items-center justify-center"
                  title={method.name}
                >
                  <Icon name={method.icon} size={14} className="text-background/60" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
