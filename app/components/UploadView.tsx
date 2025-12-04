"use client"

import React, { useState, useRef, useEffect } from 'react';
import { 
  Upload, FileText, Layers, HelpCircle, BookOpen, CloudUpload, 
  Loader2, FileSearch, X, CheckCircle,MessageSquare
} from 'lucide-react';

interface UploadViewProps {
  onSummaryGenerated: (summary: string) => void;
  onQuizGenerated: (quizData: any) => void; 
  onFlashcardsGenerated: (flashcards: any) => void;
  onRevisionGenerated: (notes: any) => void;
  onChatStart: (text: string) => void;
}

const UploadView = ({ onSummaryGenerated, onQuizGenerated,onFlashcardsGenerated, onRevisionGenerated, onChatStart }: UploadViewProps) => {
  const [isDragging, setIsDragging] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isQuizLoading, setIsQuizLoading] = useState(false);
  
  // Preview States
  const [previewText, setPreviewText] = useState("");
  const [isExtracting, setIsExtracting] = useState(false);

  const [isFlashcardsLoading, setIsFlashcardsLoading] = useState(false); 
  const [isRevisionLoading, setIsRevisionLoading] = useState(false); 

  // Toast Notification State
  const [showSuccessToast, setShowSuccessToast] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // --- 1. Auto-Extract & Show Toast Effect ---
  useEffect(() => {
    const fetchPreview = async () => {
      if (!selectedFile) return;

      setIsExtracting(true);
      setPreviewText(""); 
      setShowSuccessToast(false); // Reset toast

      try {
        const formData = new FormData();
        formData.append("file", selectedFile);

        const res = await fetch("/api/extract", { method: "POST", body: formData });
        const data = await res.json();

        if (data.text) {
          setPreviewText(data.text);
          setShowSuccessToast(true); // <--- SHOW POPUP HERE

          // Optional: Auto-hide the popup after 4 seconds
          setTimeout(() => setShowSuccessToast(false), 4000);
        }
      } catch (err) {
        console.error("Failed to extract preview", err);
      } finally {
        setIsExtracting(false);
      }
    };

    fetchPreview();
  }, [selectedFile]);


  // --- Handlers ---
  const handleDragOver = (e: React.DragEvent) => { e.preventDefault(); setIsDragging(true); };
  const handleDragLeave = () => { setIsDragging(false); };
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault(); setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) setSelectedFile(e.dataTransfer.files[0]);
  };
  const handleBoxClick = () => fileInputRef.current?.click();
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) setSelectedFile(e.target.files[0]);
  };

  const generateFlashcards = async () => {
    if (!selectedFile) return alert("Please upload a file first!");
    
    setIsFlashcardsLoading(true);
    try {
      const formData = new FormData();
      formData.append("file", selectedFile);
      
      const res = await fetch("/api/flashcards", { method: "POST", body: formData });
      const data = await res.json();

      if (data.error) throw new Error(data.error);
      
      onFlashcardsGenerated(data.flashcards); // Send to parent

    } catch (error) {
      console.error(error);
      alert("Failed to generate flashcards.");
    } finally {
      setIsFlashcardsLoading(false);
    }
  };

  const generateRevision = async () => {
    if (!selectedFile) return alert("Please upload a file first!");
    
    setIsRevisionLoading(true);
    try {
      const formData = new FormData();
      formData.append("file", selectedFile);
      
      const res = await fetch("/api/revision", { method: "POST", body: formData });
      const data = await res.json();

      if (data.error) throw new Error(data.error);
      
      onRevisionGenerated(data.revision);

    } catch (error) {
      console.error(error);
      alert("Failed to generate revision notes.");
    } finally {
      setIsRevisionLoading(false);
    }
  };

  const generateSummary = async () => {
    if (!selectedFile) return alert("Please upload a file first!");
    setIsLoading(true);
    try {
      const formData = new FormData();
      formData.append("file", selectedFile);
      const res = await fetch("/api/summarize", { method: "POST", body: formData });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      const cleanSummary = data.summary.replace(data.summary.split('\n\n')[0], '').trim();
      onSummaryGenerated(cleanSummary || data.summary);
    } catch (error) {
      console.error(error);
      alert("Failed to generate summary");
    } finally {
      setIsLoading(false);
    }
  };

  const generateQuiz = async () => {
    if (!selectedFile) return alert("Please upload a file first!");
    
    setIsQuizLoading(true);
    try {
      const formData = new FormData();
      formData.append("file", selectedFile);
      
      const res = await fetch("/api/quiz", { method: "POST", body: formData });
      const data = await res.json();

      if (data.error) throw new Error(data.error);
      
      // Send data to parent
      onQuizGenerated(data.quiz);

    } catch (error) {
      console.error(error);
      alert("Failed to generate quiz. Try again.");
    } finally {
      setIsQuizLoading(false);
    }
  };

  const handleChatClick = () => {
    if (!selectedFile) return alert("Please upload a file first!");
    if (!previewText) return alert("Still extracting text, please wait a moment...");
    
    // Pass the extracted text to the parent
    onChatStart(previewText);
  };

  return (
    <div className="flex flex-col items-center justify-center py-20 px-4 animate-in fade-in zoom-in duration-300 relative">
      
      {/* --- NEW: SUCCESS TOAST POPUP --- */}
      {showSuccessToast && (
        <div className="fixed top-24 right-4 md:right-8 z-50 bg-white p-5 rounded-xl shadow-2xl border border-gray-100 max-w-sm animate-in slide-in-from-right-10 duration-300 flex items-start gap-4">
          <button 
            onClick={() => setShowSuccessToast(false)}
            className="absolute top-3 right-3 text-gray-400 hover:text-gray-600"
          >
            <X size={16} />
          </button>
          
          <div className="w-10 h-10 bg-green-50 rounded-full flex items-center justify-center flex-shrink-0 text-green-600">
             <CheckCircle size={20} />
          </div>

          <div>
            <h4 className="font-bold text-gray-900 mb-1">File uploaded successfully</h4>
            <p className="text-sm text-gray-500 leading-relaxed">
              Your notes have been processed and are ready for AI generation.
            </p>
          </div>
        </div>
      )}
      {/* ------------------------------- */}

      {/* Title */}
      <div className="text-center mb-10 max-w-2xl">
        <h2 className="text-3xl font-bold text-gray-900 mb-3">Upload Your Notes</h2>
        <p className="text-gray-500 text-lg">
          Upload your lecture notes or study materials to generate AI-powered study aids
        </p>
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
            <p className="text-lg font-semibold text-gray-700">{selectedFile ? selectedFile.name : "Drop your notes here"}</p>
            {!selectedFile && <p className="text-sm text-gray-500">or click to browse your files</p>}
          </div>
        </div>
        <input type="file" className="hidden" ref={fileInputRef} onChange={handleFileSelect} accept=".pdf" />
      </div>

      {/* Extracted Text Preview */}
      {(previewText || isExtracting) && (
        <div className="w-full max-w-3xl mb-8 animate-in slide-in-from-bottom-2">
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="bg-gray-50 px-6 py-4 border-b border-gray-100 flex items-center gap-2">
               <FileSearch size={16} className="text-gray-400"/>
               <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Extracted Text Preview</span>
            </div>
            <div className="p-6">
              <p className="text-sm text-gray-500 mb-4">
                This is a preview of the extracted text from <span className="font-semibold text-gray-700">"{selectedFile?.name}"</span>.
              </p>
              <div className="bg-gray-50 rounded-lg p-4 h-64 overflow-y-auto border border-gray-100">
                {isExtracting ? (
                  <div className="flex items-center justify-center h-full text-gray-400 gap-2">
                    <Loader2 className="animate-spin" size={20} /> Extracting text...
                  </div>
                ) : (
                  <p className="text-sm text-gray-600 whitespace-pre-wrap font-mono leading-relaxed">
                    {previewText}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Options Grid */}
      <div className="w-full max-w-3xl mb-8">
        <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4 ml-1">Generate Study Materials</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <button 
            onClick={generateSummary} 
            disabled={isLoading || !selectedFile || !previewText}
            className="text-left w-full"
          >
             <OptionCard icon={isLoading ? Loader2 : FileText} label={isLoading ? "Generating..." : "Summarize Notes"} active={!!selectedFile}/>
          </button>
        <button onClick={generateFlashcards} disabled={isFlashcardsLoading || !selectedFile} className="text-left w-full">
           <OptionCard 
             icon={isFlashcardsLoading ? Loader2 : Layers} 
             label={isFlashcardsLoading ? "Generating Cards..." : "Generate Flashcards"} 
             active={!!selectedFile}
           />
        </button>
        <button onClick={generateQuiz} disabled={isQuizLoading || !selectedFile} className="text-left w-full">
           <OptionCard 
             icon={isQuizLoading ? Loader2 : HelpCircle} 
             label={isQuizLoading ? "Creating Quiz..." : "Create Quiz"} 
             active={!!selectedFile}
           />
        </button>
         <button onClick={generateRevision} disabled={isRevisionLoading || !selectedFile} className="text-left w-full">
            <OptionCard 
               icon={isRevisionLoading ? Loader2 : BookOpen} 
               label={isRevisionLoading ? "Drafting Notes..." : "Revision Notes"} 
               active={!!selectedFile}
            />
         </button>
         <button onClick={handleChatClick} disabled={!selectedFile || !previewText} className="text-left w-full md:col-span-2">
             <OptionCard 
               icon={MessageSquare} 
               label="Chat with your Notes" 
               active={!!selectedFile}
             />
          </button>
        </div>
      </div>
    </div>
  );
};

const OptionCard = ({ icon: Icon, label, active }: { icon: any, label: string, active: boolean }) => (
  <div className={`
    flex items-center gap-4 p-4 bg-white border rounded-xl shadow-sm transition-all
    ${active 
      ? 'border-blue-200 hover:border-blue-400 cursor-pointer opacity-100' 
      : 'border-gray-100 opacity-60 cursor-not-allowed'}
  `}>
    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${active ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-400'}`}>
      <Icon 
        size={20} 
        // FIX: Check for "Generating Cards..." OR simply check if it includes "..."
        className={
          (label === "Generating..." || label === "Creating Quiz..." || label === "Generating Cards...") 
          ? "animate-spin" 
          : ""
        } 
      />
    </div>
    <span className="font-medium text-gray-700">{label}</span>
  </div>
);
export default UploadView;