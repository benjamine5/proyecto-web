import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export default function Checkout() {
  const navigate = useNavigate();
  const { reservationId } = useParams();

  const [reservation, setReservation] = useState(null);
  const [items, setItems] = useState([]);
  const [total, setTotal] = useState(0);

  const [timeLeft, setTimeLeft] = useState(0);

  const [buyer, setBuyer] = useState({
    name: "",
    email: ""
  });


  useEffect(() => {
    async function fetchReservation() {
      try {
        const res = await fetch(`${API_BASE_URL}/reservations/${reservationId}`);
        if (!res.ok) throw new Error("No se pudo obtener la reserva");
        const data = await res.json();

        setReservation(data);
        setItems(data.items || []);
        setTotal(data.total_price || 0);

        const expires = new Date(data.expires_at).getTime();
        const now = Date.now();
        const diff = Math.floor((expires - now) / 1000);

        const MAX_TIME = 300;
        setTimeLeft(diff > 0 ? Math.min(diff, MAX_TIME) : 0);

      } catch (err) {
        alert("Reserva inválida o vencida.");
        navigate("/");
      }
    }

    fetchReservation();
  }, [reservationId]);

  // Temporizador 
  useEffect(() => {
    if (timeLeft <= 0) return;

    const interval = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(interval);
          alert("El tiempo expiró. Volviendo a eventos.");
          navigate("/");
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [timeLeft]);


  async function completePurchase() {
  try {
    const payload = {
      reservation_id: reservationId,
      buyer: {
        name: buyer.name,
        email: buyer.email,
      },
    };

    console.log("ENVIANDO A /checkout:", payload);

    const res = await fetch(`${API_BASE_URL}/checkout`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const data = await res.json();
    console.log("RESPUESTA:", data);

    if (!res.ok) {
      alert("Datos enviados:", JSON.stringify(payload, null, 2));
      throw new Error("Error al completar compra");
    }

    navigate(`/purchases/${data._id}`);

  } catch (err) {
    console.error(err);
    alert("Hubo un problema al completar la compra.");
  }
}




  const formatTime = (sec) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  if (!reservation)
    return <p className="text-center mt-20 text-gray-300">Cargando reserva...</p>;

  return (
    <div className="min-h-screen dark:bg-gray-950 dark:text-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold text-center mb-10">Completar Compra</h1>

      <p className="text-center mb-8 text-lg">
        Tiempo restante:{" "}
        <span
          className={timeLeft <= 60 ? "text-red-400 font-bold" : "text-yellow-300"}
        >
          {formatTime(timeLeft)}
        </span>
      </p>

      <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">

        {/* Datos comprador */}
        <div className="border-2 border-gray-600 dark:bg-gray-900 rounded-lg shadow-lg p-6 space-y-6">
          <div>
            <h2 className="text-lg font-semibold mb-3">Información del comprador</h2>

            <input
              type="text"
              placeholder="Nombre completo"
              className="w-full px-3 py-2 rounded-md dark:bg-gray-800 border border-gray-700"
              value={buyer.name}
              onChange={(e) => setBuyer({ ...buyer, name: e.target.value })}
            />

            <input
              type="email"
              placeholder="Email"
              className="mt-3 w-full px-3 py-2 rounded-md dark:bg-gray-800 border border-gray-700"
              value={buyer.email}
              onChange={(e) => setBuyer({ ...buyer, email: e.target.value })}
            />
          </div>

          <button
            onClick={completePurchase}
            className="w-full py-3 bg-sky-500 hover:bg-sky-600 text-white font-semibold rounded-md"
          >
            Completar Compra
          </button>
        </div>

        {/* Resumen compra */}
        <div className="border-2 border-gray-600 dark:bg-gray-900 rounded-lg shadow-lg p-6 space-y-4">
          <h2 className="text-lg font-semibold">Resumen de compra</h2>

          {items.map((item, idx) => (
            <div key={idx} className="border-t pt-3 dark:border-gray-700">
              <p className="font-medium dark:text-gray-300">{item.type}</p>
              <p className="dark:text-gray-400 text-sm">
                {item.quantity}x {item.type}
              </p>
            </div>
          ))}

          <div className="border-t pt-4 flex justify-between items-center dark:border-gray-700">
            <p className="font-semibold">Total</p>
            <p className="text-xl font-bold">
              ${total.toLocaleString("es-CL")}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
