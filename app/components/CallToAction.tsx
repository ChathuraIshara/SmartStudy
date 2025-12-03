// components/CallToAction.tsx
import React from 'react';
import { ArrowRight } from 'lucide-react';

const CallToAction = () => {
  return (
    <section className="py-16 px-4 bg-white">
      <div className="max-w-5xl mx-auto">
        <div className="bg-gradient-to-r from-blue-500 to-indigo-600 rounded-3xl p-10 md:p-16 text-center text-white shadow-xl">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to Transform Your Study Routine?
          </h2>
          <p className="text-blue-100 text-lg mb-8 max-w-xl mx-auto">
            Upload your first set of notes and experience the power of AI-assisted learning.
          </p>
          <button className="bg-white text-blue-600 px-8 py-3.5 rounded-full font-bold inline-flex items-center gap-2 hover:bg-gray-100 transition-colors">
            Start Studying Now <ArrowRight size={18} />
          </button>
        </div>
      </div>
    </section>
  );
};

export default CallToAction;