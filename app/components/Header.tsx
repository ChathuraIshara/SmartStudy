import React from 'react';
import { 
  GraduationCap, 
  Home, 
  Upload, 
  FileText, 
  Layers, 
  HelpCircle, 
  MessageSquare 
} from 'lucide-react';

// 1. Define Props to accept the state from the parent page
interface HeaderProps {
  currentView: string;
  onNavigate: (view: string) => void;
}

const Header = ({ currentView, onNavigate }: HeaderProps) => {
  
  // 2. Updated Data Structure: Changed 'href' to 'id'
  const navItems = [
    { name: 'Home', id: 'home', icon: Home },
    { name: 'Upload', id: 'upload', icon: Upload },
    { name: 'Summary', id: 'summary', icon: FileText },
    { name: 'Flashcards', id: 'flashcards', icon: Layers },
    { name: 'Quiz', id: 'quiz', icon: HelpCircle },
    { name: 'Chat', id: 'chat', icon: MessageSquare },
  ];

  return (
    <header className="w-full h-20 bg-white border-b border-gray-100 px-8 flex items-center justify-between sticky top-0 z-50">
      
      {/* LEFT: Logo Section */}
      {/* Added onClick to go back to Home when logo is clicked */}
      <div 
        className="flex items-center gap-3 cursor-pointer"
        onClick={() => onNavigate('home')} 
      >
        <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white shadow-md">
          <GraduationCap size={24} />
        </div>
        <span className="text-2xl font-bold text-gray-900">
          Smart<span className="text-blue-600">Study</span>
        </span>
      </div>

      {/* CENTER: Navigation Links */}
      <nav className="hidden md:flex items-center gap-1">
        {navItems.map((item) => (
          <button
            key={item.name}
            onClick={() => onNavigate(item.id)} // <--- Triggers the view switch
            className={`
              flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-colors duration-200
              ${currentView === item.id 
                ? 'bg-blue-100 text-blue-600' // Active State
                : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900' // Inactive State
              }
            `}
          >
            <item.icon size={18} /> 
            {item.name}
          </button>
        ))}
      </nav>

      {/* RIGHT: CTA Button */}
      <div className="flex items-center">
        <button 
          // Clicking 'Get Started' also takes you to Upload view
          onClick={() => onNavigate('upload')} 
          className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white text-sm font-semibold px-6 py-2.5 rounded-full shadow-lg transition-transform transform hover:scale-105"
        >
          Get Started
        </button>
      </div>

    </header>
  );
};

export default Header;