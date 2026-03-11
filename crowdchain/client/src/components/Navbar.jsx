import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useWallet } from '../context/WalletContext';
import { motion } from 'framer-motion';
import { Menu, X, Ticket, ShieldHalf, CalendarDays, KeyRound } from 'lucide-react';

const Navbar = () => {
  const { address, connectWallet, isConnecting } = useWallet();
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Home', path: '/', icon: <ShieldHalf className="w-4 h-4" /> },
    { name: 'Events', path: '/events', icon: <CalendarDays className="w-4 h-4" /> },
    { name: 'My Tickets', path: '/my-tickets', icon: <Ticket className="w-4 h-4" /> },
    { name: 'Admin', path: '/admin', icon: <KeyRound className="w-4 h-4" /> }
  ];

  return (
    <motion.nav 
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${scrolled ? 'glass py-3' : 'bg-transparent py-5'}`}
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-12 flex justify-between items-center">
        <Link to="/" className="flex items-center gap-2 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center text-white font-bold text-xl shadow-lg group-hover:shadow-blue-500/50 transition-all">
            C
          </div>
          <span className="font-bold text-2xl tracking-tight text-white hidden sm:block">
            Crowd<span className="text-blue-500">Chain</span>
          </span>
        </Link>
        
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link 
              key={link.path} 
              to={link.path} 
              className={`flex items-center gap-2 font-medium transition-colors ${location.pathname === link.path ? 'text-blue-400' : 'text-gray-400 hover:text-white'}`}
            >
              {link.icon}
              {link.name}
            </Link>
          ))}
        </div>

        <div>
          {address ? (
            <div className="glass px-4 py-2 rounded-full border border-white/10 text-sm font-medium text-blue-300 flex items-center gap-2 shadow-inner shadow-blue-500/10">
              <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></div>
              {address.slice(0, 6)}...{address.slice(-4)}
            </div>
          ) : (
            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={connectWallet} 
              disabled={isConnecting}
              className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-2.5 rounded-full font-medium transition-all shadow-[0_0_20px_rgba(59,130,246,0.4)] disabled:opacity-70 flex items-center gap-2"
            >
              {isConnecting ? 'Connecting...' : 'Connect Wallet'}
            </motion.button>
          )}
        </div>
      </div>
    </motion.nav>
  );
};

export default Navbar;
