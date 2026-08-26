import { useEffect, useMemo, useState } from 'react';

interface SearchItem {
  slug: string;
  title: string;
  description: string;
  category: string;
  tags: string[];
}

interface Props {
  onNavigate?: () => void;
}

export default function SearchBar({ onNavigate }: Props) {
  const [items, setItems] = useState<SearchItem[]>([]);
  const [query, setQuery] = useState('');

  useEffect(() => {
    fetch('/search-index.json')
      .then((res) => res.json())
      .then(setItems)
      .catch(() => setItems([]));
  }, []);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];

    return items
      .map((item) => {
        const haystack = [item.title, item.description, item.category, ...item.tags].join(' ').toLowerCase();
        const titleMatch = item.title.toLowerCase().includes(q);
        if (!haystack.includes(q)) return null;
        return { item, score: titleMatch ? 2 : 1 };
      })
      .filter((r): r is { item: SearchItem; score: number } => r !== null)
      .sort((a, b) => b.score - a.score)
      .slice(0, 8)
      .map((r) => r.item);
  }, [items, query]);

  return (
    <div>
      <input
        type="search"
        autoFocus
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search articles…"
        className="w-full rounded-sm border border-line bg-ink px-4 py-3 text-paper placeholder:text-muted focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand"
      />

      {query.trim() !== '' && (
        <div className="mt-3 max-h-80 overflow-y-auto">
          {results.length === 0 ? (
            <p className="px-1 py-4 text-sm text-muted">No articles match "{query}".</p>
          ) : (
            <ul className="space-y-1">
              {results.map((item) => (
                <li key={item.slug}>
                  <a
                    href={`/blog/${item.slug}/`}
                    onClick={onNavigate}
                    className="corner-card block rounded-sm bg-surface p-3 transition hover:bg-surface-2"
                  >
                    <p className="font-mono text-xs uppercase tracking-wide text-brand">{item.category}</p>
                    <p className="mt-1 text-sm font-semibold text-paper">{item.title}</p>
                  </a>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
