import { useEffect, useState } from "react";
import { getPurchases } from "../api/api";
import PurchaseItem from "../components/PurchaseItem";

export default function Purchases() {
  const [purchases, setPurchases] = useState([]);

  useEffect(() => {
    getPurchases("user123")
      .then(setPurchases)
      .catch(console.error);
  }, []);

  return (
    <div style={styles.container}>
      <h2>Mis Compras</h2>

      {purchases.length === 0 ? (
        <p>No tienes compras registradas.</p>
      ) : (
        purchases.map((p) => <PurchaseItem key={p.id} purchase={p} />)
      )}
    </div>
  );
}

const styles = {
  container: { padding: "20px", maxWidth: "700px", margin: "0 auto" },
};
