export type TsukinamiEvent = {
  title: string;
  date: string;
  venue: string;
  time: string;
  status: string;
  url: string;
};

const token = import.meta.env.NOTION_TOKEN;

async function getTsukinamiDataSourceId() {
  const response = await fetch('https://api.notion.com/v1/search', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Notion-Version': '2026-03-11',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      query: 'Tsukinami Events',
    }),
  });

  if (!response.ok) {
    throw new Error(`Notion search failed: ${response.status}`);
  }

  const data = await response.json();

  const dataSource = data.results?.find(
    (item: any) => item.object === 'data_source'
  );

  if (!dataSource) {
    throw new Error('Tsukinami Events data source not found');
  }

  return dataSource.id;
}

export async function getTsukinamiEvents(): Promise<TsukinamiEvent[]> {
  const dataSourceId = await getTsukinamiDataSourceId();

  const response = await fetch(
    `https://api.notion.com/v1/data_sources/${dataSourceId}/query`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Notion-Version': '2026-03-11',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        page_size: 100,
      }),
    }
  );

  if (!response.ok) {
    throw new Error(`Notion query failed: ${response.status}`);
  }

  const data = await response.json();

  const events: TsukinamiEvent[] = (data.results ?? []).map((event: any) => {
    const props = event.properties;

    return {
      title: props['イベント']?.title?.[0]?.plain_text ?? '',
      date: props['日付']?.date?.start ?? '',
      venue: props['会場']?.rich_text?.[0]?.plain_text ?? '',
      time: props['時刻']?.rich_text?.[0]?.plain_text ?? '',
      status: props['状態']?.select?.name ?? '',
      url: props['公式情報']?.url ?? '',
    };
  });

  return events;
}