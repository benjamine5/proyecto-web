import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export default function Purchases() {
  const { id } = useParams(); // ID de compra
  const [purchase, setPurchase] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadPurchase() {
      try {
        const res = await fetch(`${API_BASE_URL}/reservations/${id}/purchase`);
        if (!res.ok) throw new Error("Compra no encontrada");
        const data = await res.json();
        setPurchase(data);
      } catch (err) {
        setPurchase(null);
      } finally {
        setLoading(false);
      }
    }

    if (id) loadPurchase();
  }, [id]);

  if (loading)
    return <p className="text-center text-gray-300 mt-20">Cargando compra...</p>;

  if (!purchase)
    return (
      <div className="text-center mt-20 dark:text-gray-400">
        <h2 className="text-xl font-bold mb-4">Compra no encontrada</h2>
        <Link to="/" className="text-sky-400 underline">Volver a eventos</Link>
      </div>
    );

  return (
    <div className="min-h-screen dark:bg-gray-950 dark:text-gray-100">
      <div className="max-w-5xl mx-auto px-4 py-10">
        <h1 className="text-3xl font-bold mb-8">Detalle de Compra</h1>

        <div className="dark:bg-gray-900 border border-gray-800 rounded-xl p-6 space-y-4">
          <h2 className="text-2xl font-semibold">{purchase.event_name}</h2>

          <p className="text-sm dark:text-gray-300">
            Fecha del evento: {format(purchase.event_date)}
          </p>

          <p className="text-sm dark:text-gray-300">
            Ubicación: {purchase.location}
          </p>

          <div className="pt-4 border-t dark:border-gray-700">
            <p className="font-semibold">Tickets:</p>
            <ul className="dark:text-gray-300 text-sm mt-2">
              {purchase.items.map((it, idx) => (
                <li key={idx}>
                  {it.quantity}× {it.type}
                </li>
              ))}
            </ul>
          </div>

          <div className="border-t pt-4 flex justify-between dark:border-gray-700">
            <p className="font-semibold">Total</p>
            <p className="text-xl font-bold">${purchase.total_price}</p>
          </div>

          <p className="text-sm dark:text-gray-500">
            Comprado el {format(purchase.purchased_at)}
          </p>

          <Link
            to="/"
            className="inline-block mt-4 bg-sky-500 hover:bg-sky-600 text-white px-4 py-2 rounded-lg"
          >
            Volver a eventos
          </Link>
        </div>
      </div>
    </div>
  );
}

function format(dateStr) {
  try {
    return new Date(dateStr).toLocaleDateString("es-CL", {
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  } catch {
    return dateStr;
  }
}
