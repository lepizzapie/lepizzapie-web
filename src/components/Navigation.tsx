import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Pizza, Menu as MenuIcon, X } from 'lucide-react';

const Navigation: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  const navItems = [
    { name: 'About', path: '/about' },
    { name: 'Menu', path: '/menu' },
    { name: 'Book Event', path: '/book-event' },
    { name: 'Calendar', path: '/calendar' },
    { name: 'Social', path: '/social' },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="bg-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-pizza-red rounded-full flex items-center justify-center">
              <Pizza className="w-6 h-6 text-white" />
            </div>
            <span className="font-display text-2xl font-bold text-gray-900">
              Le Pizza Pie
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <Link
                key={item.name}
                to={item.path}
                className={`font-medium transition-colors duration-200 ${
                  isActive(item.path)
                    ? 'text-pizza-red border-b-2 border-pizza-red'
                    : 'text-gray-700 hover:text-pizza-red'
                }`}
              >
                {item.name}
              </Link>
            ))}
          </div>

          {/* Admin Icon */}
          <div className="hidden md:flex items-center">
            <Link
              to="/admin"
              className="p-2 text-gray-600 hover:text-pizza-red transition-colors duration-200"
              title="Admin Login"
            >
              <Pizza className="w-6 h-6" />
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center space-x-4">
            <Link
              to="/admin"
              className="p-2 text-gray-600 hover:text-pizza-red transition-colors duration-200"
              title="Admin Login"
            >
              <Pizza className="w-5 h-5" />
            </Link>
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-600 hover:text-pizza-red transition-colors duration-200"
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <MenuIcon className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white border-t">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  to={item.path}
                  className={`block px-3 py-2 rounded-md text-base font-medium transition-colors duration-200 ${
                    isActive(item.path)
                      ? 'text-pizza-red bg-red-50'
                      : 'text-gray-700 hover:text-pizza-red hover:bg-gray-50'
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navigation; 