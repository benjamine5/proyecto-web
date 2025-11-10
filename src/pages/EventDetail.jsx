import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { getEvents, createReservation } from "../api/api";
import TicketSelector from "../components/TicketSelector";

export default function EventDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [event, setEvent] = useState(null);

  useEffect(() => {
    getEvents()
      .then((data) => {
        const selected = data.find((ev) => ev.id === id);
        setEvent(selected);
      })
      .catch(console.error);
  }, [id]);

  async function handleReservation(ticketType, quantity) {
    try {
      const reservation = await createReservation(id, ticketType, quantity, "user123");
      navigate(`/checkout/${reservation.id}`);
    } catch (err) {
      alert(err.message);
    }
  }

  if (!event) return <p>Cargando...</p>;

  return (
    <div style={styles.container}>
      <img src={event.image} alt={event.name} style={styles.image} />

      <h2>{event.name}</h2>
      <p>{event.category}</p>
      <p>{event.date}</p>
      <p>{event.location}</p>

      <h3>Tickets disponibles</h3>

      <TicketSelector ticketTypes={event.tickets} onSelect={handleReservation} />
    </div>
  );
}

const styles = {
  container: { padding: "20px", maxWidth: "900px", margin: "0 auto" },
  image: { width: "100%", borderRadius: "10px", marginBottom: "20px" },
};
