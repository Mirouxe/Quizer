'use client';

import { useState } from 'react';

interface QuizSetupProps {
  onStartQuiz: (topic: string, difficulty: string) => void;
}

const difficultyLevels = [
  { id: 'facile', label: 'Facile' },
  { id: 'moyen', label: 'Moyen' },
  { id: 'difficile', label: 'Difficile' },
  { id: 'expert', label: 'Expert' },
];

const popularTopics = [
  'Histoire de France',
  'Géographie mondiale',
  'Biologie humaine',
  'Astronomie',
  'Littérature classique',
  'Cinéma français',
  'Intelligence artificielle',
  'Musique',
];

export default function QuizSetup({ onStartQuiz }: QuizSetupProps) {
  const [topic, setTopic] = useState('');
  const [difficulty, setDifficulty] = useState('moyen');
  const [isCustomTopic, setIsCustomTopic] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (topic.trim()) {
      onStartQuiz(topic, difficulty);
    }
  };

  const selectTopic = (selectedTopic: string) => {
    setTopic(selectedTopic);
    setIsCustomTopic(false);
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-center">Configurez votre quiz</h2>
      
      <form onSubmit={handleSubmit}>
        <div className="mb-6">
          <label className="block text-gray-700 font-medium mb-2">
            Choisissez un sujet
          </label>
          
          {!isCustomTopic ? (
            <>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-4">
                {popularTopics.map((topicName) => (
                  <button
                    key={topicName}
                    type="button"
                    className={`p-2 text-sm rounded-md transition-colors ${
                      topic === topicName
                        ? 'bg-primary text-white'
                        : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                    }`}
                    onClick={() => selectTopic(topicName)}
                  >
                    {topicName}
                  </button>
                ))}
              </div>
              <button
                type="button"
                className="text-primary hover:underline text-sm"
                onClick={() => {
                  setIsCustomTopic(true);
                  setTopic('');
                }}
              >
                Ou spécifiez un autre sujet...
              </button>
            </>
          ) : (
            <>
              <input
                type="text"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="Entrez un sujet qui vous intéresse..."
                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                autoFocus
              />
              <button
                type="button"
                className="text-primary hover:underline text-sm mt-2"
                onClick={() => setIsCustomTopic(false)}
              >
                Revenir aux sujets populaires
              </button>
            </>
          )}
        </div>

        <div className="mb-6">
          <label className="block text-gray-700 font-medium mb-2">
            Niveau de difficulté
          </label>
          <div className="flex flex-wrap gap-2">
            {difficultyLevels.map((level) => (
              <button
                key={level.id}
                type="button"
                className={`px-4 py-2 rounded-md transition-colors ${
                  difficulty === level.id
                    ? 'bg-primary text-white'
                    : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                }`}
                onClick={() => setDifficulty(level.id)}
              >
                {level.label}
              </button>
            ))}
          </div>
        </div>

        <button
          type="submit"
          disabled={!topic.trim()}
          className={`w-full py-3 rounded-md font-medium transition-colors ${
            topic.trim()
              ? 'bg-primary text-white hover:bg-primary/90'
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
          }`}
        >
          Démarrer le quiz
        </button>
      </form>
    </div>
  );
} 