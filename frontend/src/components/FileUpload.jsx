import React, { useState, useRef } from 'react';
import { Upload, FileText, AlertCircle } from 'lucide-react';

export default function FileUpload({ onFileUpload, onError }) {
  const [isDragOver, setIsDragOver] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [questionCount, setQuestionCount] = useState(5);
  const fileInputRef = useRef(null);

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  const handleFileSelect = (file) => {
    if (file && (file.type === 'application/pdf' || file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' || file.name.toLowerCase().endsWith('.pdf') || file.name.toLowerCase().endsWith('.docx'))) {
      if (file.size <= 5 * 1024 * 1024) { // 5MB limit to match backend
        setSelectedFile(file);
        uploadFile(file);
      } else {
        alert('File size must be less than 5MB');
      }
    } else {
      alert('Please select a PDF or DOCX file');
    }
  };

  const uploadFile = async (file) => {
    setIsUploading(true);
    
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('question_count', questionCount.toString());
      
  const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/generate-mcqs/`, {
  method: 'POST',
  body: formData,
});

   if (!response.ok) {

  let errorDetail = 'Failed to process file';
  try {
    // Only parse if content-type is JSON and length > 0
    const contentType = response.headers.get("content-type") || "";
    if (contentType.includes("application/json")) {
      const errorData = await response.json();
      if (errorData && errorData.detail) {
        errorDetail = errorData.detail;
      }
    } else {
      // fallback: try to get text
      const text = await response.text();
      if (text) errorDetail = text;
    }
  } catch (e) {
    // Do nothing, use default errorDetail
  }
  throw new Error(errorDetail);
}

      
      const data = await response.json();
      onFileUpload(file, data.mcqs);
      
    } catch (error) {
      console.error('Upload error:', error);
      if (onError) {
        onError(error.message);
      } else {
        alert(`Error: ${error.message}`);
      }
      setSelectedFile(null);
    } finally {
      setIsUploading(false);
    }
  };

  const handleFileInputChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleChooseFile = () => {
    fileInputRef.current?.click();
  };

  return (
    <section className="py-16 px-4">
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="text-3xl font-bold text-gray-800 mb-4">
          Generate MCQs in 3 Simple Steps
        </h2>
        <p className="text-gray-600 mb-12">
          Upload your document, let AI work its magic, and download your questions
        </p>

        {/* Question Count Selector */}
        <div className="bg-white rounded-xl shadow-md p-6 max-w-md mx-auto mb-8">
          <div className="text-center mb-4">
            <h3 className="text-xl font-bold text-gray-800 mb-2">Choose Question Count</h3>
            <p className="text-gray-600 text-sm">
              Select how many MCQs you want to generate from your document
            </p>
          </div>
          
          <div className="grid grid-cols-3 gap-3">
            {[
              { count: 3, icon: '🎯', label: 'Quick', desc: 'Perfect for short content' },
              { count: 5, icon: '⭐', label: 'Standard', desc: 'Most popular choice' },
              { count: 10, icon: '🚀', label: 'Extended', desc: 'Comprehensive coverage' },
              { count: 15, icon: '💎', label: 'Detailed', desc: 'In-depth assessment' },
              { count: 20, icon: '🏆', label: 'Complete', desc: 'Full topic coverage' },
              { count: 25, icon: '🎓', label: 'Master', desc: 'Maximum questions' }
            ].map((option) => (
              <button
                key={option.count}
                onClick={() => setQuestionCount(option.count)}
                disabled={isUploading}
                className={`p-4 rounded-xl border-2 transition-all duration-200 text-center hover:shadow-md ${
                  questionCount === option.count
                    ? 'border-blue-500 bg-blue-50 shadow-md'
                    : 'border-gray-200 hover:border-blue-300 bg-white'
                } ${isUploading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
              >
                <div className="text-2xl mb-1">{option.icon}</div>
                <div className={`font-bold text-lg ${
                  questionCount === option.count ? 'text-blue-700' : 'text-gray-800'
                }`}>
                  {option.count}
                </div>
                <div className={`text-xs font-medium ${
                  questionCount === option.count ? 'text-blue-600' : 'text-gray-600'
                }`}>
                  {option.label}
                </div>
                <div className={`text-xs mt-1 ${
                  questionCount === option.count ? 'text-blue-500' : 'text-gray-500'
                }`}>
                  {option.desc}
                </div>
              </button>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-8 max-w-2xl mx-auto">
          <div
            className={`border-2 border-dashed rounded-xl p-12 transition-all duration-300 ${
              isDragOver
                ? 'border-blue-500 bg-blue-50'
                : 'border-gray-300 hover:border-gray-400'
            }`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            <div className="flex flex-col items-center">
              <Upload className="w-16 h-16 text-gray-400 mb-6" />
              
              <h3 className="text-xl font-semibold text-gray-800 mb-2">
                Upload Your Study Material
              </h3>
              
              <p className="text-gray-600 mb-6">
                Drag and drop your PDF or DOCX file here, or click to browse
              </p>

              <button
                onClick={handleChooseFile}
                className={`px-8 py-3 rounded-lg font-medium transition-colors duration-200 cursor-pointer ${
                  isUploading 
                    ? 'bg-gray-400 cursor-not-allowed text-white' 
                    : 'bg-blue-500 hover:bg-blue-600 text-white'
                }`}
                disabled={isUploading}
              >
                {isUploading ? 'Processing...' : 'Choose File'}
              </button>

              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf,.docx"
                onChange={handleFileInputChange}
                className="hidden"
              />
            </div>
          </div>

          <div className="flex items-center justify-center mt-6 space-x-6 text-sm text-gray-500">
            <div className="flex items-center">
              <FileText className="w-4 h-4 mr-1" />
              PDF
            </div>
            <div className="flex items-center">
              <FileText className="w-4 h-4 mr-1" />
              DOCX
            </div>
            <div className="flex items-center">
              <AlertCircle className="w-4 h-4 mr-1" />
              Max 5MB
            </div>
          </div>

          {selectedFile && (
            <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
              <div className="flex items-center">
                <FileText className="w-5 h-5 text-green-600 mr-2" />
                <span className="text-green-800 font-medium">
                  {selectedFile.name}
                </span>
                <span className="text-green-600 ml-2">
                  ({(selectedFile.size / 1024 / 1024).toFixed(2)} MB)
                </span>
                {isUploading && (
                  <span className="text-blue-600 ml-2">Processing...</span>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}