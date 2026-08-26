import { useMemo, useState } from 'react';

interface YearRow {
  year: number;
  contributions: number;
  interest: number;
  balance: number;
}

function formatCurrency(value: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(value);
}

function calculateGrowth(
  initial: number,
  monthlyContribution: number,
  annualRatePercent: number,
  years: number,
): YearRow[] {
  const monthlyRate = annualRatePercent / 100 / 12;
  const rows: YearRow[] = [];

  let balance = initial;
  let totalContributions = initial;

  for (let year = 1; year <= years; year++) {
    for (let month = 0; month < 12; month++) {
      balance = balance * (1 + monthlyRate) + monthlyContribution;
      totalContributions += monthlyContribution;
    }
    rows.push({
      year,
      contributions: totalContributions,
      interest: balance - totalContributions,
      balance,
    });
  }

  return rows;
}

export default function CompoundInterestCalculator() {
  const [initial, setInitial] = useState(1000);
  const [monthly, setMonthly] = useState(200);
  const [rate, setRate] = useState(7);
  const [years, setYears] = useState(20);

  const rows = useMemo(() => calculateGrowth(initial, monthly, rate, years), [initial, monthly, rate, years]);
  const finalRow = rows[rows.length - 1];
  const maxBalance = finalRow?.balance ?? 1;

  return (
    <div className="corner-card rounded-sm bg-surface p-6">
      <div className="grid gap-6 sm:grid-cols-2">
        <label className="block">
          <span className="font-mono text-xs uppercase tracking-wide text-muted">Initial investment ($)</span>
          <input
            type="number"
            min={0}
            value={initial}
            onChange={(e) => setInitial(Math.max(0, Number(e.target.value)))}
            className="mt-1 w-full rounded-sm border border-line bg-ink px-3 py-2 text-paper focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand"
          />
        </label>

        <label className="block">
          <span className="font-mono text-xs uppercase tracking-wide text-muted">Monthly contribution ($)</span>
          <input
            type="number"
            min={0}
            value={monthly}
            onChange={(e) => setMonthly(Math.max(0, Number(e.target.value)))}
            className="mt-1 w-full rounded-sm border border-line bg-ink px-3 py-2 text-paper focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand"
          />
        </label>

        <label className="block">
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

        <label className="block">
          <span className="font-mono text-xs uppercase tracking-wide text-muted">Number of years</span>
          <input
            type="number"
            min={1}
            max={60}
            value={years}
            onChange={(e) => setYears(Math.min(60, Math.max(1, Number(e.target.value))))}
            className="mt-1 w-full rounded-sm border border-line bg-ink px-3 py-2 text-paper focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand"
          />
        </label>
      </div>

      {finalRow && (
        <>
          <div className="mt-8 grid gap-4 sm:grid-cols-3">
            <div className="rounded-sm border border-brand/30 bg-brand/10 p-4">
              <p className="font-mono text-xs uppercase tracking-wide text-brand">Future value</p>
              <p className="mt-1 text-2xl font-bold text-paper">{formatCurrency(finalRow.balance)}</p>
            </div>
            <div className="rounded-sm border border-line bg-ink p-4">
              <p className="font-mono text-xs uppercase tracking-wide text-muted">Total contributed</p>
              <p className="mt-1 text-2xl font-bold text-paper">{formatCurrency(finalRow.contributions)}</p>
            </div>
            <div className="rounded-sm border border-line bg-ink p-4">
              <p className="font-mono text-xs uppercase tracking-wide text-muted">Total interest earned</p>
              <p className="mt-1 text-2xl font-bold text-paper">{formatCurrency(finalRow.interest)}</p>
            </div>
          </div>

          <div className="mt-8">
            <p className="font-mono text-xs uppercase tracking-wide text-muted">Growth over time</p>
            <div className="mt-2 flex h-40 items-end gap-1">
              {rows.map((row) => (
                <div
                  key={row.year}
                  className="flex-1 rounded-t bg-brand/80"
                  style={{ height: `${Math.max(4, (row.balance / maxBalance) * 100)}%` }}
                  title={`Year ${row.year}: ${formatCurrency(row.balance)}`}
                />
              ))}
            </div>
            <div className="mt-1 flex justify-between font-mono text-xs text-muted/70">
              <span>Year 1</span>
              <span>Year {years}</span>
            </div>
          </div>

          <p className="mt-6 text-xs text-muted">
            This calculator is for illustrative purposes only and assumes a constant annual return, which is not
            realistic for actual investments. It is not a guarantee of future results. See our{' '}
            <a href="/disclaimer/" className="text-brand underline">
              disclaimer
            </a>
            .
          </p>
        </>
      )}
    </div>
  );
}
