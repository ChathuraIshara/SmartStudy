import React from 'react';
import Link from 'next/link';
import { GraduationCap, Github, Twitter, Mail } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-white border-t border-gray-100 pt-16 pb-8">
      <div className="max-w-6xl mx-auto px-4">
        
        {/* Top Section: Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          
          {/* Column 1: Branding & Description (Spans 2 columns on medium screens for better spacing) */}
          <div className="md:col-span-2">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white shadow-sm">
                <GraduationCap size={18} />
              </div>
              <span className="text-xl font-bold text-gray-900">
                Smart<span className="text-blue-600">Study</span>
              </span>
            </Link>
            <p className="text-gray-500 leading-relaxed max-w-sm">
              AI-powered study assistant that transforms your lecture notes into 
              summaries, flashcards, quizzes, and revision notes.
            </p>
          </div>

          {/* Column 2: Quick Links */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-4">Quick Links</h3>
            <ul className="space-y-3">
              {['Home', 'Upload', 'Summary', 'Flashcards', 'Quiz', 'Chat'].map((item) => (
                <li key={item}>
                  <Link href="#" className="text-gray-500 hover:text-blue-600 transition-colors text-sm">
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Support */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-4">Support</h3>
            <ul className="space-y-3">
              {['About', 'Contact', 'Privacy', 'Terms'].map((item) => (
                <li key={item}>
                  <Link href="#" className="text-gray-500 hover:text-blue-600 transition-colors text-sm">
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Section: Copyright & Socials */}
        <div className="pt-8 border-t border-gray-100 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-gray-400 text-sm">
            © 2025 Smart Study Assistant. All rights reserved.
          </p>
          
          <div className="flex items-center gap-6">
            <Link href="#" className="text-gray-400 hover:text-gray-600 transition-colors">
              <Github size={20} />
            </Link>
            <Link href="#" className="text-gray-400 hover:text-gray-600 transition-colors">
              <Twitter size={20} />
            </Link>
            <Link href="#" className="text-gray-400 hover:text-gray-600 transition-colors">
              <Mail size={20} />
            </Link>
          </div>
        </div>

      </div>
    </footer>
  );
};

export default Footer;