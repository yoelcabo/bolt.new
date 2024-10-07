import { isAfter, isThisWeek, isThisYear, isToday, isYesterday, subDays } from 'date-fns';
import type { ChatHistoryItem } from '~/lib/persistence';
import i18n from '~/i18n';

type Bin = { category: string; items: ChatHistoryItem[] };

export function binDates(_list: ChatHistoryItem[]) {
  const list = _list.toSorted((a, b) => Date.parse(b.timestamp) - Date.parse(a.timestamp));
  const locale = i18n.language;

  const binLookup: Record<string, Bin> = {};
  const bins: Array<Bin> = [];

  list.forEach((item) => {
    const category = dateCategory(new Date(item.timestamp), locale);

    if (!(category in binLookup)) {
      const bin = {
        category,
        items: [item],
      };

      binLookup[category] = bin;

      bins.push(bin);
    } else {
      binLookup[category].items.push(item);
    }
  });

  return bins;
}

function dateCategory(date: Date, locale: string) {
  const now = new Date();
  const formatter = new Intl.DateTimeFormat(locale, { weekday: 'long', month: 'long', year: 'numeric' });

  if (isToday(date)) {
    return capitalize(new Intl.RelativeTimeFormat(locale, { numeric: 'auto' }).format(0, 'day'));
  }

  if (isYesterday(date)) {
    return capitalize(new Intl.RelativeTimeFormat(locale, { numeric: 'auto' }).format(-1, 'day'));
  }

  if (isThisWeek(date)) {
    return capitalize(formatter.format(date).split(',')[0]); // Get only the weekday and capitalize
  }

  const thirtyDaysAgo = subDays(now, 30);

  if (isAfter(date, thirtyDaysAgo)) {
    return capitalize(new Intl.RelativeTimeFormat(locale, { numeric: 'auto' }).format(-30, 'day'));
  }

  if (isThisYear(date)) {
    return capitalize(new Intl.DateTimeFormat(locale, { month: 'long' }).format(date));
  }

  return capitalize(formatter.format(date));
}

// Helper function to capitalize the first letter of a string
function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}
