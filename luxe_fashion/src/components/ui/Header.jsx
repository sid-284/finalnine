import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import Icon from '../AppIcon';
import Button from './Button';
import { useUser } from '../../context/UserContext';
import SearchModal from './SearchModal';
import { useCart } from '../../context/CartContext';
import { apiFetch } from '../../utils/api';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const location = useLocation();
  const { user, logout, backendUser, backendAuthenticated } = useUser();
  const navigate = useNavigate();
  const { cart, clearCart } = useCart();

  const navigationItems = [
    { name: 'Home', path: '/homepage', icon: 'Home' },
    { name: 'Collections', path: '/collection-universe', icon: 'Grid3X3' },
    { name: 'Checkout', path: '/checkout-experience', icon: 'ShoppingBag' }
  ];

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isUserMenuOpen && !event.target.closest('.user-menu-container')) {
        setIsUserMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isUserMenuOpen]);

  // Check admin access from backend user or admin cookie
  useEffect(() => {
    let cancelled = false;
    const checkAdmin = async () => {
      if (backendUser && backendUser.isAdmin) {
        if (!cancelled) setIsAdmin(true);
        return;
      }
      
      // Only check admin status if user is authenticated with backend
      if (!backendAuthenticated) {
        if (!cancelled) setIsAdmin(false);
        return;
      }
      
      try {
        console.log('Checking admin status...');
        const res = await apiFetch('/user/getadmin');
        if (!cancelled) setIsAdmin(!!res && res.role === 'admin');
      } catch (e) {
        console.error('Admin check failed:', e);
        if (!cancelled) setIsAdmin(false);
      }
    };
    checkAdmin();
    return () => { cancelled = true; };
  }, [backendUser, location.pathname]);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  const toggleUserMenu = () => {
    setIsUserMenuOpen(!isUserMenuOpen);
  };

  const closeUserMenu = () => {
    setIsUserMenuOpen(false);
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ease-out ${
        isScrolled
          ? 'bg-white shadow-xl border-b border-gray-200'
          : 'bg-white border-b border-gray-100'
      }`}
    >
      <div className="w-full">
        <div className="flex items-center justify-between h-20 px-4 sm:px-6 lg:px-8">
          {/* Enhanced Logo with Brand Text */}
          <Link
            to="/homepage"
            className="flex items-center space-x-3 group hover:scale-105 transition-all duration-300 ease-out"
            onClick={closeMenu}
          >
            <div className="relative h-20 w-28 overflow-hidden flex items-center">
              <img
                src="/assets/images/logos/logo.jpeg"
                alt="Brand logo"
                className="h-full w-full object-contain"
              />
            </div>
            
          </Link>

          {/* Enhanced Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-1">
            {navigationItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`relative px-4 py-3 text-sm font-medium transition-all duration-300 rounded-full group ${
                  location.pathname === item.path
                    ? 'text-accent bg-accent/10 shadow-sm'
                    : 'text-muted-foreground hover:text-accent hover:bg-accent/5'
                }`}
              >
                <span className="relative z-10">{item.name}</span>
                {location.pathname === item.path && (
                  <div className="absolute inset-0 bg-gradient-to-r from-accent/20 to-accent/10 rounded-full animate-pulse" />
                )}
                <div className="absolute inset-0 bg-gradient-to-r from-accent/0 via-accent/5 to-accent/0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </Link>
            ))}
            {isAdmin && (
              <Link
                to="/admin"
                className={`relative px-4 py-3 text-sm font-medium transition-all duration-300 rounded-full group ${
                  location.pathname === '/admin'
                    ? 'text-accent bg-accent/10 shadow-sm'
                    : 'text-muted-foreground hover:text-accent hover:bg-accent/5'
                }`}
              >
                <span className="relative z-10">Admin</span>
                {location.pathname === '/admin' && (
                  <div className="absolute inset-0 bg-gradient-to-r from-accent/20 to-accent/10 rounded-full animate-pulse" />
                )}
                <div className="absolute inset-0 bg-gradient-to-r from-accent/0 via-accent/5 to-accent/0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </Link>
            )}
          </nav>

          {/* Enhanced Desktop Actions */}
          <div className="hidden lg:flex items-center space-x-2">
            <Button
              variant="ghost"
              size="icon"
              className="text-muted-foreground hover:text-accent hover:bg-accent/10 transition-all duration-300 rounded-full group"
              onClick={() => setSearchOpen(true)}
            >
              <Icon name="Search" size={20} className="group-hover:scale-110 transition-transform duration-300" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="text-muted-foreground hover:text-red-500 hover:bg-red-50 transition-all duration-300 rounded-full group"
              onClick={() => navigate('/wishlist')}
            >
              <Icon name="Heart" size={20} className="group-hover:scale-110 transition-transform duration-300" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="text-muted-foreground hover:text-accent hover:bg-accent/10 transition-all duration-300 rounded-full relative group"
              onClick={() => {
                navigate('/checkout-experience');
              }}
            >
              <Icon name="ShoppingBag" size={20} className="group-hover:scale-110 transition-transform duration-300" />
              {cart.length > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-gradient-to-r from-accent to-amber-400 text-white text-xs rounded-full flex items-center justify-center font-semibold shadow-lg animate-pulse">
                  {cart.length}
              </span>
              )}
            </Button>

            {user ? (
              <div className="relative user-menu-container">
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-muted-foreground hover:text-foreground"
                  onClick={toggleUserMenu}
                >
                  {user.photoURL ? (
                    <img
                      src={user.photoURL}
                      alt="User avatar"
                      className="w-8 h-8 rounded-full object-cover border border-border"
                    />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-accent flex items-center justify-center text-accent-foreground font-semibold text-base border border-border">
                      {user.email ? user.email[0].toUpperCase() : '?'}
                    </div>
                  )}
                </Button>
                {isUserMenuOpen && (
                  <div className="absolute right-0 top-full mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg py-2 z-50">
                    <div className="px-4 py-2 border-b border-gray-200">
                      <div className="text-sm font-medium text-foreground">{user.email}</div>
                    </div>
                    {isAdmin && (
                      <button
                        onClick={() => {
                          navigate('/admin');
                          closeUserMenu();
                        }}
                        className="w-full px-4 py-2 text-left text-sm text-muted-foreground hover:text-foreground hover:bg-gray-50 transition-colors duration-200"
                      >
                        <div className="flex items-center space-x-2">
                          <Icon name="Shield" size={16} />
                          <span>Admin Panel</span>
                        </div>
                      </button>
                    )}
                    <button
                      onClick={() => {
                        navigate('/profile');
                        closeUserMenu();
                      }}
                      className="w-full px-4 py-2 text-left text-sm text-muted-foreground hover:text-foreground hover:bg-gray-50 transition-colors duration-200"
                    >
                      <div className="flex items-center space-x-2">
                        <Icon name="User" size={16} />
                        <span>Profile</span>
                      </div>
                    </button>
                    <button
                      onClick={async () => {
                        await logout();
                        closeUserMenu();
                        navigate('/homepage');
                      }}
                      className="w-full px-4 py-2 text-left text-sm text-muted-foreground hover:text-foreground hover:bg-gray-50 transition-colors duration-200"
                    >
                      <div className="flex items-center space-x-2">
                        <Icon name="LogOut" size={16} />
                        <span>Log out</span>
                      </div>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="relative user-menu-container">
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-muted-foreground hover:text-foreground"
                  onClick={toggleUserMenu}
                >
                  <Icon name="User" size={20} />
                </Button>
                {isUserMenuOpen && (
                  <div className="absolute right-0 top-full mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg py-2 z-50">
                    {isAdmin && (
                      <button
                        onClick={() => {
                          navigate('/admin');
                          closeUserMenu();
                        }}
                        className="w-full px-4 py-2 text-left text-sm text-muted-foreground hover:text-foreground hover:bg-gray-50 transition-colors duration-200"
                      >
                        <div className="flex items-center space-x-2">
                          <Icon name="Shield" size={16} />
                          <span>Admin Panel</span>
                        </div>
                      </button>
                    )}
                    <button
                      onClick={() => {
                        navigate('/profile');
                        closeUserMenu();
                      }}
                      className="w-full px-4 py-2 text-left text-sm text-muted-foreground hover:text-foreground hover:bg-gray-50 transition-colors duration-200"
                    >
                      <div className="flex items-center space-x-2">
                        <Icon name="User" size={16} />
                        <span>Sign In</span>
                      </div>
                    </button>
                    
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="lg:hidden flex items-center space-x-2">
            <Button
              variant="ghost"
              size="icon"
              className="text-muted-foreground hover:text-accent hover:bg-accent/10 transition-all duration-300 rounded-full group"
              onClick={() => setSearchOpen(true)}
            >
              <Icon name="Search" size={20} className="group-hover:scale-110 transition-transform duration-300" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="text-muted-foreground hover:text-accent hover:bg-accent/10 transition-all duration-300 rounded-full relative group"
              onClick={() => {
                navigate('/checkout-experience');
              }}
            >
              <Icon name="ShoppingBag" size={20} className="group-hover:scale-110 transition-transform duration-300" />
              {cart.length > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-gradient-to-r from-accent to-amber-400 text-white text-xs rounded-full flex items-center justify-center font-semibold shadow-lg animate-pulse">
                  {cart.length}
                </span>
              )}
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleMenu}
              className="text-muted-foreground hover:text-foreground"
            >
              <Icon name={isMenuOpen ? "X" : "Menu"} size={20} />
            </Button>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        <div 
          className={`lg:hidden transition-all duration-300 ease-luxury overflow-hidden ${
            isMenuOpen 
              ? 'max-h-96 opacity-100' :'max-h-0 opacity-0'
          }`}
        >
          <div className="px-4 py-4 bg-white border-t border-gray-200">
            <nav className="space-y-2">
              {navigationItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={closeMenu}
                  className={`flex items-center space-x-3 px-3 py-3 rounded-lg text-sm font-medium transition-colors duration-300 ${
                    location.pathname === item.path
                      ? 'bg-accent/10 text-accent' :'text-muted-foreground hover:text-foreground hover:bg-gray-50'
                  }`}
                >
                  <Icon name={item.icon} size={18} />
                  <span>{item.name}</span>
                </Link>
              ))}
            </nav>
            
            <div className="mt-4 pt-4 border-t border-gray-200">
              <div className="flex items-center justify-between">
                <Button
                  variant="ghost"
                  size="sm"
                  className="flex items-center space-x-2 text-muted-foreground hover:text-foreground"
                  onClick={() => {
                    navigate('/wishlist');
                    closeMenu();
                  }}
                >
                  <Icon name="Heart" size={18} />
                  <span>Wishlist</span>
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="flex items-center space-x-2 text-muted-foreground hover:text-foreground"
                  onClick={() => {
                    navigate('/profile');
                    closeMenu();
                  }}
                >
                  <Icon name="User" size={18} />
                  <span>Account</span>
                </Button>
                
              </div>
              {isAdmin && (
                <div className="mt-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="flex items-center space-x-2 text-muted-foreground hover:text-foreground"
                    onClick={() => {
                      navigate('/admin');
                      closeMenu();
                    }}
                  >
                    <Icon name="Shield" size={18} />
                    <span>Admin Panel</span>
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      <SearchModal open={searchOpen} onClose={() => setSearchOpen(false)} />
    </header>
  );
};

export default Header;