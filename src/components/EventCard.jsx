export default function EventCard({ event }) {
  return (
    <div className="event-card">
      <img
        src={event.image}
        alt={event.name}
        style={{ width: "100%", borderRadius: "8px" }}
      />

      <h3>{event.name}</h3>

      <p><strong>Categoría:</strong> {event.category}</p>
      <p><strong>Fecha:</strong> {new Date(event.date).toLocaleString()}</p>
      <p><strong>Ubicación:</strong> {event.location}</p>

      <a href={`/event/${event._id}`} className="btn">
        Ver Detalles
      </a>
    </div>
  );
}
