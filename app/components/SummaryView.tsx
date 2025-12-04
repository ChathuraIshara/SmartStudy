import React from 'react';
import ReactMarkdown from 'react-markdown';
import { FileText, Sparkles, RefreshCw, Download, ArrowLeft } from 'lucide-react';

interface SummaryViewProps {
  summary: string;
  onBack: () => void;
}

const SummaryView = ({ summary, onBack }: SummaryViewProps) => {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* 1. Top Header Section */}
      <div className="text-center mb-10">
        <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-600 rounded-xl text-white shadow-lg mb-6">
          <FileText size={24} />
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-3">AI Summary</h1>
        <p className="text-gray-500 text-lg">
          Your lecture notes condensed into key concepts and insights
        </p>
      </div>

      {/* 2. Action Toolbar */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-8">
        <button 
          onClick={onBack}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 font-medium transition-colors"
        >
          <ArrowLeft size={18} /> Back to Upload
        </button>

        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 font-medium transition-colors shadow-sm">
            <RefreshCw size={16} /> Regenerate
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 font-medium transition-colors shadow-sm">
            <Download size={16} /> PDF
          </button>
        </div>
      </div>

      {/* 3. The Summary Card */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-xl overflow-hidden">
        {/* Card Header Badge */}
        <div className="bg-white p-8 pb-0 border-b border-transparent">
           <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-600 text-xs font-bold uppercase tracking-wide">
              <Sparkles size={14} />
              AI-Generated Summary
           </div>
        </div>

        {/* Content Area with Markdown Support */}
        <div className="p-8 md:p-10">
          {summary ? (
            <ReactMarkdown 
              components={{
                h1: ({node, ...props}) => <h1 className="text-2xl font-bold text-gray-900 mb-4 mt-6" {...props} />,
                h2: ({node, ...props}) => <h2 className="text-xl font-bold text-gray-800 mt-8 mb-4 border-b pb-2 border-gray-100" {...props} />,
                ul: ({node, ...props}) => <ul className="list-disc pl-5 space-y-2 mb-6 text-gray-600" {...props} />,
                li: ({node, ...props}) => <li className="pl-1" {...props} />,
                strong: ({node, ...props}) => <strong className="font-semibold text-gray-900" {...props} />,
                p: ({node, ...props}) => <p className="leading-relaxed mb-4" {...props} />,
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