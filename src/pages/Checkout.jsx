import { useParams, useNavigate } from "react-router-dom";
import { confirmCheckout } from "../api/api";
import { useState } from "react";

export default function Checkout() {
  const { reservationId } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);

  async function handleConfirm() {
    setLoading(true);
    try {
      const result = await confirmCheckout(reservationId, "user123");
      alert("Compra confirmada");
      navigate("/purchases");
    } catch (err) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={styles.container}>
      <h2>Confirmar compra</h2>
      <p>Reserva: {reservationId}</p>

      <button style={styles.button} onClick={handleConfirm} disabled={loading}>
        {loading ? "Procesando..." : "Confirmar compra"}
      </button>
    </div>
  );
}

const styles = {
  container: { padding: "20px" },
  button: {
    background: "#008800",
    padding: "10px 20px",
    color: "white",
    borderRadius: "10px",
    cursor: "pointer",
  },
};
