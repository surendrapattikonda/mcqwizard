import React from 'react';
import { Loader2, FileText, File } from 'lucide-react';

const ProcessingSpinner = ({ fileName }) => {
  return (
    <section className="py-32 bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-2xl shadow-lg p-12 border-2 border-gray-100">
          <div className="border-2 border-dashed border-green-400 rounded-xl p-16 text-center bg-green-50">
            <div className="mb-8">
              <Loader2 className="w-16 h-16 text-blue-600 mx-auto animate-spin" />
            </div>
            
            <h3 className="text-2xl font-semibold text-gray-900 mb-2">
              Processing your file...
            </h3>
            <p className="text-gray-600 mb-8">
              Analyzing and designing AI-crafted MCQs for you
            </p>
            
            {fileName && (
              <div className="bg-white rounded-lg p-4 inline-block shadow-sm border">
                <p className="text-sm font-medium text-gray-700">{fileName}</p>
              </div>
            )}
          </div>

          <div className="mt-8 flex justify-center items-center space-x-6 text-sm text-gray-500">
            <div className="flex items-center space-x-2">
              <FileText className="w-4 h-4" />
              <span>PDF</span>
            </div>
            <div className="flex items-center space-x-2">
              <File className="w-4 h-4" />
              <span>DOCX</span>
            </div>
            <div className="flex items-center space-x-2">
              <span>Max 10MB</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProcessingSpinner;