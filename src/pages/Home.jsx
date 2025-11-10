import { useEffect, useState } from "react";
import { getEvents } from "../api/api";
import EventCard from "../components/EventCard";

export default function Home() {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    getEvents().then(setEvents).catch(console.error);
  }, []);

  return (
    <div className="event-list">
      {events.map(ev => (
        <EventCard key={ev._id} event={ev} />
      ))}
    </div>
  );
}
