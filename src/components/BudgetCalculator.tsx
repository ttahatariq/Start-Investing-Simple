import { useMemo, useState } from 'react';

function formatCurrency(value: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(value);
}

interface Category {
  label: string;
  percent: number;
  color: string;
  examples: string;
}

const CATEGORIES: Category[] = [
  { label: 'Needs', percent: 50, color: 'bg-brand', examples: 'Rent, utilities, groceries, insurance, minimum debt payments' },
  { label: 'Wants', percent: 30, color: 'bg-aqua', examples: 'Dining out, entertainment, subscriptions, hobbies' },
  { label: 'Savings & Debt', percent: 20, color: 'bg-violet', examples: 'Emergency fund, investing, extra debt payoff' },
];

export default function BudgetCalculator() {
  const [income, setIncome] = useState(4000);

  const amounts = useMemo(
    () => CATEGORIES.map((c) => ({ ...c, amount: (income * c.percent) / 100 })),
    [income],
  );

  return (
    <div className="corner-card rounded-sm bg-surface p-6">
      <label className="block">
        <span className="font-mono text-xs uppercase tracking-wide text-muted">Monthly take-home income ($)</span>
        <input
          type="number"
          min={0}
          value={income}
          onChange={(e) => setIncome(Math.max(0, Number(e.target.value)))}
          className="mt-1 w-full rounded-sm border border-line bg-ink px-3 py-2 text-paper focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand"
        />
      </label>

      <div className="mt-6 flex h-4 w-full overflow-hidden rounded-full border border-line">
        {amounts.map((c) => (
          <div key={c.label} className={c.color} style={{ width: `${c.percent}%` }} title={`${c.label}: ${c.percent}%`} />
        ))}
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-3">
        {amounts.map((c) => (
          <div key={c.label} className="rounded-sm border border-line bg-ink p-4">
            <p className="font-mono text-xs uppercase tracking-wide text-muted">
              {c.label} <span className="text-paper/60">({c.percent}%)</span>
            </p>
            <p className="mt-1 text-2xl font-bold text-paper">{formatCurrency(c.amount)}</p>
            <p className="mt-2 text-xs text-muted">{c.examples}</p>
          </div>
        ))}
      </div>

      <p className="mt-6 text-xs text-muted">
        This is a starting benchmark, not a strict rule — your actual costs (especially housing) may not fit these
        exact percentages. Read our full{' '}
        <a href="/blog/50-30-20-budget-rule/" className="text-brand underline">
          50/30/20 budget guide
        </a>{' '}
        for how to adapt it, and see our{' '}
        <a href="/disclaimer/" className="text-brand underline">
          disclaimer
        </a>
        .
      </p>
    </div>
  );
}
