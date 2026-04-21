import React from 'react';
import { assets } from '../assets/assets';

const Footer = () => {
  return (
    <footer className="px-6 md:px-16 lg:px-24 xl:px-32 pt-16 w-full text-gray-500 bg-white mt-38">
      <div className="flex flex-col md:flex-row justify-between w-full gap-10 border-b border-gray-100 pb-12">
        <div className="md:max-w-96">
          <div className="flex items-center gap-2 mb-6">
            <img src={assets.logo} alt="" />
          </div>
          <p className="text-sm leading-relaxed">
            The world's leading marketplace for social media assets and digital accounts. Secure, fast, and trusted by thousands of creators worldwide.
          </p>
        </div>
        <div className="flex-1 flex flex-wrap items-start md:justify-end gap-12 md:gap-24">
          <div>
            <h2 className="font-semibold mb-6 text-gray-900 italic">Company</h2>
            <ul className="text-sm space-y-3">
              <li><a href="#" className="hover:text-blue-600 transition-colors">Home</a></li>
              <li><a href="#" className="hover:text-blue-600 transition-colors">About us</a></li>
              <li><a href="#" className="hover:text-blue-600 transition-colors">Contact us</a></li>
              <li><a href="#" className="hover:text-blue-600 transition-colors">Privacy policy</a></li>
            </ul>
          </div>
          <div className="max-w-md">
            <h2 className="font-semibold text-gray-900 mb-6 italic">Subscribe to our newsletter</h2>
            <div className="text-sm space-y-4">
              <p>The latest news, articles, and resources, sent to your inbox weekly.</p>
              <div className="flex items-center gap-2 pt-2">
                <input className="border border-gray-200 bg-gray-50 placeholder-gray-400 focus:ring-2 ring-blue-600 outline-none w-full max-w-64 h-11 rounded-xl px-4 transition-all" type="email" placeholder="Enter your email" />
                <button className="bg-blue-600 h-11 px-6 text-white rounded-xl font-medium hover:bg-blue-700 transition-all flex-shrink-0 cursor-pointer shadow-lg shadow-blue-500/20">Subscribe</button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="py-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs md:text-sm">
        <p>Copyright 2026 ©  All Rights Reserved.</p>
        <div className="flex gap-6">
          <a href="#" className="hover:text-gray-900 transition-colors">Terms of Service</a>
          <a href="#" className="hover:text-gray-900 transition-colors">Cookie Policy</a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
