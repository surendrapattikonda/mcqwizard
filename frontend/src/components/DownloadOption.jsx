import React from 'react';
import { jsPDF } from 'jspdf';
import htmlDocx from 'html-docx-js-typescript';

import { Download, FileText, File, FileType2, RotateCcw } from 'lucide-react';

const DownloadOptions = ({ mcqs, onStartOver }) => {
  const downloadFormats = [
    { icon: FileText, title: 'Text File', description: 'Plain text format', format: 'TXT' },
    { icon: File, title: 'PDF File', description: 'Printable document', format: 'PDF' },
    { icon: FileType2, title: 'Word File', description: 'Microsoft Word format', format: 'DOC' }
  ];

  const handleDownload = (format) => {
    if (!mcqs || mcqs.length === 0) {
      alert('No MCQs available to download!');
      return;
    }

    const contentText = mcqs.map((q, i) =>
      `Q${i + 1}. ${q.question}\n` +
      q.options.map((opt, idx) => `${String.fromCharCode(65 + idx)}) ${opt}`).join("\n") +
      `\nAnswer: ${q.answer}\n`
    ).join("\n\n");

    if (format === 'TXT') {
      const blob = new Blob([contentText], { type: 'text/plain' });
      triggerDownload(blob, 'mcqs.txt');
    }

    else if (format === 'PDF') {
      const doc = new jsPDF();
      const lines = doc.splitTextToSize(contentText, 180);
      doc.text(lines, 10, 10);
      doc.save('mcqs.pdf');
    }

    else if (format === 'DOC') {
      const htmlContent = `
        <h1>MCQ Questions</h1>
        ${mcqs.map((q, i) => `
          <p><strong>Q${i + 1}. ${q.question}</strong><br />
          ${q.options.map((opt, idx) => `${String.fromCharCode(65 + idx)}) ${opt}`).join("<br />")}
          <br /><em>Answer: ${q.answer}</em></p>
        `).join("")}
      `;
      const docBlob = htmlDocx.asBlob(htmlContent);
      triggerDownload(docBlob, 'mcqs.docx');
    }
  };

  const triggerDownload = (blob, filename) => {
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  };

  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <div className="flex items-center space-x-2 mb-6">
            <Download className="w-6 h-6 text-blue-600" />
            <h2 className="text-2xl font-bold text-gray-900">Download Options</h2>
          </div>

          <p className="text-gray-600 mb-8">
            Download your MCQ set in various formats for easy sharing and distribution.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {downloadFormats.map((format, index) => (
              <div key={index} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow duration-200">
                <div className="flex items-center space-x-3 mb-4">
                  <format.icon className="w-8 h-8 text-gray-600" />
                  <div>
                    <h3 className="font-semibold text-gray-900">{format.title}</h3>
                    <p className="text-sm text-gray-600">{format.description}</p>
                  </div>
                </div>
                <button
                  onClick={() => handleDownload(format.format)}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg font-medium transition-colors duration-200 flex items-center justify-center space-x-2 cursor-pointer"
                >
                  <Download className="w-4 h-4" />
                  <span>Download {format.format}</span>
                </button>
              </div>
            ))}
          </div>

          <div className="bg-blue-50 rounded-lg p-4 mb-6">
            <p className="text-blue-800">
              <strong>Ready to download:</strong> {mcqs.length} questions
            </p>
          </div>

          <div className="flex justify-center">
            <button
              onClick={onStartOver}
              className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-2 rounded-lg font-medium transition-colors duration-200 inline-flex items-center space-x-2 cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Generate More Questions</span>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default DownloadOptions;
