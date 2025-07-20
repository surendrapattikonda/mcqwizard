import React, { useState } from 'react';
import { AlertCircle } from 'lucide-react';
import Header from './components/Header';
import HeroSection from './components/HeroSection';
import FileUpload from './components/FileUpload';
import MCQPreview from './components/MCQPreview';
import DownloadOption from './components/DownloadOption';
import Footer from './components/Footer';

function App() {
  const [currentState, setCurrentState] = useState('upload');
  const [uploadedFile, setUploadedFile] = useState(null);
  const [mcqData, setMcqData] = useState([]);
  const [error, setError] = useState(null);

  const handleFileUpload = (file, mcqs) => {
    setUploadedFile(file);
    setMcqData(mcqs);
    setError(null);
    setCurrentState('preview');
  };

  const handleError = (errorMessage) => {
    setError(errorMessage);
    setCurrentState('upload');
  };

  const handleProceedToDownload = () => {
    setCurrentState('download');
  };

  const handleStartOver = () => {
    setCurrentState('upload');
    setUploadedFile(null);
    setMcqData([]);
    setError(null);
  };

  const handleGoBack = () => {
    setCurrentState('upload');
    setUploadedFile(null);
    setMcqData([]);
    setError(null);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      {currentState === 'upload' && (
        <>
          <HeroSection />
          <FileUpload onFileUpload={handleFileUpload} onError={handleError} />
          {error && (
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-8">
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <div className="flex items-center">
                  <AlertCircle className="w-5 h-5 text-red-600 mr-2" />
                  <span className="text-red-800 font-medium">Error: {error}</span>
                </div>
              </div>
            </div>
          )}
        </>
      )}
      
      {currentState === 'preview' && (
        <MCQPreview 
          initialQuestions={mcqData} 
          onProceed={handleProceedToDownload} 
          onGoBack={handleGoBack} 
        />
      )}
      
      {currentState === 'download' && (
  <DownloadOption mcqs={mcqData} onStartOver={handleStartOver} />
)}
      <Footer/>
    </div>
  );
}

export default App;