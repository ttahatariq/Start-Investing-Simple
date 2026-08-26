import { useMemo, useState } from 'react';

function formatCurrency(value: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(value);
}

function projectRetirementSavings(
  currentSavings: number,
  monthlyContribution: number,
  annualRatePercent: number,
  years: number,
): number {
  const monthlyRate = annualRatePercent / 100 / 12;
  let balance = currentSavings;

  for (let month = 0; month < years * 12; month++) {
    balance = balance * (1 + monthlyRate) + monthlyContribution;
  }

  return balance;
}

export default function RetirementCalculator() {
  const [currentAge, setCurrentAge] = useState(30);
  const [retirementAge, setRetirementAge] = useState(65);
  const [currentSavings, setCurrentSavings] = useState(10000);
  const [monthlyContribution, setMonthlyContribution] = useState(400);
  const [rate, setRate] = useState(7);

  const years = Math.max(0, retirementAge - currentAge);

  const projectedSavings = useMemo(
    () => projectRetirementSavings(currentSavings, monthlyContribution, rate, years),
    [currentSavings, monthlyContribution, rate, years],
  );

  // The "4% rule" — a common (not guaranteed) starting estimate for a sustainable
  // first-year withdrawal amount from retirement savings.
  const sustainableAnnualWithdrawal = projectedSavings * 0.04;
  const sustainableMonthlyWithdrawal = sustainableAnnualWithdrawal / 12;

  return (
    <div className="corner-card rounded-sm bg-surface p-6">
      <div className="grid gap-6 sm:grid-cols-2">
        <label className="block">
          <span className="font-mono text-xs uppercase tracking-wide text-muted">Current age</span>
          <input
            type="number"
            min={16}
            max={90}
            value={currentAge}
            onChange={(e) => setCurrentAge(Math.max(16, Number(e.target.value)))}
            className="mt-1 w-full rounded-sm border border-line bg-ink px-3 py-2 text-paper focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand"
          />
        </label>

        <label className="block">
          <span className="font-mono text-xs uppercase tracking-wide text-muted">Target retirement age</span>
          <input
            type="number"
            min={30}
            max={100}
            value={retirementAge}
            onChange={(e) => setRetirementAge(Math.max(30, Number(e.target.value)))}
            className="mt-1 w-full rounded-sm border border-line bg-ink px-3 py-2 text-paper focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand"
          />
        </label>

        <label className="block">
          <span className="font-mono text-xs uppercase tracking-wide text-muted">Current retirement savings ($)</span>
          <input
            type="number"
            min={0}
            value={currentSavings}
            onChange={(e) => setCurrentSavings(Math.max(0, Number(e.target.value)))}
            className="mt-1 w-full rounded-sm border border-line bg-ink px-3 py-2 text-paper focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand"
          />
        </label>

        <label className="block">
          <span className="font-mono text-xs uppercase tracking-wide text-muted">Monthly contribution ($)</span>
          <input
            type="number"
            min={0}
            value={monthlyContribution}
            onChange={(e) => setMonthlyContribution(Math.max(0, Number(e.target.value)))}
            className="mt-1 w-full rounded-sm border border-line bg-ink px-3 py-2 text-paper focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand"
          />
        </label>

        <label className="block sm:col-span-2">
          <span className="font-mono text-xs uppercase tracking-wide text-muted">Estimated annual return (%)</span>
          <input
            type="number"
            min={0}
            max={30}
            step={0.1}
            value={rate}
            onChange={(e) => setRate(Math.max(0, Number(e.target.value)))}
            className="mt-1 w-full rounded-sm border border-line bg-ink px-3 py-2 text-paper focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand"
          />
        </label>
      </div>

      <div className="mt-8 grid gap-4 sm:grid-cols-3">
        <div className="rounded-sm border border-brand/30 bg-brand/10 p-4">
          <p className="font-mono text-xs uppercase tracking-wide text-brand">Projected savings at {retirementAge}</p>
          <p className="mt-1 text-2xl font-bold text-paper">{formatCurrency(projectedSavings)}</p>
        </div>
        <div className="rounded-sm border border-line bg-ink p-4">
          <p className="font-mono text-xs uppercase tracking-wide text-muted">Est. sustainable withdrawal / year</p>
          <p className="mt-1 text-2xl font-bold text-paper">{formatCurrency(sustainableAnnualWithdrawal)}</p>
        </div>
        <div className="rounded-sm border border-line bg-ink p-4">
          <p className="font-mono text-xs uppercase tracking-wide text-muted">That's per month</p>
          <p className="mt-1 text-2xl font-bold text-paper">{formatCurrency(sustainableMonthlyWithdrawal)}</p>
        </div>
      </div>

      <p className="mt-6 text-xs text-muted">
        The withdrawal estimate uses the "4% rule," a common starting framework based on historical U.S. market
        data — not a guarantee. This calculator is for illustrative purposes only and assumes a constant annual
        return, which real investments don't provide. Read our{' '}
        <a href="/blog/how-much-do-you-need-to-retire/" className="text-brand underline">
          guide on retirement savings
        </a>{' '}
        for more context, and see our{' '}
        <a href="/disclaimer/" className="text-brand underline">
          disclaimer
        </a>
        .
      </p>
    </div>
  );
}
