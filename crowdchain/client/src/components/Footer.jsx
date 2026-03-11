import React from 'react';
import { Heart } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="mt-20 border-t border-white/10 bg-black/40 backdrop-blur-xl relative z-10 w-full">
      <div className="max-w-7xl mx-auto px-6 py-8 flex flex-col md:flex-row justify-between items-center gap-4">
        
        {/* Brand Section */}
        <div className="flex flex-col items-center md:items-start">
          <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-indigo-400">
            TechMagnitude
          </span>
          <p className="text-gray-500 text-sm mt-1">Next-Gen Web3 Infrastructure</p>
        </div>

        {/* Founder Credits */}
        <div className="flex items-center gap-2 text-gray-400 text-sm">
          <span>Architected with</span>
          <Heart className="w-4 h-4 text-pink-500 fill-pink-500 animate-pulse" />
          <span>by</span>
          <a href="#" className="font-semibold text-white hover:text-blue-400 transition-colors">
            Abhinav Dash
          </a>
        </div>

        {/* Links / Copyright */}
        <div className="text-gray-600 text-xs">
          &copy; {new Date().getFullYear()} CrowdChain by TechMagnitude. All rights reserved.
        </div>
        
      </div>
    </footer>
  );
};

export default Footer;
