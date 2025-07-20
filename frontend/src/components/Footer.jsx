import React from 'react';
import { Brain } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
        <div className="flex flex-col items-center justify-center space-y-2 mb-4">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-400 rounded-lg flex items-center justify-center">
            <Brain className="w-6 h-6 text-white" />
          </div>
          <h3 className="text-2xl font-bold">MCQ Wizard</h3>
          <p className="text-sm text-gray-400">Smart Question Generator</p>
        </div>

        <p className="text-gray-400 max-w-2xl mx-auto mb-8">
          Transform your study materials into comprehensive multiple-choice questions with the power of AI. 
          Perfect for educators, students, and training professionals.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
