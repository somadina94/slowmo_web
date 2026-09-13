export const QUIZ_QUESTIONS = [
  {
    q: "When do you struggle most?",
    opts: ["Falling asleep", "Staying asleep", "Waking up refreshed", "Racing thoughts at night"],
  },
  { q: "How often does it happen?", opts: ["A few nights a week", "Most nights", "Every night", "It comes and goes"] },
  { q: "What have you tried?", opts: ["Melatonin", "Ashwagandha / chamomile", "Meditation apps", "Nothing yet"] },
];

export function toggleAnswer(answers: number[][], step: number, option: number): number[][] {
  return answers.map((row, index) => {
    if (index !== step) return [...row];
    return row.includes(option) ? row.filter((item) => item !== option) : [...row, option];
  });
}

export function emptyAnswers(): number[][] {
  return [[], [], []];
}

export function quizDone(step: number): boolean {
  return step >= QUIZ_QUESTIONS.length;
}
