import React, { useState } from 'react';
import { ArrowLeft, BookOpen, Download, RefreshCw, Loader2, CheckCircle, FileText } from 'lucide-react';

interface RevisionSection {
  title: string;
  points: string[];
}

interface RevisionViewProps {
  notes: RevisionSection[];
  onBack: () => void;
}

const RevisionView = ({ notes, onBack }: RevisionViewProps) => {
  const [isDownloading, setIsDownloading] = useState(false);

  const handleDownloadPDF = async () => {
    setIsDownloading(true);

    try {
      const html2pdf = (await import('html2pdf.js')).default;
      const element = document.createElement('div');
      
      // Build clean HTML string for PDF
      const contentHTML = `
        <div style="font-family: Arial, sans-serif; padding: 40px; color: #333;">
          <h1 style="text-align: center; color: #2563eb; font-size: 24px; margin-bottom: 10px;">Revision Notes</h1>
          <p style="text-align: center; color: #666; font-size: 14px; margin-bottom: 30px;">SmartStudy Generated Summary</p>
          <hr style="border: 1px solid #eee; margin-bottom: 30px;" />

          ${notes.map((section) => `
            <div style="margin-bottom: 25px;">
              <h2 style="color: #1e40af; font-size: 18px; border-bottom: 2px solid #dbeafe; padding-bottom: 8px; margin-bottom: 12px;">
                ${section.title}
              </h2>
              <ul style="list-style: none; padding: 0;">
                ${section.points.map(point => `
                  <li style="margin-bottom: 8px; padding-left: 20px; position: relative;">
                    <span style="color: #16a34a; font-weight: bold; position: absolute; left: 0;">✓</span>
                    ${point}
                  </li>
                `).join('')}
              </ul>
            </div>
          `).join('')}
        </div>
      `;

      element.innerHTML = contentHTML;

      const opt:any = {
        margin:       0.5,
        filename:     'SmartStudy-RevisionNotes.pdf',
        image:        { type: 'jpeg' as const, quality: 0.98 },
        html2canvas:  { scale: 2 },
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
    <div className="max-w-4xl mx-auto px-4 py-12 animate-in fade-in slide-in-from-bottom-4">
      
      {/* Header */}
      <div className="text-center mb-10">
        <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-600 rounded-xl text-white shadow-lg mb-6">
          <BookOpen size={24} />
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-3">Revision Notes</h1>
        <p className="text-gray-500 text-lg">Compact bullet-point notes for quick revision</p>
      </div>

      {/* Toolbar */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-8">
        <button onClick={onBack} className="flex items-center gap-2 text-gray-600 hover:bg-blue-100 hover:text-blue-700 rounded-3xl px-3 py-2 font-medium transition-colors">
          <ArrowLeft size={18} /> Back to Upload
        </button>

        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 font-medium transition-colors">
            <RefreshCw size={16} /> Regenerate
          </button>
          <button 
             onClick={handleDownloadPDF}
             disabled={isDownloading}
             className="flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-600 border border-blue-100 rounded-lg hover:bg-blue-100 font-medium transition-colors"
          >
             {isDownloading ? <Loader2 className="animate-spin" size={16}/> : <Download size={16} />} 
             {isDownloading ? "Saving..." : "Download"}
          </button>
        </div>
      </div>

      {/* NOTES CONTENT */}
      <div className="space-y-6">
        {notes.map((section, index) => (
          <div key={index} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8 hover:shadow-md transition-shadow">
            
            {/* Section Title */}
            <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-blue-500"></span>
              {section.title}
            </h3>

            {/* Bullet Points */}
            <div className="space-y-4">
              {section.points.map((point, i) => (
                <div key={i} className="flex items-start gap-3">
                  <div className="mt-1 flex-shrink-0 text-green-500">
                    <CheckCircle size={18} />
                  </div>
                  <p className="text-gray-600 leading-relaxed">{point}</p>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Footer Tip */}
      <div className="text-center mt-12 flex items-center justify-center gap-2 text-gray-400 text-sm">
         <span className="text-yellow-500">💡</span> 
         Tip: These notes are optimized for printing and quick review
      </div>

    </div>
  );
};

export default RevisionView;