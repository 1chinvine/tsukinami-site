export type EventType = 'LIVE' | 'EVENT';

export type EventMeta = {
  type?: EventType;

  /*
    Notion上のタイトルとは別に
    サイト上で表示したいタイトルがある場合に使用
  */
  displayTitle?: string;

  ticketStart?: string;
  ticketUrl?: string;
};

export const eventMeta: Record<string, EventMeta> = {
  '2026-08-15|POP GALAXY2026': {
    type: 'LIVE',
    ticketStart: '2026-07-25T20:00:00+09:00',
    ticketUrl: 'https://ticketdive.com/event/popgalaxy0815',
  },

  '2026-08-16|POP GALAXY2026': {
    type: 'LIVE',
    ticketStart: '2026-07-25T20:00:00+09:00',
    ticketUrl: 'https://ticketdive.com/event/popgalaxy0816',
  },

  /*
    Notion側：
    ツキナミ観測室⭐︎人物図鑑編 part1

    サイト表示：
    ツキナミ観測室⭐人物図鑑編 part1
  */
  '2026-08-17|ツキナミ観測室⭐︎人物図鑑編 part1': {
    type: 'EVENT',
    displayTitle: 'ツキナミ観測室⭐人物図鑑編 part1',
    ticketStart: '2026-07-26T22:00:00+09:00',
    ticketUrl: 'https://tiget.net/events/509243',
  },

  '2026-08-20|BEEEEM FES Vol.8 -New Generation-': {
    type: 'LIVE',
    ticketStart: '2026-08-15T20:00:00+09:00',
    ticketUrl: 'https://l-tike.com/search/?lcd=70893',
  },

  '2026-08-23|POLAROID - SPECIAL -': {
    type: 'LIVE',
    ticketStart: '2026-08-12T21:00:00+09:00',
    ticketUrl: 'https://ticketdive.com/event/260823_POLAROID_SP',
  },

  '2026-08-27|ツキナミ観測室⭐人物図鑑編 part2': {
    type: 'EVENT',
    displayTitle: 'ツキナミ観測室⭐人物図鑑編 part2',
    ticketStart: '2026-07-27T22:00:00+09:00',
    ticketUrl: 'https://tiget.net/events/509441',
  },

  '2026-08-31|THE VENUS?? 女神祝祭式 2026（鍔木心花 生誕祭）': {
    type: 'EVENT',
  },

  '2026-09-10|BEEEEM FES Vol.9': {
    type: 'LIVE',
    displayTitle: 'BEEEEM FES Vol.9',
    ticketStart: '2026-08-15T20:00:00+09:00',
    ticketUrl: 'https://t.pia.jp/pia/ticketInformation.do?eventCd=2631890&rlsCd=&lotRlsCd=26591',
  },

  '2026-09-15|BEEEEM FES Vol.10 -New Generation-': {
    type: 'LIVE',
    ticketStart: '2026-08-12T20:00:00+09:00',
    ticketUrl: 'https://t.pia.jp/pia/ticketInformation.do?eventCd=2631212&rlsCd=&lotRlsCd=21192',
  },
};

/*
  Notionのイベント情報から
  eventMeta.tsに登録した追加情報を取得する

  キー：
  YYYY-MM-DD|Notion上のイベント名
*/
export const getEventMeta = (
  date: string,
  title: string
): EventMeta => {
  const key = `${date}|${title}`;

  return eventMeta[key] ?? {};
};