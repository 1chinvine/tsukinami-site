export type TsukinamiEventType =
  | 'ライブ'
  | 'イベント'
  | 'チケ発';

export type TsukinamiEventStatus =
  | '予定'
  | '終了'
  | '中止'
  | '延期';

export type TsukinamiReviewStatus =
  | '未確認'
  | '要確認'
  | '確認済み';

export type TsukinamiEvent = {
  id: string;

  title: string;

  date: string;

  venue: string;

  time: string;

  status: TsukinamiEventStatus | string;

  url: string;

  eventType: TsukinamiEventType | string;

  reviewStatus:
    TsukinamiReviewStatus | string;
};

type NotionQueryResponse = {
  results?: Array<{
    id: string;

    properties?: Record<
      string,
      any
    >;
  }>;

  has_more?: boolean;

  next_cursor?: string | null;
};

function getRequiredEnvironmentVariable(
  value: string | undefined,
  name: string,
): string {
  if (!value) {
    throw new Error(
      `${name}が設定されていません。`,
    );
  }

  return value;
}

const token =
  getRequiredEnvironmentVariable(
    import.meta.env.NOTION_TOKEN,
    'NOTION_TOKEN',
  );

const dataSourceId =
  getRequiredEnvironmentVariable(
    import.meta.env
      .NOTION_EVENTS_DATA_SOURCE_ID,
    'NOTION_EVENTS_DATA_SOURCE_ID',
  );

const notionVersion = '2026-03-11';

function readPlainText(
  items:
    | Array<{
        plain_text?: string;
      }>
    | undefined,
): string {
  if (!Array.isArray(items)) {
    return '';
  }

  return items
    .map(
      (item) =>
        item.plain_text ?? '',
    )
    .join('');
}

async function queryEvents(
  startCursor?: string,
): Promise<NotionQueryResponse> {
  const response = await fetch(
    `https://api.notion.com/v1/data_sources/${dataSourceId}/query`,
    {
      method: 'POST',

      headers: {
        Authorization:
          `Bearer ${token}`,

        'Notion-Version':
          notionVersion,

        'Content-Type':
          'application/json',
      },

      body: JSON.stringify({
        page_size: 100,

        /*
         * 公開オンのイベントだけを
         * Webサイトへ取得する。
         */
        filter: {
          property: '公開',

          checkbox: {
            equals: true,
          },
        },

        ...(startCursor
          ? {
              start_cursor:
                startCursor,
            }
          : {}),
      }),
    },
  );

  if (!response.ok) {
    const responseText =
      await response.text();

    throw new Error(
      [
        'Notionのイベント取得に失敗しました。',
        `Status: ${response.status}`,
        responseText,
      ].join('\n'),
    );
  }

  return (
    await response.json()
  ) as NotionQueryResponse;
}

export async function getTsukinamiEvents():
Promise<TsukinamiEvent[]> {
  const results:
    NonNullable<
      NotionQueryResponse['results']
    > = [];

  let startCursor:
    string | undefined;

  do {
    const response:
      NotionQueryResponse =
      await queryEvents(startCursor);

    results.push(
      ...(response.results ?? []),
    );

    startCursor =
      response.has_more
        ? response.next_cursor ??
          undefined
        : undefined;
  } while (startCursor);

  return results
    .map((page) => {
      const properties =
        page.properties ?? {};

      return {
        id: page.id,

        title: readPlainText(
          properties['イベント']
            ?.title,
        ),

        date:
          properties['日付']
            ?.date?.start ?? '',

        venue: readPlainText(
          properties['会場']
            ?.rich_text,
        ),

        time: readPlainText(
          properties['時刻']
            ?.rich_text,
        ),

        status:
          properties['状態']
            ?.select?.name ?? '',

        url:
          properties['公式情報']
            ?.url ?? '',

        eventType:
          properties['種別']
            ?.select?.name ?? '',

        reviewStatus:
          properties['確認状態']
            ?.select?.name ?? '',
      };
    })
    .filter(
      (event) =>
        Boolean(event.title),
    );
}