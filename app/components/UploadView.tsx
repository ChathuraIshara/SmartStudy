"use client"

import React, { useState, useRef } from 'react';
import { Upload, FileText, Layers, HelpCircle, BookOpen, CloudUpload, Loader2 } from 'lucide-react';

const UploadView = () => {
  const [isDragging, setIsDragging] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null); // State for the file
  const [isLoading, setIsLoading] = useState(false); // State for loading
  const [summary, setSummary] = useState<string>(""); // State for result
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  // --- Handlers ---

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
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      setSelectedFile(e.dataTransfer.files[0]); // Save file to state
    }
  };

  const handleBoxClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setSelectedFile(e.target.files[0]); // Save file to state
    }
  };

  // --- API Call Function ---
  const generateSummary = async () => {
    if (!selectedFile) {
      alert("Please upload a file first!");
      return;
    }

    setIsLoading(true);
    setSummary(""); // Clear previous summary

    try {
      // Create FormData to send file to server
      const formData = new FormData();
      formData.append("file", selectedFile);
      console.log("formdata",formData)

      const res = await fetch("/api/summarize", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (data.error) {
        throw new Error(data.error);
      }

      // Clean up the output (remove the prompt if Llama repeats it)
      const cleanSummary = data.summary.replace(data.summary.split('\n\n')[0], '').trim();
      setSummary(cleanSummary || data.summary);

    } catch (error) {
      console.error(error);
      alert("Failed to generate summary");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center py-20 px-4 animate-in fade-in zoom-in duration-300">
      
      {/* Title */}
      <div className="text-center mb-10 max-w-2xl">
        <h2 className="text-3xl font-bold text-gray-900 mb-3">Upload Your Notes</h2>
      </div>

      {/* Drag & Drop Area */}
      <div 
        onClick={handleBoxClick}
        className={`
          w-full max-w-3xl bg-white rounded-3xl border-2 border-dashed transition-all duration-200 ease-in-out p-12 text-center mb-8 cursor-pointer relative
          ${isDragging ? 'border-blue-500 bg-blue-50/50 scale-[1.02]' : 'border-gray-200 hover:border-blue-400 hover:bg-gray-50'}
        `}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <div className="flex flex-col items-center gap-4">
          <div className={`p-4 rounded-full transition-colors ${selectedFile ? 'bg-green-100 text-green-600' : 'bg-blue-100 text-blue-600'}`}>
            {selectedFile ? <FileText size={40} /> : <CloudUpload size={40} />}
          </div>
          
          <div className="space-y-1">
            <p className="text-lg font-semibold text-gray-700">
              {selectedFile ? selectedFile.name : "Drop your notes here"}
            </p>
            {!selectedFile && <p className="text-sm text-gray-500">or click to browse your files</p>}
          </div>
        </div>
        
        <input type="file" className="hidden" ref={fileInputRef} onChange={handleFileSelect} accept=".pdf" />
      </div>

      {/* Options Grid */}
      <div className="w-full max-w-3xl mb-8">
        <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4 ml-1">Generate Study Materials</p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* We make this card clickable to trigger the summary */}
          <button 
            onClick={generateSummary}
            disabled={isLoading || !selectedFile}
            className="text-left w-full"
          >
             <OptionCard 
               icon={isLoading ? Loader2 : FileText} 
               label={isLoading ? "Generating..." : "Summarize Notes"} 
               active={!!selectedFile}
             />
          </button>
          
          <OptionCard icon={Layers} label="Generate Flashcards" active={false} />
          <OptionCard icon={HelpCircle} label="Create Quiz" active={false} />
          <OptionCard icon={BookOpen} label="Revision Notes" active={false} />
        </div>
      </div>

      {/* RESULT DISPLAY */}
      {summary && (
        <div className="w-full max-w-3xl bg-white rounded-xl border border-gray-200 p-8 shadow-sm">
          <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
            <FileText className="text-blue-600" /> Summary
          </h3>
          <div className="prose prose-blue max-w-none text-gray-600 whitespace-pre-wrap">
            {summary}
          </div>
        </div>
      )}

    </div>
  );
};

// Updated Helper Component
const OptionCard = ({ icon: Icon, label, active }: { icon: any, label: string, active: boolean }) => (
  <div className={`
    flex items-center gap-4 p-4 bg-white border rounded-xl shadow-sm transition-all
    ${active 
      ? 'border-blue-200 hover:border-blue-400 cursor-pointer opacity-100' 
      : 'border-gray-100 opacity-60 cursor-not-allowed'}
  `}>
    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${active ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-400'}`}>
      <Icon size={20} className={label === "Generating..." ? "animate-spin" : ""} />
    </div>
    <span className="font-medium text-gray-700">{label}</span>
  </div>
);

export default UploadView;