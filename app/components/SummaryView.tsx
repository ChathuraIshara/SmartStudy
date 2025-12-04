import React, { useRef, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { FileText, Sparkles, RefreshCw, Download, ArrowLeft, Loader2 } from 'lucide-react';

interface SummaryViewProps {
  summary: string;
  onBack: () => void;
}

const SummaryView = ({ summary, onBack }: SummaryViewProps) => {
  const summaryContentRef = useRef<HTMLDivElement>(null);
  const [isDownloading, setIsDownloading] = useState(false);

  const handleDownloadPDF = async () => {
    if (!summaryContentRef.current) return;
    
    setIsDownloading(true);

    try {
      // Dynamic import to prevent server-side errors
      const html2pdf = (await import('html2pdf.js')).default;
      const element = summaryContentRef.current;
      
      const opt = {
        margin:       [0.5, 0.5],
        filename:     'SmartStudy-Summary.pdf',
        image:        { type: 'jpeg', quality: 0.98 },
        html2canvas:  { scale: 2, useCORS: true },
        jsPDF:        { unit: 'in', format: 'letter', orientation: 'portrait' }
      };

      await html2pdf().set(opt).from(element).save();
    } catch (error) {
      console.error("PDF Generation failed", error);
      alert("Could not generate PDF. Please try again.");
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* Top Header Section */}
      <div className="text-center mb-10">
        <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-600 rounded-xl text-white shadow-lg mb-6">
          <FileText size={24} />
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-3">AI Summary</h1>
        <p className="text-gray-500 text-lg">
          Your lecture notes condensed into key concepts and insights
        </p>
      </div>

      {/* Action Toolbar */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-8">
        <button 
          onClick={onBack}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 font-medium transition-colors"
        >
          <ArrowLeft size={18} /> Back to Upload
        </button>

        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 text-gray-700 rounded-lg hover:bg-blue-50 font-medium transition-colors shadow-sm">
            <RefreshCw size={16} /> Regenerate
          </button>
          
          <button 
            onClick={handleDownloadPDF}
            disabled={isDownloading}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 text-gray-700 rounded-lg hover:bg-blue-50 font-medium transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isDownloading ? <Loader2 size={16} className="animate-spin" /> : <Download size={16} />}
            {isDownloading ? "Saving..." : "PDF"}
          </button>
        </div>
      </div>

      {/* The Summary Card */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-xl overflow-hidden">
        
        {/* Card Header Badge */}
        <div className="bg-white p-8 pb-0 border-b border-transparent">
           <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#eff6ff] text-[#2563eb] text-xs font-bold uppercase tracking-wide">
              <Sparkles size={14} />
              AI-Generated Summary
           </div>
        </div>

        {/* Content Area with Explicit Hex Colors (Fixes 'lab' error) */}
        <div className="p-8 md:p-10" ref={summaryContentRef}>
          {summary ? (
            <ReactMarkdown 
              components={{
                h1: ({node, ...props}) => <h1 className="text-2xl font-bold text-[#111827] mb-4 mt-6" {...props} />,
                h2: ({node, ...props}) => <h2 className="text-xl font-bold text-[#1f2937] mt-8 mb-4 border-b pb-2 border-gray-100" {...props} />,
                h3: ({node, ...props}) => <h3 className="text-lg font-semibold text-[#374151] mt-6 mb-3" {...props} />,
                ul: ({node, ...props}) => <ul className="list-disc pl-5 space-y-2 mb-6 text-[#4b5563]" {...props} />,
                li: ({node, ...props}) => <li className="pl-1" {...props} />,
                strong: ({node, ...props}) => <strong className="font-semibold text-[#111827]" {...props} />,
                p: ({node, ...props}) => <p className="leading-relaxed mb-4 text-[#4b5563]" {...props} />,
                blockquote: ({node, ...props}) => <blockquote className="border-l-4 border-blue-200 pl-4 my-4 italic text-[#4b5563]" {...props} />,
              }}
            >
              {summary}
            </ReactMarkdown>
          ) : (
            <div className="text-center py-20 text-gray-400">
              <p>No summary generated yet. Please upload a document first.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SummaryView;