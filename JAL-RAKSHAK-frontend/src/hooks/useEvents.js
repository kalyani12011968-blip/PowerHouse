import { useEffect, useState } from "react";
import { USE_MOCK_DATA } from "../services/api";
import { eventApi } from "../services/eventApi";
import { mockEvents } from "../services/mockData";

export function useEvents() {
  const [events, setEvents] = useState(mockEvents);
  useEffect(() => {
    if (USE_MOCK_DATA) return;
    eventApi.getAll().then(r => setEvents(r?.data || r)).catch(() => {});
  }, []);
  return { events, setEvents };
}
