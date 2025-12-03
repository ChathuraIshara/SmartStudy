// components/Hero.tsx
import React from 'react';
import { ArrowRight, Upload, Sparkles, FileText, CheckCircle } from 'lucide-react';

const Hero = () => {
  return (
    <section className="pt-20 pb-16 px-4 bg-gradient-to-b from-white to-blue-50/30">
      <div className="max-w-6xl mx-auto text-center">
        
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100 text-blue-600 text-xs font-medium mb-6">
          <Sparkles size={14} />
          AI-Powered Study Helper
        </div>

        {/* Headline */}
        <h1 className="text-5xl md:text-6xl font-extrabold text-gray-900 tracking-tight mb-6">
          Smart Study <span className="text-blue-600">Assistant</span>
        </h1>

        {/* Subtitle */}
        <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto mb-10 leading-relaxed">
          Summaries, Flashcards, Quiz Questions — Transform your lecture notes into
          powerful study materials with AI-powered assistance.
        </p>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-20">
          <button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-8 py-3.5 rounded-full font-semibold transition-all shadow-lg hover:shadow-blue-200">
            Get Started <ArrowRight size={18} />
          </button>
          <button className="flex items-center gap-2 bg-white hover:bg-blue-500 hover:text-white text-gray-700 border border-gray-200 px-8 py-3.5 rounded-full font-semibold transition-all">
            <Upload size={18} /> Upload Notes
          </button>
        </div>

        {/* Abstract Visual Cards (The 3 cards at the bottom of your screenshot) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 opacity-90 max-w-4xl mx-auto">
           {/* Card 1 */}
           <div className="bg-blue-50 p-6 rounded-xl border border-blue-100">
              <div className="w-8 h-8 bg-blue-200 rounded-lg mb-4 flex items-center justify-center text-blue-600"><Upload size={16}/></div>
              <div className="h-2 bg-blue-200 rounded w-3/4 mb-2"></div>
              <div className="h-2 bg-blue-200 rounded w-1/2"></div>
           </div>
           {/* Card 2 */}
           <div className="bg-indigo-50 p-6 rounded-xl border border-indigo-100 transform md:-translate-y-4">
              <div className="w-8 h-8 bg-indigo-200 rounded-lg mb-4 flex items-center justify-center text-indigo-600"><Sparkles size={16}/></div>
              <div className="h-2 bg-indigo-200 rounded w-3/4 mb-2"></div>
              <div className="h-2 bg-indigo-200 rounded w-full mb-2"></div>
              <div className="h-2 bg-indigo-200 rounded w-2/3"></div>
           </div>
           {/* Card 3 */}
           <div className="bg-green-50 p-6 rounded-xl border border-green-100">
              <div className="w-8 h-8 bg-green-200 rounded-lg mb-4 flex items-center justify-center text-green-600"><FileText size={16}/></div>
              <div className="h-2 bg-green-200 rounded w-3/4 mb-2"></div>
              <div className="h-2 bg-green-200 rounded w-1/2"></div>
           </div>
        </div>

      </div>
    </section>
  );
};

export default Hero;