interface SteamGame {
  appid: number;
  name: string;
  playtime_minutes: number;
  playtime_hours: number;
  icon_url: string;
}

let cache: { data: SteamGame[]; timestamp: number } | null = null;
const CACHE_TTL = 60 * 60 * 1000; // 1 hour

async function getGameNames(appids: number[]): Promise<Record<number, string>> {
  const names: Record<number, string> = {};
  const batchSize = 30;
  for (let i = 0; i < appids.length; i += batchSize) {
    const batch = appids.slice(i, i + batchSize).join(',');
    try {
      const res = await fetch(
        `https://store.steampowered.com/api/appdetails?appids=${batch}&filters=basic`
      );
      if (!res.ok) continue;
      const data: any = await res.json();
      for (const [id, info] of Object.entries(data)) {
        if ((info as any)?.data?.name) {
          names[Number(id)] = (info as any).data.name;
        }
      }
    } catch {
      /* skip failed batch */
    }
  }
  return names;
}

export default async function handler(request: Request): Promise<Response> {
  const env = (globalThis as any).process?.env ?? {};
  const steamKey: string = env.STEAM_API_KEY;
  const steamId: string = env.STEAM_ID;

  if (!steamKey || !steamId) {
    return Response.json(
      { error: 'Steam API key or Steam ID not configured' },
      { status: 500 }
    );
  }

  if (cache && Date.now() - cache.timestamp < CACHE_TTL) {
    return Response.json(cache.data, {
      headers: { 'X-Cache': 'HIT', 'Cache-Control': `public, max-age=${CACHE_TTL / 1000}` },
    });
  }

  try {
    const ownedRes = await fetch(
      `https://api.steampowered.com/IPlayerService/GetOwnedGames/v1/?key=${steamKey}&steamid=${steamId}&include_played_free_games=true&format=json`
    );
    if (!ownedRes.ok) {
      return Response.json({ error: `Steam API returned ${ownedRes.status}` }, { status: 502 });
    }
    const owned: any = await ownedRes.json();
    const games = (owned.response?.games || []) as {
      appid: number;
      playtime_forever: number;
    }[];

    games.sort((a, b) => b.playtime_forever - a.playtime_forever);
    const played = games.filter((g) => g.playtime_forever > 0).slice(0, 50);
    const gameNames = await getGameNames(played.map((g) => g.appid));

    const result: SteamGame[] = played.map((g) => ({
      appid: g.appid,
      name: gameNames[g.appid] || `App ${g.appid}`,
      playtime_minutes: g.playtime_forever,
      playtime_hours: Math.round((g.playtime_forever / 60) * 10) / 10,
      icon_url: `https://cdn.cloudflare.steamstatic.com/steam/apps/${g.appid}/header.jpg`,
    }));

    cache = { data: result, timestamp: Date.now() };
    return Response.json(result, {
      headers: { 'X-Cache': 'MISS', 'Cache-Control': `public, max-age=${CACHE_TTL / 1000}` },
    });
  } catch (err: any) {
    return Response.json({ error: err.message || 'Failed to fetch Steam data' }, { status: 500 });
  }
}
