// Type des questions
export interface QuizQuestion {
  text: string;
  options: string[];
  answer: string;
  explanation: string;
}

// Type pour React
declare namespace React {
  interface JSX {}
} 