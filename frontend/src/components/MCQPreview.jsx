import React, { useState } from 'react';
import { ArrowRight, CheckCircle, Edit3, Save, X, Check, AlertTriangle, Trash2, ArrowLeft } from 'lucide-react';

const MCQPreview = ({ initialQuestions = [], onProceed, onGoBack }) => {
  // Transform backend data to frontend format
  const transformBackendData = (backendQuestions) => {
    return backendQuestions.map((q, index) => ({
      id: index + 1,
      question: q.question,
      options: q.options,
      correct: q.options.findIndex(option => option === q.answer),
      difficulty: q.difficulty.charAt(0).toUpperCase() + q.difficulty.slice(1), // Capitalize first letter
      isEditing: false,
      validation: null
    }));
  };

  const [questions, setQuestions] = useState(() => 
    initialQuestions.length > 0 ? transformBackendData(initialQuestions) : []
  );

  const [editingQuestion, setEditingQuestion] = useState(null);

  const stats = [
    { number: questions.length, label: 'Questions Generated', color: 'text-blue-600' },
    { number: questions.filter(q => q.difficulty === 'Easy').length, label: 'Easy Level', color: 'text-green-600' },
    { number: questions.filter(q => q.difficulty === 'Medium').length, label: 'Medium Level', color: 'text-yellow-600' },
    { number: questions.filter(q => q.difficulty === 'Hard').length, label: 'Hard Level', color: 'text-red-600' }
  ];

  const acceptedQuestions = questions.filter(q => q.validation === 'ok');
  const hasAcceptedQuestions = acceptedQuestions.length > 0;
  const hasNoQuestions = questions.length === 0;

  const handleEdit = (question) => {
    setEditingQuestion({ ...question });
    setQuestions(questions.map(q => 
      q.id === question.id ? { ...q, isEditing: true } : { ...q, isEditing: false }
    ));
  };

  const handleSave = () => {
    if (editingQuestion) {
      setQuestions(questions.map(q => 
        q.id === editingQuestion.id 
          ? { ...editingQuestion, isEditing: false, validation: 'pending' }
          : q
      ));
      setEditingQuestion(null);
    }
  };

  const handleCancel = () => {
    setQuestions(questions.map(q => ({ ...q, isEditing: false })));
    setEditingQuestion(null);
  };

  const handleDelete = (questionId) => {
    if (window.confirm('Are you sure you want to delete this question?')) {
      setQuestions(questions.filter(q => q.id !== questionId));
      if (editingQuestion?.id === questionId) {
        setEditingQuestion(null);
      }
    }
  };

  const handleValidation = (questionId, validation) => {
    setQuestions(questions.map(q => 
      q.id === questionId ? { ...q, validation } : q
    ));
  };

  const handleQuestionChange = (value) => {
    if (editingQuestion) {
      setEditingQuestion({ ...editingQuestion, question: value });
    }
  };

  const handleOptionChange = (index, value) => {
    if (editingQuestion) {
      const newOptions = [...editingQuestion.options];
      newOptions[index] = value;
      setEditingQuestion({ ...editingQuestion, options: newOptions });
    }
  };

  const handleCorrectAnswerChange = (index) => {
    if (editingQuestion) {
      setEditingQuestion({ ...editingQuestion, correct: index });
    }
  };

  const handleDifficultyChange = (difficulty) => {
    if (editingQuestion) {
      setEditingQuestion({ ...editingQuestion, difficulty });
    }
  };

  // If no questions remain, show go back option
  if (hasNoQuestions) {
    return (
      <section className="py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
            <div className="mb-8">
              <AlertTriangle className="w-16 h-16 text-yellow-500 mx-auto mb-4" />
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                No Questions Available
              </h2>
              <p className="text-lg text-gray-600 mb-8">
                All questions have been deleted. Please go back to upload a new document.
              </p>
            </div>
            
            <button
              onClick={onGoBack}
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-medium transition-colors duration-200 inline-flex items-center space-x-2 cursor-pointer"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Go Back to Upload</span>
            </button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Preview Your MCQs
          </h2>
          <p className="text-lg text-gray-600">
            Review, edit, and validate the generated questions before export
          </p>
        </div>

        {/* Statistics */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className={`text-4xl font-bold ${stat.color} mb-2`}>
                  {stat.number}
                </div>
                <div className="text-gray-600 font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Validation Status */}
        {questions.some(q => q.validation !== null) && (
          <div className="bg-white rounded-xl shadow-lg p-6 mb-8 border border-gray-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <Check className="w-5 h-5 text-green-600" />
                  <span className="text-green-700 font-medium">
                    {questions.filter(q => q.validation === 'ok').length} Approved
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <X className="w-5 h-5 text-red-600" />
                  <span className="text-red-700 font-medium">
                    {questions.filter(q => q.validation === 'not-ok').length} Rejected
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <AlertTriangle className="w-5 h-5 text-yellow-600" />
                  <span className="text-yellow-700 font-medium">
                    {questions.filter(q => q.validation === 'pending').length} Pending Review
                  </span>
                </div>
              </div>
              {questions.some(q => q.validation === 'not-ok') && (
                <span className="text-sm text-gray-600">
                  Rejected questions will be excluded from export
                </span>
              )}
            </div>
          </div>
        )}

        {/* Questions */}
        <div className="space-y-6 mb-8">
          {questions.map((q, index) => (
            <div key={q.id} className={`bg-white rounded-xl shadow-lg p-6 border-2 transition-all duration-200 ${
              q.validation === 'ok' ? 'border-green-200 bg-green-50/30' :
              q.validation === 'not-ok' ? 'border-red-200 bg-red-50/30' :
              q.validation === 'pending' ? 'border-yellow-200 bg-yellow-50/30' :
              'border-gray-200'
            }`}>
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  {q.isEditing && editingQuestion?.id === q.id ? (
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Question {index + 1}:
                        </label>
                        <textarea
                          value={editingQuestion.question}
                          onChange={(e) => handleQuestionChange(e.target.value)}
                          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                          rows={2}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Difficulty:
                        </label>
                        <select
                          value={editingQuestion.difficulty}
                          onChange={(e) => handleDifficultyChange(e.target.value)}
                          className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                          <option value="Easy">Easy</option>
                          <option value="Medium">Medium</option>
                          <option value="Hard">Hard</option>
                        </select>
                      </div>
                    </div>
                  ) : (
                    <h3 className="text-lg font-semibold text-gray-900">
                      {index + 1}. {q.question}
                    </h3>
                  )}
                </div>
                
                <div className="flex items-center space-x-2 ml-4">
                  {!q.isEditing ? (
                    <>
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                        q.difficulty === 'Easy' ? 'bg-green-100 text-green-800' :
                        q.difficulty === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {q.difficulty}
                      </span>
                      <button
                        onClick={() => handleEdit(q)}
                        className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors cursor-pointer"
                        title="Edit question"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(q.id)}
                        className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                        title="Delete question"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </>
                  ) : (
                    <div className="flex space-x-2">
                      <button
                        onClick={handleSave}
                        className="px-3 py-1 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm flex items-center space-x-1 cursor-pointer"
                      >
                        <Save className="w-4 h-4" />
                        <span>Save</span>
                      </button>
                      <button
                        onClick={handleCancel}
                        className="px-3 py-1 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors text-sm flex items-center space-x-1 cursor-pointer"
                      >
                        <X className="w-4 h-4" />
                        <span>Cancel</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>
              
              <div className="space-y-2 mb-4">
                {q.isEditing && editingQuestion?.id === q.id ? (
                  <div className="space-y-3">
                    <label className="block text-sm font-medium text-gray-700">
                      Options (click to select correct answer):
                    </label>
                    {editingQuestion.options.map((option, optionIndex) => (
                      <div key={optionIndex} className="flex items-center space-x-3">
                        <button
                          onClick={() => handleCorrectAnswerChange(optionIndex)}
                          className={`w-6 h-6 rounded-full border-2 flex items-center justify-cente cursor-pointerr ${
                            editingQuestion.correct === optionIndex
                              ? 'border-green-500 bg-green-500'
                              : 'border-gray-300 hover:border-green-400'
                          }`}
                        >
                          {editingQuestion.correct === optionIndex && (
                            <CheckCircle className="w-4 h-4 text-white" />
                          )}
                        </button>
                        <input
                          type="text"
                          value={option}
                          onChange={(e) => handleOptionChange(optionIndex, e.target.value)}
                          className="flex-1 p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                    ))}
                  </div>
                ) : (
                  q.options.map((option, optionIndex) => (
                    <div 
                      key={optionIndex} 
                      className={`p-3 rounded-lg border ${
                        optionIndex === q.correct 
                          ? 'bg-green-50 border-green-200 text-green-800' 
                          : 'bg-gray-50 border-gray-200'
                      }`}
                    >
                      <div className="flex items-center space-x-2">
                        {optionIndex === q.correct && (
                          <CheckCircle className="w-5 h-5 text-green-600" />
                        )}
                        <span>{option}</span>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Validation Buttons */}
              {!q.isEditing && q.validation !== 'ok' && q.validation !== 'not-ok' && (
                <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                  <span className="text-sm text-gray-600">Is this question acceptable?</span>
                  <div className="flex space-x-3">
                    <button
                      onClick={() => handleValidation(q.id, 'not-ok')}
                      className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm flex items-center space-x-2 cursor-pointer"
                    >
                      <X className="w-4 h-4" />
                      <span>Not OK</span>
                    </button>
                    <button
                      onClick={() => handleValidation(q.id, 'ok')}
                      className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm flex items-center space-x-2 cursor-pointer"
                    >
                      <Check className="w-4 h-4" />
                      <span>OK</span>
                    </button>
                  </div>
                </div>
              )}

              {/* Validation Status Display */}
              {q.validation === 'ok' && (
                <div className="flex items-center justify-between pt-4 border-t border-green-200">
                  <div className="flex items-center space-x-2 text-green-700">
                    <Check className="w-5 h-5" />
                    <span className="font-medium">Question approved</span>
                  </div>
                  <button
                    onClick={() => handleValidation(q.id, 'pending')}
                    className="text-sm text-gray-500 hover:text-gray-700 cursor-pointer"
                  >
                    Change status
                  </button>
                </div>
              )}

              {q.validation === 'not-ok' && (
                <div className="flex items-center justify-between pt-4 border-t border-red-200">
                  <div className="flex items-center space-x-2 text-red-700">
                    <X className="w-5 h-5" />
                    <span className="font-medium">Question rejected - will be excluded from export</span>
                  </div>
                  <button
                    onClick={() => handleValidation(q.id, 'pending')}
                    className="text-sm text-gray-500 hover:text-gray-700 cursor-pointer"
                  >
                    Change status
                  </button>
                </div>
              )}

              {q.validation === 'pending' && (
                <div className="flex items-center justify-between pt-4 border-t border-yellow-200">
                  <div className="flex items-center space-x-2 text-yellow-700">
                    <AlertTriangle className="w-5 h-5" />
                    <span className="font-medium">Pending review</span>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Action Buttons */}
        <div className="flex justify-center space-x-4">
          {!hasAcceptedQuestions ? (
            <button
              onClick={onGoBack}
              className="bg-gray-600 hover:bg-gray-700 text-white px-8 py-3 rounded-lg font-medium transition-colors duration-200 inline-flex items-center space-x-2 cursor-pointer"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Go Back to Upload</span>
            </button>
          ) : (
            <button
              onClick={onProceed}
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-medium transition-colors duration-200 inline-flex items-center space-x-2 cursor-pointer"
            >
              <span>
                Proceed to Download ({acceptedQuestions.length} question{acceptedQuestions.length !== 1 ? 's' : ''})
              </span>
              <ArrowRight className="w-5 h-5" />
            </button>
          )}
        </div>
        
        {hasAcceptedQuestions && questions.some(q => q.validation === null || q.validation === 'pending') && (
          <p className="text-sm text-gray-600 mt-2 text-center">
            You can proceed with {acceptedQuestions.length} approved question{acceptedQuestions.length !== 1 ? 's' : ''}. 
            Unreviewed questions will not be included.
          </p>
        )}
      </div>
    </section>
  );
};

export default MCQPreview;