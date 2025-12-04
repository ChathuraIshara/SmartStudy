import React from 'react';
import { FileText, Layers, HelpCircle, BookOpen } from 'lucide-react';

const features = [
  {
    title: 'Smart Summaries',
    desc: 'Transform lengthy lecture notes into concise, easy-to-understand summaries powered by AI.',
    icon: FileText,
  },
  {
    title: 'Flashcards',
    desc: 'Auto-generate flashcards from your notes for effective spaced repetition learning.',
    icon: Layers,
  },
  {
    title: 'Quiz Generator',
    desc: 'Test your knowledge with AI-generated multiple-choice questions from your material.',
    icon: HelpCircle,
  },
  {
    title: 'Revision Notes',
    desc: 'Get bullet-point revision notes that highlight the most important concepts.',
    icon: BookOpen,
  },
];

const Features = () => {
  return (
    <section className="py-24 bg-white">
      <div className="max-w-6xl mx-auto px-4">
        
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Everything You Need to <span className="text-blue-600">Study Smarter</span>
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Our AI analyzes your notes and generates personalized study materials to help you learn faster and retain more.
          </p>
        </div>

        {/* Feature Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div key={index} className="p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow bg-white">
              <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600 mb-4">
                <feature.icon size={24} />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">{feature.title}</h3>
              <p className="text-sm text-gray-500 leading-relaxed">{feature.desc}</p>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};

export default Features;