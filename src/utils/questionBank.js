import { generateQuestionSet } from './questionGenerator';

export function generateSessionQuestions() {
  const bank = generateQuestionSet();
  
  return bank.map(q => {
    return {
      world: q.worldIndex,
      questionText: q.question,
      options: q.options || null,
      correctAnswer: q.answer,
      type: q.type,
      display: q.display,
      highlightedDigit: q.highlightedDigit,
      highlightedPosition: q.highlightedPosition,
      missingPosition: q.missingPosition,
      explanation: q.explanation
    };
  });
}
