import { Link } from "react-router-dom";

function EventCard({ event }) {
  return (
    <Link to={`/event/${event._id}`}>
    <div className="flex flex-col gap-1 bg-gray-800 rounded border-2 border-gray-900 shadow-lg overflow-hidden transform transition-transform hover:scale-105 hover:shadow-2xl">
      <img
        src={event.image}
        alt={event.name}
        className="w-full h-48 object-cover"
      />
      <div className="p-4 flex flex-col justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-white mb-2">{event.name}</h2>
          <p className="text-xl text-gray-200 text-sm mb-1">- Ubicación: {event.location}</p>
          <p className="text-xl text-gray-200 text-sm mb-1">
            - Fecha: {new Date(event.date).toLocaleString()}
          </p>
          <p className="text-xl text-gray-200 text-sm">- Categoría: {event.category}</p>
        </div>
      </div>
    </div>
    </Link>
  );
}

export default EventCard;
