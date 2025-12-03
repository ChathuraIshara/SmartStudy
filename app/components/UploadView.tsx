"use client"

import React, { useState } from 'react';
import { Upload, FileText, Layers, HelpCircle, BookOpen, CloudUpload } from 'lucide-react';

const UploadView = () => {
  const [isDragging, setIsDragging] = useState(false);

  // Drag and Drop Handlers
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    console.log("Files dropped");
    // Add your file handling logic here
  };

  return (
    <div className="flex flex-col items-center justify-center py-20 px-4 animate-in fade-in zoom-in duration-300">
      
      {/* 1. Title Section */}
      <div className="text-center mb-10 max-w-2xl">
        <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-600 rounded-xl text-white shadow-lg mb-6">
          <Upload size={24} />
        </div>
        <h2 className="text-3xl font-bold text-gray-900 mb-3">
          Upload Your Notes
        </h2>
        <p className="text-gray-500 text-lg">
          Upload your lecture notes or study materials to generate AI-powered study aids
        </p>
      </div>

      {/* 2. Drag & Drop Area */}
      <div 
        className={`
          w-full max-w-3xl bg-white rounded-3xl border-2 border-dashed transition-all duration-200 ease-in-out p-12 text-center mb-12 cursor-pointer
          ${isDragging 
            ? 'border-blue-500 bg-blue-50/50 scale-[1.02]' 
            : 'border-gray-200 hover:border-blue-400 hover:bg-gray-50'
          }
        `}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <div className="flex flex-col items-center gap-4">
          <div className={`p-4 rounded-full transition-colors ${isDragging ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-400'}`}>
            <CloudUpload size={40} />
          </div>
          
          <div className="space-y-1">
            <p className="text-lg font-semibold text-gray-700">
              Drop your notes here
            </p>
            <p className="text-sm text-gray-500">
              or click to browse your files
            </p>
          </div>

          <div className="flex gap-2 mt-2">
            <span className="px-3 py-1 bg-blue-50 text-blue-600 text-xs font-medium rounded-full">PDF</span>
            <span className="px-3 py-1 bg-blue-50 text-blue-600 text-xs font-medium rounded-full">TXT</span>
            <span className="px-3 py-1 bg-blue-50 text-blue-600 text-xs font-medium rounded-full">DOCX</span>
          </div>
        </div>
        
        {/* Hidden Input for clicking functionality */}
        <input type="file" className="hidden" />
      </div>

      {/* 3. Options Grid */}
      <div className="w-full max-w-3xl">
        <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4 ml-1">
          Generate Study Materials
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <OptionCard icon={FileText} label="Summarize Notes" />
          <OptionCard icon={Layers} label="Generate Flashcards" />
          <OptionCard icon={HelpCircle} label="Create Quiz" />
          <OptionCard icon={BookOpen} label="Revision Notes" />
        </div>
      </div>

    </div>
  );
};

// Helper component for the bottom grid cards to keep code clean
const OptionCard = ({ icon: Icon, label }: { icon: any, label: string }) => (
  <div className="flex items-center gap-4 p-4 bg-white border border-gray-100 rounded-xl shadow-sm opacity-60 hover:opacity-100 transition-opacity cursor-not-allowed">
    <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center text-blue-600">
      <Icon size={20} />
    </div>
    <span className="font-medium text-gray-700">{label}</span>
  </div>
);

export default UploadView;