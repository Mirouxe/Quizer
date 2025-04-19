'use client';

import { useState } from 'react';
import QuizSetup from '../components/QuizSetup';
import QuizQuestion from '../components/QuizQuestion';
import QuizResults from '../components/QuizResults';

type QuizState = 'setup' | 'question' | 'results';

export default function Home() {
  const [quizState, setQuizState] = useState<QuizState>('setup');
  const [topic, setTopic] = useState('');
  const [difficulty, setDifficulty] = useState('moyen');
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [questions, setQuestions] = useState<any[]>([]);
  const [userAnswers, setUserAnswers] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const startQuiz = async (selectedTopic: string, selectedDifficulty: string) => {
    setLoading(true);
    setTopic(selectedTopic);
    setDifficulty(selectedDifficulty);
    
    try {
      // Ici, nous simulons l'appel à l'API. Dans un vrai cas, nous appellerions notre API
      const response = await fetch('/api/generate-questions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic: selectedTopic, difficulty: selectedDifficulty }),
      });
      
      if (!response.ok) throw new Error('Erreur lors de la génération des questions');
      
      const data = await response.json();
      setQuestions(data.questions);
      setCurrentQuestion(0);
      setUserAnswers([]);
      setQuizState('question');
    } catch (error) {
      console.error('Erreur:', error);
      alert('Une erreur est survenue lors de la génération des questions.');
    } finally {
      setLoading(false);
    }
  };

  const submitAnswer = (answer: string) => {
    setUserAnswers([...userAnswers, answer]);
    
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      setQuizState('results');
    }
  };

  const restartQuiz = () => {
    setQuizState('setup');
  };

  const adjustDifficulty = (newDifficulty: string) => {
    setDifficulty(newDifficulty);
    startQuiz(topic, newDifficulty);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <header className="mb-8 text-center">
        <h1 className="text-3xl font-bold text-primary mb-2">Quizer</h1>
        <p className="text-gray-600">Apprenez en répondant à des questions personnalisées.</p>
      </header>

      {loading ? (
        <div className="flex justify-center items-center flex-grow">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      ) : (
        <>
          {quizState === 'setup' && (
            <QuizSetup onStartQuiz={startQuiz} />
          )}

          {quizState === 'question' && questions.length > 0 && (
            <QuizQuestion
              question={questions[currentQuestion]}
              onSubmitAnswer={submitAnswer}
              questionNumber={currentQuestion + 1}
              totalQuestions={questions.length}
            />
          )}

          {quizState === 'results' && (
            <QuizResults
              questions={questions}
              userAnswers={userAnswers}
              onRestart={restartQuiz}
              onAdjustDifficulty={adjustDifficulty}
              currentDifficulty={difficulty}
            />
          )}
        </>
      )}

      <footer className="mt-auto py-4 text-center text-gray-500 text-sm">
        © {new Date().getFullYear()} Quizer - Propulsé par l'IA
      </footer>
    </div>
  );
} 