import React from 'react';
import { 
  GraduationCap, 
  Home, 
  Upload, 
  FileText, 
  Layers, 
  HelpCircle, 
  MessageSquare,
  Heart,
  PawPrint // 1. Added PawPrint
} from 'lucide-react';

interface HeaderProps {
  currentView: string;
  onNavigate: (view: string) => void;
}

const Header = ({ currentView, onNavigate }: HeaderProps) => {
  
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
      <div 
        className="flex items-center gap-3 cursor-pointer group"
        onClick={() => onNavigate('home')} 
      >
        <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white shadow-md transition-transform group-hover:scale-105">
          <GraduationCap size={24} />
        </div>
        
        <div className="flex items-center">
          <span className="text-2xl font-bold text-gray-900">
            Smart<span className="text-blue-600">Study</span>
          </span>

          {/* --- THE EXPANDED SURPRISE --- */}
          <div className="flex items-center ml-2 overflow-hidden">
             {/* The Heart triggers the emotion */}
             <Heart 
               size={14} 
               className="text-gray-200 fill-gray-100 group-hover:text-rose-500 group-hover:fill-rose-500 transition-all duration-500" 
             />
             
             {/* The Sliding Text Container */}
             <span className="max-w-0 opacity-0 group-hover:max-w-xs group-hover:opacity-100 transition-all duration-700 ease-in-out text-[10px] font-bold text-rose-500 whitespace-nowrap ml-1 mt-1 flex items-center gap-1">
               For Ransiluni 
               <span className="text-gray-300">&</span> 
               Shally
               <PawPrint size={10} className="fill-rose-200" />
             </span>
          </div>
          {/* ----------------------------- */}
        </div>
      </div>

      {/* CENTER: Navigation Links */}
      <nav className="hidden md:flex items-center gap-1">
        {navItems.map((item) => (
          <button
            key={item.name}
            onClick={() => onNavigate(item.id)} 
            className={`
              flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-colors duration-200
              ${currentView === item.id 
                ? 'bg-blue-100 text-blue-600' 
                : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900' 
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