'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';

export default function Home() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Vérifier si l'utilisateur est authentifié
    const isAuthenticated = 
      typeof window !== 'undefined' && (
        localStorage.getItem('quizAuthStatus') === 'authenticated' || 
        Cookies.get('quizAuthStatus') === 'authenticated'
      );
    
    if (!isAuthenticated) {
      // Rediriger vers la page d'authentification si l'utilisateur n'est pas authentifié
      router.push('/auth');
    } else {
      // Rediriger vers la page du quiz si l'utilisateur est authentifié
      router.push('/quiz');
    }
  }, [router]);

  // Cette page ne sera jamais vraiment affichée, elle sert juste de redirection
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mx-auto"></div>
        <p className="mt-4 text-gray-600">Chargement...</p>
      </div>
    </div>
  );
} 