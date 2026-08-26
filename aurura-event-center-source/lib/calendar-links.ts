import { venue } from "./config";

function toGCalDate(date: Date): string {
  return date.toISOString().replace(/[-:]/g, "").split(".")[0] + "Z";
}

export function buildGoogleCalendarUrl(opts: {
  title: string;
  description: string;
  location?: string;
  start: Date;
  end: Date;
}) {
  const params = new URLSearchParams({
    action: "TEMPLATE",
    text: opts.title,
    details: opts.description,
    location: opts.location ?? `${venue.address.line1}, ${venue.address.city}, ${venue.address.state} ${venue.address.zip}`,
    dates: `${toGCalDate(opts.start)}/${toGCalDate(opts.end)}`,
  });
  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}

export function buildIcsDataUrl(opts: { title: string; description: string; location?: string; start: Date; end: Date }) {
  const ics = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Aurura Event Center//Tour Scheduler//EN",
    "BEGIN:VEVENT",
    `UID:${Date.now()}@aururaeventcenter.com`,
    `DTSTAMP:${toGCalDate(new Date())}`,
    `DTSTART:${toGCalDate(opts.start)}`,
    `DTEND:${toGCalDate(opts.end)}`,
    `SUMMARY:${opts.title}`,
    `DESCRIPTION:${opts.description.replace(/\n/g, "\\n")}`,
    `LOCATION:${opts.location ?? venue.address.line1}`,
    "END:VEVENT",
    "END:VCALENDAR",
  ].join("\r\n");
  return "data:text/calendar;charset=utf8," + encodeURIComponent(ics);
}

export function parseTourDateTime(dateISO: string, timeLabel: string): { start: Date; end: Date } {
  // timeLabel like "10:00 AM"
  const match = timeLabel.match(/(\d+):(\d+)\s?(AM|PM)/i);
  let hours = 9;
  let minutes = 0;
  if (match) {
    hours = parseInt(match[1], 10);
    minutes = parseInt(match[2], 10);
    const meridiem = match[3].toUpperCase();
    if (meridiem === "PM" && hours !== 12) hours += 12;
    if (meridiem === "AM" && hours === 12) hours = 0;
  }
  const start = new Date(dateISO + "T00:00:00");
  start.setHours(hours, minutes, 0, 0);
  const end = new Date(start.getTime() + venue.tourDurationMinutes * 60000);
  return { start, end };
}
