import { NextResponse } from 'next/server';
import OpenAI from 'openai';

// Initialiser le client OpenAI
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY as string,
});

export async function POST(req: Request) {
  try {
    const { question, explanation } = await req.json();

    if (!question || !explanation) {
      return NextResponse.json(
        { error: 'La question et l\'explication sont requises' },
        { status: 400 }
      );
    }

    // Ajouter un timestamp pour assurer des réponses différentes à chaque demande
    const timestamp = new Date().toISOString();

    // Créer la requête à l'API OpenAI
    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content: `Tu es un assistant pédagogique qui fournit des explications détaillées sur des sujets éducatifs. Ton objectif est d'approfondir les connaissances de l'utilisateur sur un sujet spécifique en lui fournissant des informations complémentaires, des anecdotes, des exemples concrets et des liens avec d'autres domaines.

Pour chaque demande, tu dois fournir des informations uniques et variées, allant au-delà de ce qui a été précédemment expliqué. L'utilisateur est curieux et souhaite approfondir sa compréhension du sujet de manière significative.

ID de requête unique: ${timestamp}`
        },
        {
          role: 'user',
          content: `Je voudrais en savoir plus sur cette question: "${question}". 
          
          Une explication basique m'a déjà été fournie: "${explanation}".
          
          Pourrais-tu me donner des détails supplémentaires qui approfondissent ma compréhension? 
          Explique des concepts liés, donne des exemples concrets, et éventuellement des anecdotes ou faits historiques intéressants. 
          Propose-moi une perspective nouvelle ou un angle que je n'ai probablement pas encore considéré.
          
          L'objectif est que j'apprenne davantage sur ce sujet.`
        }
      ],
      temperature: 0.8, // Augmenter la température pour plus de créativité
    });

    // Récupérer la réponse
    const additionalInfo = completion.choices[0].message.content;
    if (!additionalInfo) {
      throw new Error('Réponse vide de l\'API OpenAI');
    }

    return NextResponse.json({ additionalInfo });
  } catch (error) {
    console.error('Erreur lors de la récupération des informations supplémentaires:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la récupération des informations supplémentaires' },
      { status: 500 }
    );
  }
} 