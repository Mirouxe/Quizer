'use client';

import { useState } from 'react';

interface QuizQuestionProps {
  question: {
    text: string;
    options: string[];
    answer: string;
    explanation: string;
  };
  onSubmitAnswer: (answer: string) => void;
  questionNumber: number;
  totalQuestions: number;
}

export default function QuizQuestion({
  question,
  onSubmitAnswer,
  questionNumber,
  totalQuestions,
}: QuizQuestionProps) {
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [needMoreInfo, setNeedMoreInfo] = useState(false);
  const [additionalInfo, setAdditionalInfo] = useState('');
  const [loadingMoreInfo, setLoadingMoreInfo] = useState(false);

  const handleOptionSelect = (option: string) => {
    if (!showExplanation) {
      setSelectedOption(option);
    }
  };

  const handleSubmit = () => {
    if (selectedOption && !showExplanation) {
      setShowExplanation(true);
    }
  };

  const handleNextQuestion = () => {
    if (selectedOption) {
      onSubmitAnswer(selectedOption);
      setSelectedOption(null);
      setShowExplanation(false);
      setNeedMoreInfo(false);
      setAdditionalInfo('');
    }
  };

  const requestMoreInfo = async () => {
    setLoadingMoreInfo(true);
    try {
      // Simule l'appel API qui demanderait plus d'informations à ChatGPT
      const response = await fetch('/api/more-info', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question: question.text,
          explanation: question.explanation,
        }),
      });
      
      if (!response.ok) throw new Error('Erreur lors de la récupération des informations supplémentaires');
      
      const data = await response.json();
      setAdditionalInfo(data.additionalInfo);
      setNeedMoreInfo(true);
    } catch (error) {
      console.error('Erreur:', error);
      setAdditionalInfo('Désolé, nous n\'avons pas pu récupérer plus d\'informations pour le moment.');
    } finally {
      setLoadingMoreInfo(false);
    }
  };

  const isCorrect = selectedOption === question.answer;

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <div className="flex justify-between mb-4 text-sm text-gray-500">
        <span>Question {questionNumber} / {totalQuestions}</span>
      </div>
      
      <h3 className="text-xl font-bold mb-6">{question.text}</h3>
      
      <div className="space-y-3 mb-6">
        {question.options.map((option) => (
          <button
            key={option}
            className={`w-full text-left p-4 rounded-md transition-colors ${
              selectedOption === option
                ? showExplanation
                  ? option === question.answer
                    ? 'bg-green-100 border border-green-500'
                    : 'bg-red-100 border border-red-500'
                  : 'bg-primary/10 border border-primary'
                : 'bg-gray-100 hover:bg-gray-200 border border-transparent'
            }`}
            onClick={() => handleOptionSelect(option)}
            disabled={showExplanation}
          >
            {option}
            {showExplanation && selectedOption === option && (
              <span className="ml-2">
                {option === question.answer ? '✓' : '✗'}
              </span>
            )}
          </button>
        ))}
      </div>
      
      {!showExplanation ? (
        <button
          className={`w-full py-3 rounded-md font-medium transition-colors ${
            selectedOption
              ? 'bg-primary text-white hover:bg-primary/90'
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
          }`}
          onClick={handleSubmit}
          disabled={!selectedOption}
        >
          Valider ma réponse
        </button>
      ) : (
        <div>
          <div className={`p-4 rounded-md mb-4 ${
            isCorrect ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'
          }`}>
            <h4 className={`font-bold mb-2 ${
              isCorrect ? 'text-green-700' : 'text-red-700'
            }`}>
              {isCorrect ? 'Correct!' : 'Incorrect'}
            </h4>
            <p className="text-gray-700">{question.explanation}</p>
            
            {needMoreInfo && (
              <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-md">
                <h5 className="font-bold text-blue-700 mb-2">Informations supplémentaires :</h5>
                <p className="text-gray-700">{additionalInfo}</p>
              </div>
            )}
            
            {!needMoreInfo && !loadingMoreInfo && (
              <button
                className="mt-3 text-blue-600 hover:underline text-sm"
                onClick={requestMoreInfo}
              >
                Je veux en savoir plus
              </button>
            )}
            
            {loadingMoreInfo && (
              <div className="mt-3 flex items-center">
                <div className="animate-spin h-4 w-4 border-2 border-blue-500 rounded-full border-t-transparent mr-2"></div>
                <span className="text-sm text-blue-600">Chargement...</span>
              </div>
            )}
          </div>
          
          <button
            className="w-full py-3 bg-primary text-white rounded-md font-medium hover:bg-primary/90 transition-colors"
            onClick={handleNextQuestion}
          >
            Question suivante
          </button>
        </div>
      )}
    </div>
  );
} 