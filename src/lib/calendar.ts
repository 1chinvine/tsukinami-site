import type { TsukinamiEvent } from './notion';

export function createGoogleCalendarUrl(event: TsukinamiEvent) {
  if (!event.date) return '';

  // Google Calendarの終日予定では、
  // 終了日は「翌日」を指定する
  const startDate = event.date.replaceAll('-', '');

  const nextDay = new Date(`${event.date}T00:00:00`);
  nextDay.setDate(nextDay.getDate() + 1);

  const endDate = [
    nextDay.getFullYear(),
    String(nextDay.getMonth() + 1).padStart(2, '0'),
    String(nextDay.getDate()).padStart(2, '0'),
  ].join('');

  const details = [
    event.time ? `時刻：${event.time}` : '',
    event.url ? `公式情報：${event.url}` : '',
  ]
    .filter(Boolean)
    .join('\n');

  const params = new URLSearchParams({
    action: 'TEMPLATE',
    text: event.title,
    dates: `${startDate}/${endDate}`,
    details,
    location: event.venue,
  });

  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}