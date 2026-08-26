import { useMemo, useState } from 'react';

interface Debt {
  id: number;
  name: string;
  balance: number;
  apr: number;
  minPayment: number;
}

interface SimulationResult {
  months: number;
  totalInterest: number;
  payoffOrder: string[];
  maxedOut: boolean;
}

function formatCurrency(value: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(value);
}

const MAX_MONTHS = 600;

function simulate(debts: Debt[], extraPayment: number, strategy: 'snowball' | 'avalanche'): SimulationResult {
  let working = debts.map((d) => ({ ...d, remaining: d.balance }));
  let totalInterest = 0;
  let month = 0;
  const payoffOrder: string[] = [];

  while (working.some((d) => d.remaining > 0.01) && month < MAX_MONTHS) {
    month++;

    // Accrue interest
    for (const d of working) {
      if (d.remaining > 0) {
        const monthlyInterest = (d.remaining * (d.apr / 100)) / 12;
        d.remaining += monthlyInterest;
        totalInterest += monthlyInterest;
      }
    }

    // Pay minimums
    for (const d of working) {
      if (d.remaining > 0) {
        const payment = Math.min(d.minPayment, d.remaining);
        d.remaining -= payment;
      }
    }

    // Direct extra payment (plus freed-up minimums from paid-off debts) at the target debt
    const freedMinimums = debts
      .filter((orig) => !working.find((w) => w.id === orig.id && w.remaining > 0))
      .reduce((sum, orig) => sum + orig.minPayment, 0);

    let pool = extraPayment + freedMinimums;

    const order =
      strategy === 'snowball'
        ? [...working].filter((d) => d.remaining > 0).sort((a, b) => a.remaining - b.remaining)
        : [...working].filter((d) => d.remaining > 0).sort((a, b) => b.apr - a.apr);

    for (const target of order) {
      if (pool <= 0) break;
      const payment = Math.min(pool, target.remaining);
      target.remaining -= payment;
      pool -= payment;
      if (target.remaining <= 0.01 && !payoffOrder.includes(target.name)) {
        payoffOrder.push(target.name);
      }
    }
  }

  return {
    months: month,
    totalInterest,
    payoffOrder,
    maxedOut: month >= MAX_MONTHS,
  };
}

let nextId = 1;

export default function DebtPayoffCalculator() {
  const [debts, setDebts] = useState<Debt[]>([
    { id: nextId++, name: 'Credit Card', balance: 3000, apr: 22, minPayment: 90 },
    { id: nextId++, name: 'Car Loan', balance: 8000, apr: 7, minPayment: 220 },
  ]);
  const [extraPayment, setExtraPayment] = useState(150);

  const updateDebt = (id: number, field: keyof Debt, value: string) => {
    setDebts((prev) =>
      prev.map((d) => (d.id === id ? { ...d, [field]: field === 'name' ? value : Math.max(0, Number(value)) } : d)),
    );
  };

  const addDebt = () => {
    setDebts((prev) => [...prev, { id: nextId++, name: `Debt ${prev.length + 1}`, balance: 1000, apr: 15, minPayment: 50 }]);
  };

  const removeDebt = (id: number) => {
    setDebts((prev) => prev.filter((d) => d.id !== id));
  };

  const totalMinPayments = useMemo(() => debts.reduce((sum, d) => sum + d.minPayment, 0), [debts]);

  const avalanche = useMemo(() => (debts.length ? simulate(debts, extraPayment, 'avalanche') : null), [debts, extraPayment]);
  const snowball = useMemo(() => (debts.length ? simulate(debts, extraPayment, 'snowball') : null), [debts, extraPayment]);

  return (
    <div className="corner-card rounded-sm bg-surface p-6">
      <div className="space-y-4">
        {debts.map((debt) => (
          <div key={debt.id} className="grid grid-cols-2 gap-3 rounded-sm border border-line bg-ink p-4 sm:grid-cols-5 sm:items-end">
            <label className="block sm:col-span-2">
              <span className="font-mono text-xs uppercase tracking-wide text-muted">Name</span>
              <input
                type="text"
                value={debt.name}
                onChange={(e) => updateDebt(debt.id, 'name', e.target.value)}
                className="mt-1 w-full rounded-sm border border-line bg-surface px-2 py-1.5 text-sm text-paper focus:border-brand focus:outline-none"
              />
            </label>
            <label className="block">
              <span className="font-mono text-xs uppercase tracking-wide text-muted">Balance ($)</span>
              <input
                type="number"
                min={0}
                value={debt.balance}
                onChange={(e) => updateDebt(debt.id, 'balance', e.target.value)}
                className="mt-1 w-full rounded-sm border border-line bg-surface px-2 py-1.5 text-sm text-paper focus:border-brand focus:outline-none"
              />
            </label>
            <label className="block">
              <span className="font-mono text-xs uppercase tracking-wide text-muted">APR (%)</span>
              <input
                type="number"
                min={0}
                step={0.1}
                value={debt.apr}
                onChange={(e) => updateDebt(debt.id, 'apr', e.target.value)}
                className="mt-1 w-full rounded-sm border border-line bg-surface px-2 py-1.5 text-sm text-paper focus:border-brand focus:outline-none"
              />
            </label>
            <div className="flex items-end gap-2">
              <label className="block flex-1">
                <span className="font-mono text-xs uppercase tracking-wide text-muted">Min payment ($)</span>
                <input
                  type="number"
                  min={0}
                  value={debt.minPayment}
                  onChange={(e) => updateDebt(debt.id, 'minPayment', e.target.value)}
                  className="mt-1 w-full rounded-sm border border-line bg-surface px-2 py-1.5 text-sm text-paper focus:border-brand focus:outline-none"
                />
              </label>
              {debts.length > 1 && (
                <button
                  onClick={() => removeDebt(debt.id)}
                  aria-label={`Remove ${debt.name}`}
                  className="mb-0.5 rounded-sm border border-line px-2 py-1.5 text-xs text-muted hover:border-orange hover:text-orange"
                >
                  ✕
                </button>
              )}
            </div>
          </div>
        ))}

        <button
          onClick={addDebt}
          className="rounded-sm border border-line px-4 py-2 font-mono text-xs uppercase tracking-wide text-muted hover:border-brand hover:text-brand"
        >
          + Add another debt
        </button>
      </div>

      <label className="mt-6 block max-w-xs">
        <span className="font-mono text-xs uppercase tracking-wide text-muted">Extra monthly payment ($)</span>
        <input
          type="number"
          min={0}
          value={extraPayment}
          onChange={(e) => setExtraPayment(Math.max(0, Number(e.target.value)))}
          className="mt-1 w-full rounded-sm border border-line bg-ink px-3 py-2 text-paper focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand"
        />
      </label>
      <p className="mt-2 font-mono text-xs text-muted/70">
        Total minimum payments across all debts: {formatCurrency(totalMinPayments)}/mo
      </p>

      {avalanche && snowball && (
        <div className="mt-8 grid gap-6 sm:grid-cols-2">
          <div className="rounded-sm border border-line bg-ink p-5">
            <p className="font-mono text-xs uppercase tracking-wide text-brand">Avalanche (highest rate first)</p>
            <p className="mt-2 text-2xl font-bold text-paper">
              {avalanche.maxedOut ? '50+ years' : `${avalanche.months} months`}
            </p>
            <p className="text-xs text-muted">to be debt-free</p>
            <p className="mt-3 font-mono text-sm text-paper/80">{formatCurrency(avalanche.totalInterest)} total interest</p>
          </div>
          <div className="rounded-sm border border-line bg-ink p-5">
            <p className="font-mono text-xs uppercase tracking-wide text-aqua">Snowball (smallest balance first)</p>
            <p className="mt-2 text-2xl font-bold text-paper">
              {snowball.maxedOut ? '50+ years' : `${snowball.months} months`}
            </p>
            <p className="text-xs text-muted">to be debt-free</p>
            <p className="mt-3 font-mono text-sm text-paper/80">{formatCurrency(snowball.totalInterest)} total interest</p>
          </div>
        </div>
      )}

      {avalanche?.maxedOut && (
        <p className="mt-4 rounded-sm border border-orange/40 bg-orange/10 p-3 text-sm text-paper/90">
          Your current minimum payments and extra payment may not be enough to make real progress against interest
          charges — consider increasing your monthly payment.
        </p>
      )}

      <p className="mt-6 text-xs text-muted">
        This calculator assumes fixed interest rates and consistent payments, which is a simplification of real-world
        debt. Read our full{' '}
        <a href="/blog/debt-payoff-snowball-vs-avalanche/" className="text-brand underline">
          debt snowball vs. avalanche guide
        </a>{' '}
        for context, and see our{' '}
        <a href="/disclaimer/" className="text-brand underline">
          disclaimer
        </a>
        .
      </p>
    </div>
  );
}
