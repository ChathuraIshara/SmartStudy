"use client"

import React, { useState } from "react";
import Header from "./components/Header";
import Hero from "./components/Hero";
import Features from "./components/Features";
import CallToAction from "./components/CallToAction";
import Footer from "./components/Footer";
import UploadView from "./components/UploadView";
import SummaryView from "./components/SummaryView"; // Ensure you created this file from the previous step!

export default function Home() {
  const [currentView, setCurrentView] = useState('home');
  const [generatedSummary, setGeneratedSummary] = useState("");

  // Handler for when the upload finishes successfully
  const handleSummarySuccess = (summaryText: string) => {
    setGeneratedSummary(summaryText); // Save the text
    setCurrentView('summary');        // Switch the view
    window.scrollTo({ top: 0, behavior: 'smooth' }); // Scroll to top
  };

  return (
    <div className="min-h-screen bg-white font-sans text-slate-900">
      
      <Header 
        currentView={currentView} 
        onNavigate={setCurrentView} 
      />

      <main>
        {/* View 1: Home Landing Page */}
        {currentView === 'home' && (
          <>
            <Hero />
            <Features />
            <CallToAction />
          </>
        )}

        {/* View 2: Upload Page */}
        {currentView === 'upload' && (
          <UploadView onSummaryGenerated={handleSummarySuccess} />
        )}

        {/* View 3: Summary Page */}
        {currentView === 'summary' && (
           <SummaryView 
             summary={generatedSummary} 
             onBack={() => setCurrentView('upload')}
           />
        )}

        {/* Placeholder for future views */}
        {(currentView === 'flashcards' || currentView === 'quiz' || currentView === 'chat') && (
            <div className="py-32 text-center text-gray-500">
               Feature coming soon!
            </div>
        )}

      </main>
      
      <Footer />
    </div>
  );
}