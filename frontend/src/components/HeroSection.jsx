import React from 'react';
import { FileText, Zap, Download, Sparkles } from 'lucide-react';
import lp1 from '../assets/laptop1.png';
const HeroSection = () => {
  const features = [
    {
      icon: FileText,
      title: "Upload Documents",
      description: "PDF & DOCX support"
    },
    {
      icon: Zap,
      title: "AI Generation",
      description: "Smart MCQ creation"
    },
    {
      icon: Download,
      title: "Export & Share",
      description: "Download ready quizzes"
    }
  ];

  return (
    <section className="relative py-20 bg-gradient-to-br from-[#e6f1fd] to-[#f4faff] overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Side */}
          <div className="space-y-8">

            <h1 className="text-4xl lg:text-5xl font-extrabold text-gray-900 leading-tight">
              Transform Your{' '}
              <span className="text-transparent bg-gradient-to-r from-blue-500 to-teal-400 bg-clip-text">
                Study Material
              </span>
              <br />
              into MCQs
            </h1>

            <p className="text-lg text-gray-600 leading-relaxed max-w-xl">
              Upload your documents and let our AI create comprehensive multiple-choice questions 
              instantly. Perfect for teachers, students, and training professionals.
            </p>

            {/* Feature Boxes */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {features.map((feature, index) => (
                <div
                  key={index}
                  className="text-center p-5 rounded-xl bg-white shadow-md border border-gray-200"
                >
                  <feature.icon className="h-6 w-6 text-blue-600 mx-auto mb-2" />
                  <h3 className="font-semibold text-gray-900 mb-1">{feature.title}</h3>
                  <p className="text-sm text-gray-500">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Right Side */}
          <div className="relative">
            <div className="relative rounded-2xl overflow-hidden shadow-xl border border-gray-200">
              <img
                src={lp1}
                alt="MCQ Generation"
                className="w-full h-auto object-cover"
              />
            </div>
            {/* Badges */}
            <div className="absolute top-4 right-4 bg-blue-600 text-white px-3 py-1.5 rounded-full text-sm font-semibold shadow-md">
              AI Powered
            </div>
            <div className="absolute bottom-4 left-4 bg-green-500 text-white px-3 py-1.5 rounded-full text-sm font-semibold shadow-md">
              Fast & Accurate
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
export default HeroSection;