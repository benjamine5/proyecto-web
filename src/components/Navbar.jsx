import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <nav style={styles.nav}>
      <h1 style={styles.logo}>UlaTickets</h1>

      <div style={styles.links}>
        <Link to="/">Eventos</Link>
        <Link to="/purchases">Mis compras</Link>
      </div>
    </nav>
  );
}

const styles = {
  nav: {
    display: "flex",
    justifyContent: "space-between",
    padding: "10px 20px",
    background: "#202020",
    color: "#fff",
  },
  logo: { margin: 0 },
  links: {
    display: "flex",
    gap: "15px",
    alignItems: "center",
  },
};
