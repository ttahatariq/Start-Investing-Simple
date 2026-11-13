import { useMemo, useState } from 'react';

function formatCurrency(value: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(value);
}

export default function InflationCalculator() {
  const [amount, setAmount] = useState(1000);
  const [years, setYears] = useState(10);
  const [rate, setRate] = useState(3);

  const { futureCost, erodedValue, percentLost } = useMemo(() => {
    const r = rate / 100;
    const futureCost = amount * Math.pow(1 + r, years);
    const erodedValue = amount / Math.pow(1 + r, years);
    const percentLost = 100 * (1 - erodedValue / amount);
    return { futureCost, erodedValue, percentLost };
  }, [amount, years, rate]);

  return (
    <div className="corner-card rounded-sm bg-surface p-6">
      <div className="grid gap-6 sm:grid-cols-3">
        <label className="block">
          <span className="font-mono text-xs uppercase tracking-wide text-muted">Amount ($)</span>
          <input
            type="number"
            min={0}
            value={amount}
            onChange={(e) => setAmount(Math.max(0, Number(e.target.value)))}
            className="mt-1 w-full rounded-sm border border-line bg-ink px-3 py-2 text-paper focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand"
          />
        </label>
        <label className="block">
          <span className="font-mono text-xs uppercase tracking-wide text-muted">Number of years</span>
          <input
            type="number"
            min={1}
            max={100}
            value={years}
            onChange={(e) => setYears(Math.min(100, Math.max(1, Number(e.target.value))))}
            className="mt-1 w-full rounded-sm border border-line bg-ink px-3 py-2 text-paper focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand"
          />
        </label>
        <label className="block">
          <span className="font-mono text-xs uppercase tracking-wide text-muted">Annual inflation rate (%)</span>
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

      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        <div className="rounded-sm border border-line bg-ink p-4">
          <p className="font-mono text-xs uppercase tracking-wide text-muted">Future cost of today's basket</p>
          <p className="mt-1 text-2xl font-bold text-paper">{formatCurrency(futureCost)}</p>
          <p className="mt-1 text-xs text-muted">
            In {years} {years === 1 ? 'year' : 'years'}, you'd need this much to buy what {formatCurrency(amount)} buys today.
          </p>
        </div>
        <div className="rounded-sm border border-brand/30 bg-brand/10 p-4">
          <p className="font-mono text-xs uppercase tracking-wide text-muted">Purchasing power in today's dollars</p>
          <p className="mt-1 text-2xl font-bold text-paper">{formatCurrency(erodedValue)}</p>
          <p className="mt-1 text-xs text-muted">
            {formatCurrency(amount)} left unspent for {years} {years === 1 ? 'year' : 'years'} would feel like only this much today.
          </p>
        </div>
      </div>

      <div className="mt-6 rounded-sm border border-line bg-ink p-4 text-center">
        <p className="font-mono text-xs uppercase tracking-wide text-brand">Purchasing power lost</p>
        <p className="mt-1 text-xl font-bold text-paper">{percentLost.toFixed(1)}%</p>
        <p className="mt-2 text-xs text-muted">
          This is why letting cash sit idle for long periods has a real cost, even without losing a single dollar.
        </p>
      </div>

      <p className="mt-6 text-xs text-muted">
        This assumes a constant inflation rate, which real life never quite matches — actual inflation varies
        year to year. Read our full{' '}
        <a href="/blog/what-is-inflation/" className="text-brand underline">
          inflation guide
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
