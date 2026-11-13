import { useState } from 'react';

interface Option {
  label: string;
  points: number;
}

interface Question {
  question: string;
  options: Option[];
}

const questions: Question[] = [
  {
    question: 'How would you react if your investments dropped 20% in a few months?',
    options: [
      { label: "I'd sell immediately to prevent further losses", points: 1 },
      { label: "I'd feel uneasy but probably hold on", points: 2 },
      { label: "I'd stay the course — it's temporary", points: 3 },
      { label: "I'd see it as a buying opportunity", points: 4 },
    ],
  },
  {
    question: 'When do you expect to actually need this money?',
    options: [
      { label: 'Within 1-2 years', points: 1 },
      { label: '3-5 years', points: 2 },
      { label: '6-10 years', points: 3 },
      { label: 'More than 10 years', points: 4 },
    ],
  },
  {
    question: 'How would you describe your investing experience?',
    options: [
      { label: "None — I'm just starting", points: 1 },
      { label: "Some — I've invested a little before", points: 2 },
      { label: 'Moderate — I understand the basics well', points: 3 },
      { label: "Extensive — I've been investing for years", points: 4 },
    ],
  },
  {
    question: 'How stable is your current income?',
    options: [
      { label: 'Unstable / unpredictable', points: 1 },
      { label: 'Somewhat stable', points: 2 },
      { label: 'Stable', points: 3 },
      { label: 'Very stable, with multiple income sources', points: 4 },
    ],
  },
  {
    question: 'Do you have an emergency fund in place?',
    options: [
      { label: 'No', points: 1 },
      { label: 'Partial — a few weeks of expenses', points: 2 },
      { label: 'Yes — 1-3 months of expenses', points: 3 },
      { label: 'Yes — 3-6+ months of expenses', points: 4 },
    ],
  },
  {
    question: 'Which statement best matches your attitude toward risk?',
    options: [
      { label: 'I prioritize protecting what I have over growing it', points: 1 },
      { label: 'I want a balance of safety and growth', points: 2 },
      { label: "I'm comfortable with ups and downs for better long-term growth", points: 3 },
      { label: "I'll accept significant short-term swings for maximum long-term growth", points: 4 },
    ],
  },
];

const results = {
  conservative: {
    label: 'Conservative',
    description:
      "You lean toward protecting what you have over chasing growth. A portfolio weighted more toward bonds and stable investments, with a smaller allocation to stocks, is often a more comfortable fit than an aggressive, stock-heavy approach.",
  },
  moderate: {
    label: 'Moderate',
    description:
      "You're comfortable with some ups and downs in exchange for long-term growth, but not extreme swings. A balanced mix of stocks and bonds — often adjusted based on how many years you have until you'll need the money — tends to fit this profile well.",
  },
  aggressive: {
    label: 'Aggressive',
    description:
      "You're comfortable with significant short-term volatility in pursuit of long-term growth. A portfolio weighted heavily toward stocks is more consistent with this profile — assuming your timeline and financial situation can support riding out downturns.",
  },
};

function getResult(score: number) {
  if (score <= 11) return results.conservative;
  if (score <= 18) return results.moderate;
  return results.aggressive;
}

export default function RiskToleranceQuiz() {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);

  const isDone = step >= questions.length;
  const score = answers.reduce((sum, p) => sum + p, 0);

  const selectAnswer = (points: number) => {
    const next = [...answers];
    next[step] = points;
    setAnswers(next);
    setStep(step + 1);
  };

  const restart = () => {
    setStep(0);
    setAnswers([]);
  };

  if (isDone) {
    const result = getResult(score);
    return (
      <div className="corner-card rounded-sm bg-surface p-6">
        <p className="font-mono text-xs uppercase tracking-wide text-brand">Your result</p>
        <h3 className="mt-2 text-2xl font-bold text-paper">{result.label} Investor</h3>
        <p className="mt-3 text-muted">{result.description}</p>

        <div className="mt-6 flex flex-wrap gap-3">
          <a
            href="/blog/risk-tolerance-and-asset-allocation/"
            className="rounded-sm bg-brand px-5 py-2.5 font-mono text-xs font-semibold uppercase tracking-wide text-ink hover:bg-brand-dim"
          >
            Read the full guide
          </a>
          <a
            href="/tools/compound-interest-calculator/"
            className="rounded-sm border border-line px-5 py-2.5 font-mono text-xs font-semibold uppercase tracking-wide text-paper hover:border-brand hover:text-brand"
          >
            Try the calculator
          </a>
        </div>

        <button
          onClick={restart}
          className="mt-6 font-mono text-xs uppercase tracking-wide text-muted hover:text-brand"
        >
          Retake the quiz
        </button>

        <p className="mt-6 text-xs text-muted">
          This quiz offers a general, informal starting point for thinking about risk tolerance — not a
          personalized recommendation. See our <a href="/disclaimer/" className="text-brand underline">disclaimer</a>.
        </p>
      </div>
    );
  }

  const current = questions[step];

  return (
    <div className="corner-card rounded-sm bg-surface p-6">
      <p className="font-mono text-xs uppercase tracking-wide text-muted">
        Question {step + 1} of {questions.length}
      </p>
      <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-ink">
        <div
          className="h-full bg-brand transition-all"
          style={{ width: `${(step / questions.length) * 100}%` }}
        />
      </div>

      <h3 className="mt-6 text-lg font-semibold text-paper">{current.question}</h3>

      <div className="mt-5 space-y-2">
        {current.options.map((option) => (
          <button
            key={option.label}
            onClick={() => selectAnswer(option.points)}
            className="block w-full rounded-sm border border-line bg-ink px-4 py-3 text-left text-sm text-paper transition-colors hover:border-brand hover:text-brand"
          >
            {option.label}
          </button>
        ))}
      </div>
    </div>
  );
}
