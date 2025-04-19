'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';
import QuizSetup from '../../components/QuizSetup';
import QuizQuestion from '../../components/QuizQuestion';
import QuizResults from '../../components/QuizResults';

type QuizState = 'setup' | 'question' | 'results';

export default function QuizPage() {
  const [quizState, setQuizState] = useState<QuizState>('setup');
  const [topic, setTopic] = useState('');
  const [difficulty, setDifficulty] = useState('moyen');
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [questions, setQuestions] = useState<any[]>([]);
  const [userAnswers, setUserAnswers] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  // Vérifier l'authentification au chargement de la page
  useEffect(() => {
    const isAuthenticated = 
      localStorage.getItem('quizAuthStatus') === 'authenticated' || 
      Cookies.get('quizAuthStatus') === 'authenticated';
      
    if (!isAuthenticated) {
      router.push('/auth');
    }
  }, [router]);

  const startQuiz = async (selectedTopic: string, selectedDifficulty: string) => {
    setLoading(true);
    setTopic(selectedTopic);
    setDifficulty(selectedDifficulty);
    
    try {
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

  const handleLogout = () => {
    localStorage.removeItem('quizAuthStatus');
    Cookies.remove('quizAuthStatus');
    router.push('/auth');
  };

  return (
    <div className="min-h-screen flex flex-col">
      <header className="mb-8 text-center pt-8">
        <h1 className="text-3xl font-bold text-primary mb-2">Quizer</h1>
        <p className="text-gray-600">Apprenez en répondant à des questions personnalisées.</p>
      </header>

      <div className="absolute top-4 right-4">
        <button 
          onClick={handleLogout}
          className="text-gray-600 hover:text-primary text-sm flex items-center"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
          Déconnexion
        </button>
      </div>

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