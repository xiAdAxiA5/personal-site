import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import { socialPlatforms } from '../data/social';

interface FollowerContextValue {
  counts: Record<string, number>;
  loading: boolean;
}

const FollowerContext = createContext<FollowerContextValue>({
  counts: {},
  loading: true,
});

const REFRESH_INTERVAL = 5 * 60 * 1000; // 5 minutes

export function FollowerProvider({ children }: { children: ReactNode }) {
  const [counts, setCounts] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    let timer: ReturnType<typeof setInterval>;

    const refresh = async () => {
      try {
        const res = await fetch('/followers.json', { cache: 'no-cache' });
        if (!res.ok) return;
        const data = await res.json();
        if (cancelled) return;
        const next: Record<string, number> = {};
        for (const p of socialPlatforms) {
          next[p.id] = typeof data[p.id] === 'number' ? data[p.id] : 0;
        }
        setCounts(next);
        setLoading(false);
      } catch {
        // keep previous counts on error
      }
    };

    refresh();
    timer = setInterval(refresh, REFRESH_INTERVAL);

    return () => {
      cancelled = true;
      clearInterval(timer);
    };
  }, []);

  return (
    <FollowerContext.Provider value={{ counts, loading }}>
      {children}
    </FollowerContext.Provider>
  );
}

export function useFollowerContext() {
  return useContext(FollowerContext);
}
