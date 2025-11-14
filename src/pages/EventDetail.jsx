import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getEvents, createReservation } from "../api/api";
import { Link } from "react-router-dom";

export default function EventDetail() {
  const { id } = useParams();
  const nav = useNavigate();

  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [qtyByType, setQtyByType] = useState({});

  useEffect(() => {
    async function fetchEvent() {
      try {
        const response = await getEvents();
        const list = Array.isArray(response)
          ? response
          : response?.data || [];

        const found = list.find((ev) => {
          const ids = [
            ev._id,
            ev._id?.$oid,
            ev._id?.toString?.(),
            ev.id,
            ev.uuid,
            ev.event_id,
          ];
          return ids.map(String).includes(String(id));
        });

        if (!found) throw new Error("Evento no encontrado");

        setEvent(found);

        const init = {};
        (found.tickets || []).forEach((t) => (init[t.type] = 0));
        setQtyByType(init);

      } catch (err) {
        console.error("Error al cargar evento:", err);
        setError(err.message || "No se pudo cargar el evento.");
      } finally {
        setLoading(false);
      }
    }

    fetchEvent();
  }, [id]);

  const setQty = (type, next) => {
    const ticket = event.tickets.find((t) => t.type === type);
    const max = Math.min(110, ticket.available ?? 0);
    const val = Math.max(0, Math.min(max, Number(next) || 0));
    setQtyByType((prev) => ({ ...prev, [type]: val }));
  };

  const inc = (type) => setQty(type, (qtyByType[type] || 0) + 1);
  const dec = (type) => setQty(type, (qtyByType[type] || 0) - 1);

  const totalCLP = useMemo(() => {
    if (!event?.tickets) return 0;
    return event.tickets.reduce(
      (acc, t) => acc + (qtyByType[t.type] || 0) * (t.price || 0),
      0
    );
  }, [qtyByType, event]);

  const totalItems = useMemo(
    () => Object.values(qtyByType).reduce((a, b) => a + (b || 0), 0),
    [qtyByType]
  );

  // 🚀 RESERVAR
  const reservar = async () => {
    const items = Object.entries(qtyByType)
      .filter(([, q]) => q > 0)
      .map(([type, quantity]) => ({ type, quantity }));

    if (items.length === 0) {
      alert("Selecciona al menos 1 entrada.");
      return;
    }

    try {
      // 👉 nueva forma correcta: createReservation(eventId, items)
      const res = await createReservation(event._id, items);

      const reservationId =
        res?.reservation_id ||
        res?.id ||
        res?._id ||
        Object.values(res)[0];

      nav(`/checkout/${reservationId}`);
    } catch (e) {
      alert(e.message || "No se pudo crear la reserva");
    }
  };

  if (loading)
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin w-10 h-10 rounded-full border-4 border-blue-500 border-t-transparent"></div>
      </div>
    );

  if (error)
    return (
      <div className="fixed inset-0 flex justify-center items-center">
        <div className="bg-red-100 dark:bg-red-900 border-l-4 border-red-500 px-4 py-3 rounded-lg text-red-700 dark:text-red-100 shadow-lg">
          {error}
        </div>
      </div>
    );

  return (
    <div className="flex flex-row gap-16 justify-center items-center min-h-screen bg-white dark:bg-gray-800 p-6">

      {/* IZQUIERDA */}
      <div className="border-2 border-gray-600 rounded dark:bg-gray-900 p-8 max-w-xl">
        <img
          src={
            event.image ||
            "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800"
          }
          alt={event.name}
          className="w-full rounded mb-6"
        />

        <h1 className="text-3xl font-bold dark:text-gray-200">
          {event.name}
        </h1>

        <div className="mt-4 dark:text-gray-200">
          <p><b>Categoría:</b> {event.category || "Sin categoría"}</p>
          <p>
            <b>Fecha:</b>{" "}
            {new Date(event.date).toLocaleString("es-CL")}
          </p>
          <p><b>Lugar:</b> {event.location}</p>
          {event.description && <p className="mt-4">{event.description}</p>}
        </div>
      </div>

      {/* DERECHA */}
      <div className="border-2 border-gray-600 rounded dark:bg-gray-900 p-8 w-[380px]">
        <h2 className="font-bold text-3xl dark:text-gray-200 mb-6">
          Seleccione sus tickets:
        </h2>

        <div className="divide-y divide-gray-600">
          {event.tickets.map((t) => {
            const q = qtyByType[t.type] || 0;
            const max = Math.min(110, t.available);

            return (
              <div key={t.type} className="py-6 dark:text-gray-200">
                <p className="font-semibold text-lg">{t.type}</p>
                <p className="mb-3">
                  ${t.price.toLocaleString()} — Disponibles: {t.available}
                </p>

                {/* Selector cantidad */}
                <div className="relative flex items-center gap-2 scale-110">
                  <button
                    type="button"
                    onClick={() => dec(t.type)}
                    disabled={q <= 0}
                    className="bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 h-8 w-8 rounded flex justify-center items-center"
                  >
                    −
                  </button>

                  <input
                    type="text"
                    className="w-10 text-center bg-transparent border-0 text-lg dark:text-white"
                    value={q}
                    onChange={(e) =>
                      setQty(t.type, parseInt(e.target.value || "0", 10))
                    }
                  />

                  <button
                    type="button"
                    onClick={() => inc(t.type)}
                    disabled={q >= max}
                    className="bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 h-8 w-8 rounded flex justify-center items-center"
                  >
                    +
                  </button>
                </div>
              </div>
            );
          })}

          {/* TOTAL */}
          <div className="pt-6 dark:text-gray-200">
            <p className="text-xl font-semibold">
              Total: ${totalCLP.toLocaleString("es-CL")}
            </p>

            <button
              onClick={reservar}
              disabled={totalItems === 0}
              className="mt-4 w-full bg-sky-500 hover:bg-sky-600 disabled:bg-gray-600 text-white font-medium py-2 px-4 rounded-lg transition"
            >
              Reservar
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}
