'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';
import Image from 'next/image';

export default function Auth() {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  // Vérifier si l'utilisateur est déjà authentifié
  useEffect(() => {
    const isAuthenticated = 
      localStorage.getItem('quizAuthStatus') === 'authenticated' || 
      Cookies.get('quizAuthStatus') === 'authenticated';
    
    if (isAuthenticated) {
      router.push('/quiz');
    }
  }, [router]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Vérifier le mot de passe (mot de passe fixe: "quizai")
    if (password === 'quizai') {
      // Stocker l'état d'authentification dans le localStorage et un cookie
      localStorage.setItem('quizAuthStatus', 'authenticated');
      Cookies.set('quizAuthStatus', 'authenticated', { expires: 1 }); // Expire dans 1 jour
      
      // Rediriger vers la page principale du quiz
      router.push('/quiz');
    } else {
      setError('Mot de passe incorrect. Veuillez réessayer.');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/10 to-secondary/10">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-primary">Quizer</h1>
          <p className="text-gray-600 mt-2">Apprenez en répondant à des questions personnalisées</p>
        </div>

        <div className="flex justify-center mb-6">
          <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-12 h-12 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="mb-6">
            <label htmlFor="password" className="block text-gray-700 font-medium mb-2">
              Mot de passe
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="Entrez le mot de passe"
              required
            />
            {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3 rounded-md font-medium text-white transition-colors ${
              loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-primary hover:bg-primary/90'
            }`}
          >
            {loading ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Validation...
              </span>
            ) : (
              'Accéder au quiz'
            )}
          </button>
        </form>

        <div className="text-center mt-6 text-sm text-gray-500">
          <p>Cette application est protégée par un mot de passe</p>
        </div>
      </div>
    </div>
  );
} 