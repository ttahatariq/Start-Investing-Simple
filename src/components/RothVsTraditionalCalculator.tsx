import { useMemo, useState } from 'react';

function formatCurrency(value: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(value);
}

function futureValueOfAnnualContributions(annualContribution: number, annualRatePercent: number, years: number): number {
  const r = annualRatePercent / 100;
  let balance = 0;
  for (let year = 0; year < years; year++) {
    balance = balance * (1 + r) + annualContribution;
  }
  return balance;
}

export default function RothVsTraditionalCalculator() {
  const [contribution, setContribution] = useState(6000);
  const [currentRate, setCurrentRate] = useState(22);
  const [retirementRate, setRetirementRate] = useState(15);
  const [returnRate, setReturnRate] = useState(7);
  const [years, setYears] = useState(30);

  const { traditionalAfterTax, rothAfterTax, equivalentRothContribution } = useMemo(() => {
    const traditionalFV = futureValueOfAnnualContributions(contribution, returnRate, years);
    const traditionalAfterTax = traditionalFV * (1 - retirementRate / 100);

    // Same take-home-pay impact as the Traditional contribution, since Roth isn't deductible now.
    const equivalentRothContribution = contribution * (1 - currentRate / 100);
    const rothFV = futureValueOfAnnualContributions(equivalentRothContribution, returnRate, years);
    const rothAfterTax = rothFV; // Qualified Roth withdrawals aren't taxed.

    return { traditionalAfterTax, rothAfterTax, equivalentRothContribution };
  }, [contribution, currentRate, retirementRate, returnRate, years]);

  const winner = rothAfterTax >= traditionalAfterTax ? 'Roth' : 'Traditional';
  const difference = Math.abs(rothAfterTax - traditionalAfterTax);

  return (
    <div className="corner-card rounded-sm bg-surface p-6">
      <div className="grid gap-6 sm:grid-cols-2">
        <label className="block">
          <span className="font-mono text-xs uppercase tracking-wide text-muted">Annual contribution ($)</span>
          <input
            type="number"
            min={0}
            value={contribution}
            onChange={(e) => setContribution(Math.max(0, Number(e.target.value)))}
            className="mt-1 w-full rounded-sm border border-line bg-ink px-3 py-2 text-paper focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand"
          />
        </label>
        <label className="block">
          <span className="font-mono text-xs uppercase tracking-wide text-muted">Years until retirement</span>
          <input
            type="number"
            min={1}
            max={60}
            value={years}
            onChange={(e) => setYears(Math.min(60, Math.max(1, Number(e.target.value))))}
            className="mt-1 w-full rounded-sm border border-line bg-ink px-3 py-2 text-paper focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand"
          />
        </label>
        <label className="block">
          <span className="font-mono text-xs uppercase tracking-wide text-muted">Your current tax rate (%)</span>
          <input
            type="number"
            min={0}
            max={60}
            value={currentRate}
            onChange={(e) => setCurrentRate(Math.max(0, Number(e.target.value)))}
            className="mt-1 w-full rounded-sm border border-line bg-ink px-3 py-2 text-paper focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand"
          />
        </label>
        <label className="block">
          <span className="font-mono text-xs uppercase tracking-wide text-muted">Expected retirement tax rate (%)</span>
          <input
            type="number"
            min={0}
            max={60}
            value={retirementRate}
            onChange={(e) => setRetirementRate(Math.max(0, Number(e.target.value)))}
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
            value={returnRate}
            onChange={(e) => setReturnRate(Math.max(0, Number(e.target.value)))}
            className="mt-1 w-full rounded-sm border border-line bg-ink px-3 py-2 text-paper focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand"
          />
        </label>
      </div>

      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        <div className={`rounded-sm border p-4 ${winner === 'Traditional' ? 'border-brand/30 bg-brand/10' : 'border-line bg-ink'}`}>
          <p className="font-mono text-xs uppercase tracking-wide text-muted">Traditional (after-tax value)</p>
          <p className="mt-1 text-2xl font-bold text-paper">{formatCurrency(traditionalAfterTax)}</p>
          <p className="mt-1 text-xs text-muted">Full {formatCurrency(contribution)}/yr invested, taxed at withdrawal</p>
        </div>
        <div className={`rounded-sm border p-4 ${winner === 'Roth' ? 'border-brand/30 bg-brand/10' : 'border-line bg-ink'}`}>
          <p className="font-mono text-xs uppercase tracking-wide text-muted">Roth (after-tax value)</p>
          <p className="mt-1 text-2xl font-bold text-paper">{formatCurrency(rothAfterTax)}</p>
          <p className="mt-1 text-xs text-muted">{formatCurrency(equivalentRothContribution)}/yr invested (same take-home impact), tax-free at withdrawal</p>
        </div>
      </div>

      <div className="mt-6 rounded-sm border border-line bg-ink p-4 text-center">
        <p className="font-mono text-xs uppercase tracking-wide text-brand">{winner} comes out ahead by</p>
        <p className="mt-1 text-xl font-bold text-paper">{formatCurrency(difference)}</p>
        <p className="mt-2 text-xs text-muted">
          {retirementRate < currentRate
            ? "Your retirement rate is lower than your current rate, which generally favors Traditional."
            : retirementRate > currentRate
              ? "Your retirement rate is higher than your current rate, which generally favors Roth."
              : "Your rates are equal — in that case, both options produce the same after-tax result."}
        </p>
      </div>

      <p className="mt-6 text-xs text-muted">
        This compares contributions with the same impact on your take-home pay today, which is the fair way to
        compare the two. It assumes your guessed future tax rate is accurate, which is inherently uncertain —
        see our full{' '}
        <a href="/blog/roth-ira-vs-traditional-ira/" className="text-brand underline">
          Roth vs. Traditional guide
        </a>{' '}
        and our{' '}
        <a href="/disclaimer/" className="text-brand underline">
          disclaimer
        </a>
        .
      </p>
    </div>
  );
}
