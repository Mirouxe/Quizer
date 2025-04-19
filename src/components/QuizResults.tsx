'use client';

interface QuizResultsProps {
  questions: {
    text: string;
    options: string[];
    answer: string;
    explanation: string;
  }[];
  userAnswers: string[];
  onRestart: () => void;
  onAdjustDifficulty: (difficulty: string) => void;
  currentDifficulty: string;
}

export default function QuizResults({
  questions,
  userAnswers,
  onRestart,
  onAdjustDifficulty,
  currentDifficulty,
}: QuizResultsProps) {
  // Calculer le score
  const correctAnswers = questions.filter(
    (question, index) => question.answer === userAnswers[index]
  ).length;
  
  const score = Math.round((correctAnswers / questions.length) * 100);
  
  // Suggérer un ajustement de difficulté
  const suggestEasier = score < 40 && currentDifficulty !== 'facile';
  const suggestHarder = score > 80 && currentDifficulty !== 'expert';
  
  const getDifficultyAdjustment = () => {
    const difficulties = ['facile', 'moyen', 'difficile', 'expert'];
    const currentIndex = difficulties.indexOf(currentDifficulty);
    
    if (suggestEasier && currentIndex > 0) {
      return difficulties[currentIndex - 1];
    }
    
    if (suggestHarder && currentIndex < difficulties.length - 1) {
      return difficulties[currentIndex + 1];
    }
    
    return currentDifficulty;
  };
  
  const adjustedDifficulty = getDifficultyAdjustment();

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-2 text-center">Résultats du quiz</h2>
      
      <div className="text-center mb-6">
        <div className="inline-block mb-4 rounded-full p-1 bg-gray-100">
          <div className="relative w-32 h-32 rounded-full flex items-center justify-center">
            <svg
              viewBox="0 0 36 36"
              className="absolute inset-0 w-full h-full"
            >
              <circle
                cx="18"
                cy="18"
                r="16"
                fill="none"
                stroke="#e5e7eb"
                strokeWidth="2"
              />
              <circle
                cx="18"
                cy="18"
                r="16"
                fill="none"
                stroke={score > 70 ? '#10B981' : score > 40 ? '#F59E0B' : '#EF4444'}
                strokeWidth="2"
                strokeDasharray={`${score} 100`}
                strokeDashoffset="0"
                strokeLinecap="round"
                transform="rotate(-90 18 18)"
              />
            </svg>
            <div className="text-3xl font-bold">{score}%</div>
          </div>
        </div>
        
        <p className="text-gray-500">
          Vous avez répondu correctement à {correctAnswers} questions sur {questions.length}.
        </p>
      </div>
      
      {(suggestEasier || suggestHarder) && (
        <div className={`p-4 rounded-md mb-6 ${
          suggestEasier ? 'bg-orange-50 border border-orange-200' : 'bg-green-50 border border-green-200'
        }`}>
          <p className="text-center">
            {suggestEasier ? (
              <>Ce quiz semble un peu difficile pour vous. Voulez-vous essayer un niveau plus facile ?</>
            ) : (
              <>Bravo ! Vous maîtrisez ce niveau. Pourquoi ne pas essayer un niveau plus difficile ?</>
            )}
          </p>
          <div className="mt-3 flex justify-center">
            <button
              className={`px-4 py-2 rounded-md font-medium ${
                suggestEasier ? 'bg-orange-100 text-orange-700' : 'bg-green-100 text-green-700'
              }`}
              onClick={() => onAdjustDifficulty(adjustedDifficulty)}
            >
              {suggestEasier ? 'Essayer un niveau plus facile' : 'Passer au niveau supérieur'}
            </button>
          </div>
        </div>
      )}
      
      <div className="space-y-4 mb-6">
        <h3 className="font-bold text-lg">Détail des réponses :</h3>
        
        {questions.map((question, index) => {
          const isCorrect = userAnswers[index] === question.answer;
          
          return (
            <div
              key={index}
              className={`p-4 rounded-md border ${
                isCorrect ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'
              }`}
            >
              <div className="flex items-start gap-2">
                <span className={isCorrect ? 'text-green-500' : 'text-red-500'}>
                  {isCorrect ? '✓' : '✗'}
                </span>
                <div>
                  <p className="font-medium">{question.text}</p>
                  <p className="text-sm text-gray-600 mt-1">
                    <span className="font-medium">Votre réponse :</span> {userAnswers[index]}
                  </p>
                  {!isCorrect && (
                    <p className="text-sm text-gray-600">
                      <span className="font-medium">Réponse correcte :</span> {question.answer}
                    </p>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
      
      <button
        className="w-full py-3 bg-primary text-white rounded-md font-medium hover:bg-primary/90 transition-colors"
        onClick={onRestart}
      >
        Nouveau quiz
      </button>
    </div>
  );
} 