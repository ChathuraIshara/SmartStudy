import React, { useState } from 'react';
import { ArrowLeft, CheckCircle, XCircle, Trophy, RefreshCw, AlertCircle } from 'lucide-react';

interface Question {
  question: string;
  options: string[];
  answer: string;
}

interface QuizViewProps {
  questions: Question[];
  onBack: () => void;
}

const QuizView = ({ questions, onBack }: QuizViewProps) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);

  // --- 1. THE FIX: GUARD CLAUSE ---
  // If questions array is empty or undefined, show an error/empty state
  // instead of trying to render the quiz and crashing.
  if (!questions || questions.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 px-4">
        <div className="bg-red-50 p-6 rounded-2xl text-center max-w-md">
           <div className="w-12 h-12 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertCircle size={24} />
           </div>
           <h3 className="text-lg font-bold text-gray-900 mb-2">No Questions Generated</h3>
           <p className="text-gray-500 mb-6">The AI couldn't generate a quiz from this text. Please try again with a different file or section.</p>
           <button onClick={onBack} className="px-6 py-2 bg-white border border-gray-200 rounded-xl font-semibold text-gray-700 hover:bg-gray-50">
             Back to Upload
           </button>
        </div>
      </div>
    );
  }

  // Now it's safe to access the array because we checked length above
  const currentQuestion = questions[currentQuestionIndex];

  const handleOptionClick = (option: string) => {
    if (isAnswered) return; 
    
    setSelectedOption(option);
    setIsAnswered(true);

    if (option === currentQuestion.answer) {
      setScore(score + 1);
    }

    // Auto-advance after 1.5 seconds
    setTimeout(() => {
      if (currentQuestionIndex < questions.length - 1) {
        setCurrentQuestionIndex(prev => prev + 1);
        setSelectedOption(null);
        setIsAnswered(false);
      } else {
        setShowResult(true);
      }
    }, 1500);
  };

  const resetQuiz = () => {
    setCurrentQuestionIndex(0);
    setScore(0);
    setSelectedOption(null);
    setIsAnswered(false);
    setShowResult(false);
  };

  // --- RESULT SCREEN ---
  if (showResult) {
    return (
      <div className="flex flex-col items-center justify-center py-20 px-4 animate-in fade-in zoom-in">
        <div className="bg-white rounded-3xl p-12 shadow-xl border border-gray-100 text-center max-w-lg w-full">
          <div className="w-20 h-20 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-6 text-yellow-600">
            <Trophy size={40} />
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Quiz Completed!</h2>
          <p className="text-gray-500 mb-8">You scored</p>
          
          <div className="text-6xl font-black text-blue-600 mb-8">
            {score}/{questions.length}
          </div>

          <div className="flex gap-4 justify-center">
            <button onClick={onBack} className=" border border-gray-200 text-gray-600 font-semibold hover:bg-blue-100 hover:text-blue-700 rounded-3xl px-3 py-2 transition-colors">
              Back to Upload
            </button>
            <button onClick={resetQuiz} className="px-6 py-3 rounded-xl bg-blue-600 text-white font-semibold hover:bg-blue-700 transition-colors flex items-center gap-2">
              <RefreshCw size={18} /> Retry Quiz
            </button>
          </div>
        </div>
      </div>
    );
  }

  // --- QUIZ SCREEN ---
  return (
    <div className="max-w-4xl mx-auto px-4 py-12 animate-in fade-in slide-in-from-bottom-4">
      
      {/* Header */}
      <div className="text-center mb-10">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Knowledge Quiz</h1>
        <p className="text-gray-500">Test your understanding with AI-generated questions</p>
      </div>

      {/* Navigation Bar */}
      <div className="flex items-center justify-between mb-8">
        <button onClick={onBack} className="flex items-center gap-2 text-gray-600 hover:bg-blue-100 hover:text-blue-700 rounded-3xl px-3 py-2 font-medium transition-colors">
          <ArrowLeft size={18} /> Back to Upload
        </button>
        <div className="bg-blue-50 text-blue-700 px-4 py-1.5 rounded-full text-sm font-bold">
          Score: {score}/{questions.length}
        </div>
      </div>

      {/* Progress Bar */}
      <div className="flex items-center justify-between text-sm text-gray-500 mb-2">
        <span>Question {currentQuestionIndex + 1} of {questions.length}</span>
      </div>
      <div className="w-full bg-gray-100 rounded-full h-2 mb-8">
        <div 
          className="bg-blue-600 h-2 rounded-full transition-all duration-300"
          style={{ width: `${((currentQuestionIndex + 1) / questions.length) * 100}%` }}
        />
      </div>

      {/* Question Card */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-lg p-8 md:p-10">
        <h3 className="text-xl font-bold text-gray-900 mb-8 leading-relaxed">
          {currentQuestion.question}
        </h3>

        <div className="space-y-4">
          {currentQuestion.options.map((option, index) => {
            const letter = String.fromCharCode(65 + index); // A, B, C, D
            let optionClass = "border-gray-200 hover:border-blue-300 hover:bg-blue-50"; 
            
            if (isAnswered) {
              if (option === currentQuestion.answer) {
                 optionClass = "border-green-500 bg-green-50 text-green-700"; 
              } else if (option === selectedOption) {
                 optionClass = "border-red-500 bg-red-50 text-red-700"; 
              } else {
                 optionClass = "border-gray-100 opacity-50"; 
              }
            }

            return (
              <button
                key={index}
                onClick={() => handleOptionClick(option)}
                disabled={isAnswered}
                className={`w-full text-left p-4 rounded-xl border-2 transition-all duration-200 flex items-center gap-4 group ${optionClass}`}
              >
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 
                  ${isAnswered && option === currentQuestion.answer ? 'bg-green-200 text-green-700' : 
                    isAnswered && option === selectedOption ? 'bg-red-200 text-red-700' : 
                    'bg-gray-100 text-gray-500 group-hover:bg-blue-200 group-hover:text-blue-700'}`}>
                  {letter}
                </div>
                
                <span className="font-medium text-lg">{option}</span>
                
                <div className="ml-auto">
                   {isAnswered && option === currentQuestion.answer && <CheckCircle className="text-green-500" size={20}/>}
                   {isAnswered && option === selectedOption && option !== currentQuestion.answer && <XCircle className="text-red-500" size={20}/>}
                </div>
              </button>
            );
          })}
        </div>
      </div>

    </div>
  );
};

export default QuizView;