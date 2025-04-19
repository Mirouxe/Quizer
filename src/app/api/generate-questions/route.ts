import { NextResponse } from 'next/server';
import OpenAI from 'openai';

// Initialiser le client OpenAI
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY as string,
});

export async function POST(req: Request) {
  try {
    const { topic, difficulty } = await req.json();

    if (!topic) {
      return NextResponse.json(
        { error: 'Le sujet est requis' },
        { status: 400 }
      );
    }

    // Ajouter un timestamp pour forcer la génération de questions différentes à chaque fois
    const timestamp = new Date().toISOString();

    // Créer la requête à l'API OpenAI
    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content: `Tu es un générateur de questions de quiz éducatif. Génère 5 questions à choix multiples sur le sujet suivant: "${topic}" avec un niveau de difficulté "${difficulty}". 
          
          Pour chaque question, fournis:
          1. Le texte de la question
          2. 4 options de réponse (une correcte et trois incorrectes)
          3. La réponse correcte (qui doit être l'une des options)
          4. Une explication détaillée et pédagogique de la réponse
          
          Réponds au format JSON avec cette structure:
          {
            "questions": [
              {
                "text": "Texte de la question",
                "options": ["Option A", "Option B", "Option C", "Option D"],
                "answer": "Option correcte (exactement comme dans les options)",
                "explanation": "Explication détaillée qui aide à comprendre pourquoi c'est la bonne réponse"
              },
              ...
            ]
          }
          
          Assure-toi que les questions sont adaptées au niveau de difficulté demandé:
          - Pour le niveau 'facile', utilise des questions fondamentales et ajoute des indices dans tes explications.
          - Pour le niveau 'moyen', utilise des questions de difficulté intermédiaire.
          - Pour le niveau 'difficile', utilise des questions plus complexes et détaillées.
          - Pour le niveau 'expert', utilise des questions très précises et techniques.
          
          IMPORTANT: 
          - Assure-toi que tes questions sont variées et différentes à chaque requête (ceci est la requête avec ID: ${timestamp})
          - Ne répète pas les mêmes questions que tu aurais pu générer précédemment
          - Choisis des aspects différents du sujet pour chaque question
          - Les explications doivent être pédagogiques et permettre à l'utilisateur d'apprendre
          - Ta réponse doit être uniquement au format JSON valide, sans aucun texte avant ou après.`
        }
      ],
      temperature: 0.8, // Augmenter légèrement la température pour plus de variété
    });

    // Récupérer et analyser la réponse
    const responseJson = completion.choices[0].message.content;
    if (!responseJson) {
      throw new Error('Réponse vide de l\'API OpenAI');
    }

    try {
      const parsedResponse = JSON.parse(responseJson);
      return NextResponse.json(parsedResponse);
    } catch (parseError) {
      console.error('Erreur de parsing JSON:', parseError);
      console.log('Réponse brute:', responseJson);
      
      // Fallback en cas d'erreur de parsing: retourner des questions par défaut
      return NextResponse.json({
        questions: [
          {
            text: `Quelle est une question courante sur le sujet "${topic}"?`,
            options: ["Option A", "Option B", "Option C", "Option D"],
            answer: "Option A",
            explanation: "Nous n'avons pas pu générer de questions sur ce sujet. Veuillez réessayer ou choisir un autre sujet."
          }
        ]
      });
    }
  } catch (error) {
    console.error('Erreur lors de la génération des questions:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la génération des questions' },
      { status: 500 }
    );
  }
} 