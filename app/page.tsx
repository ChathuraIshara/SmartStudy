"use client"

import React, { useState } from "react";
import Header from "./components/Header";
import Hero from "./components/Hero";
import Features from "./components/Features";
import CallToAction from "./components/CallToAction";
import Footer from "./components/Footer";
import UploadView from "./components/UploadView";
import SummaryView from "./components/SummaryView"; 
import QuizView from "./components/QuizView"; 
import FlashcardView from "./components/FlashcardView";
import RevisionView from "./components/RevisionView";
import ChatView from "./components/ChatView";

export default function Home() {
  const [currentView, setCurrentView] = useState('home');
  const [generatedSummary, setGeneratedSummary] = useState("");
  const [generatedQuiz, setGeneratedQuiz] = useState([]); 
  const [generatedFlashcards, setGeneratedFlashcards] = useState([]); 
  const [generatedRevision, setGeneratedRevision] = useState([]); 
  const [chatContext, setChatContext] = useState(""); // <--- New State for PDF text

  // Handler for when the upload finishes successfully
  const handleSummarySuccess = (summaryText: string) => {
    setGeneratedSummary(summaryText); // Save the text
    setCurrentView('summary');        // Switch the view
    window.scrollTo({ top: 0, behavior: 'smooth' }); // Scroll to top
  };

  // New Handler
  const handleQuizSuccess = (quizData: any) => {
    setGeneratedQuiz(quizData);
    setCurrentView('quiz');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleFlashcardsSuccess = (cards: any) => {
    setGeneratedFlashcards(cards);
    setCurrentView('flashcards');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleRevisionSuccess = (notes: any) => {
    setGeneratedRevision(notes);
    setCurrentView('revision');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleChatStart = (text: string) => {
    setChatContext(text);
    setCurrentView('chat');
    window.scrollTo({ top: 0, behavior: 'smooth' });
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
           <Hero onNavigate={setCurrentView} />
            <Features />
            <CallToAction />
          </>
        )}

        {/* View 2: Upload Page */}
        {currentView === 'upload' && (
          <UploadView onSummaryGenerated={handleSummarySuccess} onQuizGenerated={handleQuizSuccess} onFlashcardsGenerated={handleFlashcardsSuccess} onRevisionGenerated={handleRevisionSuccess} onChatStart={handleChatStart} />
        )}

        {/* View 3: Summary Page */}
        {currentView === 'summary' && (
           <SummaryView 
             summary={generatedSummary} 
             onBack={() => setCurrentView('upload')}
           />
        )}

        {/* NEW QUIZ VIEW RENDER */}
        {currentView === 'quiz' && (
           <QuizView 
             questions={generatedQuiz}
             onBack={() => setCurrentView('upload')}
           />
        )}

        {currentView === 'flashcards' && (
           <FlashcardView 
             flashcards={generatedFlashcards}
             onBack={() => setCurrentView('upload')}
           />
        )}

        {currentView === 'revision' && (
           <RevisionView 
             notes={generatedRevision}
             onBack={() => setCurrentView('upload')}
           />
        )}

        

        {/* Placeholder for future views */}
       {currentView === 'chat' && (
           <ChatView 
             context={chatContext}
             onBack={() => setCurrentView('upload')}
           />
        )}

      </main>
      
      <Footer />
    </div>
  );
}