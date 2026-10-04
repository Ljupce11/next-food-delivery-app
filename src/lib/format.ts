const numberFormat = new Intl.NumberFormat("en-US", {
  maximumFractionDigits: 2,
});

const dateTimeFormat = new Intl.DateTimeFormat("en-US", {
  day: "numeric",
  month: "short",
  year: "numeric",
  hour: "2-digit",
  minute: "2-digit",
  hourCycle: "h23",
  timeZone: "Europe/Stockholm",
});

export function formatNumber(value: number | string) {
  return numberFormat.format(Number(value));
}

export function formatPrice(value: number | string) {
  return `${formatNumber(value)}kr`;
}

export function formatDateTime(value: string | Date) {
  const parts = Object.fromEntries(
    dateTimeFormat
      .formatToParts(new Date(value))
      .map(({ type, value }) => [type, value]),
  );
  return `${parts.day} ${parts.month} ${parts.year} ${parts.hour}:${parts.minute}`;
}
