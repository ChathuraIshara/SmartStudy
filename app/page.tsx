"use client"
import React, { useState } from "react";
import Header from "./components/Header";
import Hero from "./components/Hero";
import Features from "./components/Features";
import CallToAction from "./components/CallToAction";
import Footer from "./components/Footer";
import UploadView from "./components/UploadView";

export default function Home() {
  // This state tracks which page is currently visible
  const [currentView, setCurrentView] = useState('home');

  return (
    <div className="min-h-screen bg-white font-sans text-slate-900">
      
      {/* 1. PASS THE SETTER FUNCTION CORRECTLY HERE */}
      <Header 
        currentView={currentView} 
        onNavigate={setCurrentView} 
      />

      <main>
        {/* 2. CONDITIONAL RENDERING SWITCH */}
        
        {/* If view is 'home', show the landing page components */}
        {currentView === 'home' && (
          <>
            <Hero />
            <Features />
            <CallToAction />
          </>
        )}

        {/* If view is 'upload', show only the UploadView */}
        {currentView === 'upload' && (
          <UploadView />
        )}

        {/* You can add placeholders for other views too */}
        {currentView === 'summary' && (
           <div className="py-20 text-center">Summary Page Coming Soon</div>
        )}

      </main>
      
      <Footer />
    </div>
  );
}