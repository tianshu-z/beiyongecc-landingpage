import { calendarEvents, type CalendarEvent } from "@/shared/calendar";

const storageKey = "ecc-calendar-managed-events";
const legacyStorageKey = "ecc-calendar-local-events";

function parseEvents(value: string | null): CalendarEvent[] {
  if (!value) return [];
  const parsed = JSON.parse(value);
  return Array.isArray(parsed) ? parsed : [];
}

export function readManagedEvents(): CalendarEvent[] {
  if (typeof window === "undefined") return [];

  try {
    const managedValue = window.localStorage.getItem(storageKey);
    if (managedValue !== null) return parseEvents(managedValue);

    const localEvents = parseEvents(window.localStorage.getItem(legacyStorageKey));
    const localIds = new Set(localEvents.map((event) => event.id));
    return [
      ...calendarEvents.filter((event) => !localIds.has(event.id)),
      ...localEvents,
    ];
  } catch {
    return calendarEvents;
  }
}

function writeManagedEvents(events: CalendarEvent[]) {
  window.localStorage.setItem(storageKey, JSON.stringify(events));
}

export function addManagedEvent(event: CalendarEvent) {
  writeManagedEvents([...readManagedEvents(), event]);
}

export function updateManagedEvent(event: CalendarEvent) {
  writeManagedEvents(
    readManagedEvents().map((item) => (item.id === event.id ? event : item)),
  );
}

export function removeManagedEvent(id: string) {
  writeManagedEvents(readManagedEvents().filter((event) => event.id !== id));
}
