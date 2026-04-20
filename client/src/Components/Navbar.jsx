import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { ShoppingBag, MessageCircle, Menu, X, LayoutGrid } from 'lucide-react';
import { assets } from '../assets/assets';
import { useClerk, useUser, UserButton } from '@clerk/react';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();
  const { user } = useUser();

  const { openSignIn } = useClerk()


  const navLinks = [
    { name: 'Marketplace', path: '/marketplace', icon: <ShoppingBag className="w-4 h-4" />, requireAuth: false },
    { name: 'Messages', path: '/messages', icon: <MessageCircle className="w-4 h-4" />, requireAuth: true },
    { name: 'My Listings', path: '/my-listings', icon: <LayoutGrid className="w-4 h-4" />, requireAuth: true },
  ];

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const isActive = (path) => location.pathname === path;
  const navigate = useNavigate();
  const isHomePage = location.pathname === '/';

  const handleNavClick = (e, link) => {
    if (link.requireAuth && !user) {
      e.preventDefault();
      openSignIn();
    }
  };

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled || !isHomePage
        ? 'bg-white/90 backdrop-blur-md shadow-sm py-3 border-b border-gray-100'
        : 'bg-transparent py-5'
        }`}
    >
      <div className="max-w-7xl mx-auto px-6 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center text-gray-800">

          {/* Logo */}

          <img src={assets.logo} alt="logo" className='h-10 cursor-pointer' onClick={() => {
            navigate('/');
            scrollTo(0, 0)
          }} />

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={(e) => handleNavClick(e, link)}
                className={`flex items-center gap-2 text-sm font-medium transition-all hover:text-indigo-600 relative group/link ${isActive(link.path) ? 'text-indigo-600' : 'text-gray-600'
                  }`}
              >
                {link.icon}
                {link.name}
                <span className={`absolute -bottom-1 left-0 w-0 h-0.5 bg-indigo-600 transition-all duration-300 group-hover/link:w-full ${isActive(link.path) ? 'w-full' : ''}`} />
              </Link>
            ))}
          </div>

          {/* Action Buttons */}
          <div className="hidden md:flex items-center gap-5">
            {user ? (
              <UserButton />
            ) : (
              <button
                onClick={() => openSignIn()}
                className="bg-indigo-600 text-white px-8 py-2.5 rounded-full text-sm font-semibold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100 hover:shadow-indigo-200 active:scale-95"
              >
                Login
              </button>
            )}
          </div>

          {/* Mobile Toggle */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2.5 rounded-2xl text-gray-700 bg-gray-50 border border-gray-100 active:scale-90 transition-all"
              aria-label="Toggle Menu"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      <div
        className={`md:hidden absolute top-full left-0 right-0 bg-white border-b border-gray-100 shadow-xl transition-all duration-300 overflow-hidden ${isOpen ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'
          }`}
      >
        <div className="px-6 pt-2 pb-8 space-y-2 ">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              onClick={(e) => {
                handleNavClick(e, link);
                if (!link.requireAuth || user) setIsOpen(false);
              }}
              className={`flex items-center gap-4 px-4 py-4 text-base font-semibold rounded-2xl transition-colors ${isActive(link.path)
                ? 'bg-indigo-50 text-indigo-600'
                : 'text-gray-600 hover:bg-gray-50'
                }`}
            >
              <span className="p-2 bg-white rounded-lg shadow-sm">{link.icon}</span>
              {link.name}
            </Link>
          ))}
          <div className="pt-6 flex flex-col gap-6 pr-3">
            {user ? (
              <div className='flex items-center gap-3 px-4'>
                <UserButton />
                <span className='font-medium text-gray-700'>Account</span>
              </div>
            ) : (
              <button
                onClick={() => {
                  openSignIn();
                  setIsOpen(false);
                }}
                className=" bg-indigo-600 text-white text-center py-3 rounded-2xl font-bold shadow-lg shadow-indigo-100"
              >
                Login
              </button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;