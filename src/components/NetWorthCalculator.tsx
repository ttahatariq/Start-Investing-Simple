import { useEffect, useMemo, useState } from 'react';

interface LineItem {
  id: number;
  label: string;
  amount: number;
}

const STORAGE_KEY = 'sis-net-worth-v1';

function formatCurrency(value: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(value);
}

const defaultAssets: LineItem[] = [
  { id: 1, label: 'Cash & Savings', amount: 5000 },
  { id: 2, label: 'Retirement Accounts', amount: 15000 },
  { id: 3, label: 'Investments', amount: 3000 },
];

const defaultLiabilities: LineItem[] = [
  { id: 1, label: 'Credit Card Debt', amount: 1500 },
  { id: 2, label: 'Student Loans', amount: 12000 },
];

let nextId = 100;

function LineItemRow({
  item,
  onChange,
  onRemove,
}: {
  item: LineItem;
  onChange: (id: number, field: 'label' | 'amount', value: string) => void;
  onRemove: (id: number) => void;
}) {
  return (
    <div className="flex items-end gap-2">
      <label className="block flex-1">
        <input
          type="text"
          value={item.label}
          onChange={(e) => onChange(item.id, 'label', e.target.value)}
          className="w-full rounded-sm border border-line bg-ink px-3 py-2 text-sm text-paper focus:border-brand focus:outline-none"
        />
      </label>
      <label className="block w-32">
        <input
          type="number"
          min={0}
          value={item.amount}
          onChange={(e) => onChange(item.id, 'amount', e.target.value)}
          className="w-full rounded-sm border border-line bg-ink px-3 py-2 text-sm text-paper focus:border-brand focus:outline-none"
        />
      </label>
      <button
        onClick={() => onRemove(item.id)}
        aria-label={`Remove ${item.label}`}
        className="rounded-sm border border-line px-2 py-2 text-xs text-muted hover:border-orange hover:text-orange"
      >
        ✕
      </button>
    </div>
  );
}

export default function NetWorthCalculator() {
  const [assets, setAssets] = useState<LineItem[]>(defaultAssets);
  const [liabilities, setLiabilities] = useState<LineItem[]>(defaultLiabilities);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.assets) setAssets(parsed.assets);
        if (parsed.liabilities) setLiabilities(parsed.liabilities);
      }
    } catch {
      // Ignore unavailable/blocked storage — defaults are already set.
    }
    setLoaded(true);
  }, []);

  useEffect(() => {
    if (!loaded) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ assets, liabilities }));
    } catch {
      // Storage may be unavailable (private browsing, etc.) — fail silently.
    }
  }, [assets, liabilities, loaded]);

  const updateItem = (
    list: LineItem[],
    setList: (items: LineItem[]) => void,
    id: number,
    field: 'label' | 'amount',
    value: string,
  ) => {
    setList(list.map((item) => (item.id === id ? { ...item, [field]: field === 'amount' ? Math.max(0, Number(value)) : value } : item)));
  };

  const addItem = (setList: (fn: (items: LineItem[]) => LineItem[]) => void, label: string) => {
    setList((prev) => [...prev, { id: nextId++, label, amount: 0 }]);
  };

  const removeItem = (list: LineItem[], setList: (items: LineItem[]) => void, id: number) => {
    setList(list.filter((item) => item.id !== id));
  };

  const totalAssets = useMemo(() => assets.reduce((sum, a) => sum + a.amount, 0), [assets]);
  const totalLiabilities = useMemo(() => liabilities.reduce((sum, l) => sum + l.amount, 0), [liabilities]);
  const netWorth = totalAssets - totalLiabilities;

  return (
    <div className="corner-card rounded-sm bg-surface p-6">
      <div className="grid gap-8 sm:grid-cols-2">
        <div>
          <p className="font-mono text-xs uppercase tracking-wide text-brand">Assets</p>
          <div className="mt-3 space-y-2">
            {assets.map((item) => (
              <LineItemRow
                key={item.id}
                item={item}
                onChange={(id, field, value) => updateItem(assets, setAssets, id, field, value)}
                onRemove={(id) => removeItem(assets, setAssets, id)}
              />
            ))}
          </div>
          <button
            onClick={() => addItem(setAssets, 'New Asset')}
            className="mt-3 rounded-sm border border-line px-3 py-1.5 font-mono text-xs uppercase tracking-wide text-muted hover:border-brand hover:text-brand"
          >
            + Add asset
          </button>
        </div>

        <div>
          <p className="font-mono text-xs uppercase tracking-wide text-orange">Liabilities</p>
          <div className="mt-3 space-y-2">
            {liabilities.map((item) => (
              <LineItemRow
                key={item.id}
                item={item}
                onChange={(id, field, value) => updateItem(liabilities, setLiabilities, id, field, value)}
                onRemove={(id) => removeItem(liabilities, setLiabilities, id)}
              />
            ))}
          </div>
          <button
            onClick={() => addItem(setLiabilities, 'New Liability')}
            className="mt-3 rounded-sm border border-line px-3 py-1.5 font-mono text-xs uppercase tracking-wide text-muted hover:border-brand hover:text-brand"
          >
            + Add liability
          </button>
        </div>
      </div>

      <div className="mt-8 grid gap-4 sm:grid-cols-3">
        <div className="rounded-sm border border-line bg-ink p-4">
          <p className="font-mono text-xs uppercase tracking-wide text-muted">Total Assets</p>
          <p className="mt-1 text-2xl font-bold text-paper">{formatCurrency(totalAssets)}</p>
        </div>
        <div className="rounded-sm border border-line bg-ink p-4">
          <p className="font-mono text-xs uppercase tracking-wide text-muted">Total Liabilities</p>
          <p className="mt-1 text-2xl font-bold text-paper">{formatCurrency(totalLiabilities)}</p>
        </div>
        <div className="rounded-sm border border-brand/30 bg-brand/10 p-4">
          <p className="font-mono text-xs uppercase tracking-wide text-brand">Net Worth</p>
          <p className="mt-1 text-2xl font-bold text-paper">{formatCurrency(netWorth)}</p>
        </div>
      </div>

      <p className="mt-6 text-xs text-muted">
        Your numbers are saved only in your own browser (not sent anywhere) so you can come back and update them
        over time. Read our full guide on{' '}
        <a href="/blog/what-is-net-worth/" className="text-brand underline">
          what net worth actually measures
        </a>{' '}
        and why it's worth tracking.
      </p>
    </div>
  );
}
