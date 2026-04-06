export interface Question {
  type: 'multiple' | 'boolean' | 'multiple-correct';
  question: string;
  correct_answer: string | string[];
  incorrect_answers: string[];
}

export interface PracticeResult {
  studentName: string;
  totalQuestions: number;
  correctAnswers: number;
  incorrectAnswers: number;
  percentage: number;
  answers: { question: string; selected: string | string[]; isCorrect: boolean }[];
}
