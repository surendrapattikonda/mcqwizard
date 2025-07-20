import React from 'react';
import { Brain, Zap, BookOpen } from 'lucide-react';

const Header = () => {
  return (
    <header className="bg-white/80 backdrop-blur-sm shadow-sm border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-2">
            <div className="relative w-8 h-8 flex items-center justify-center">
                <Brain className="h-8 w-8 text-blue-500" /> {/* Blue outlined brain */}
                 <Zap className="h-4 w-4 text-green-400 absolute -top-1 -right-1" /> {/* Green lightning */}
             </div>

            <div>
              <h1 className="text-xl font-bold text-gray-900">MCQ Wizard</h1>
              <p className="text-xs text-gray-500">Smart Question Generator</p>
            </div>
          </div>

          <div className="hidden md:flex items-center space-x-2 bg-blue-50 px-3 py-1.5 rounded-full">
            <BookOpen className="w-4 h-4 text-blue-600" />
            <span className="text-sm font-medium text-blue-700">AI-Powered Learning</span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
