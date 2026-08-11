export type TsukinamiNews = {
  title: string;
  date: string;
  url: string;
};

const NEWS_URL =
  'https://tsukinami.bitfan.id/contents/menu/183878';

export async function getTsukinamiNews(): Promise<TsukinamiNews[]> {
  const response = await fetch(NEWS_URL);

  if (!response.ok) {
    throw new Error(`Bitfan NEWS fetch failed: ${response.status}`);
  }

  const html = await response.text();

  /*
    BitfanのNEWS記事リンクを取得
    href="/contents/xxxxx"
    の形式を拾う
  */
  const linkPattern =
    /<a[^>]+href="([^"]*\/contents\/\d+[^"]*)"[^>]*>([\s\S]*?)<\/a>/g;

  const news: TsukinamiNews[] = [];

  let match;

  while ((match = linkPattern.exec(html)) !== null) {
    const href = match[1];

    const rawText = match[2]
      .replace(/<[^>]*>/g, '')
      .replace(/&amp;/g, '&')
      .replace(/&quot;/g, '"')
      .replace(/&#39;/g, "'")
      .replace(/\s+/g, ' ')
      .trim();

    /*
      末尾の日付
      2026/08/11 09:58
      を取得
    */
    const dateMatch = rawText.match(
      /(\d{4}\/\d{2}\/\d{2})\s+\d{2}:\d{2}$/
    );

    if (!dateMatch) continue;

    const date = dateMatch[1];

    const title = rawText
      .replace(/\s*\d{4}\/\d{2}\/\d{2}\s+\d{2}:\d{2}$/, '')
      .replace(/\s*NEW\s*$/, '')
      .trim();

    const url = href.startsWith('http')
      ? href
      : `https://tsukinami.bitfan.id${href}`;

    news.push({
      title,
      date,
      url,
    });
  }

  /*
    同じ記事を重複取得した場合に除外
  */
  const uniqueNews = Array.from(
    new Map(
      news.map((item) => [
        item.url,
        item,
      ])
    ).values()
  );

  return uniqueNews;
}