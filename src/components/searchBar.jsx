import { useState, useEffect } from "react";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL

const SearchBar = ({ onSearch }) => {
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [query, setQuery] = useState("");

  useEffect(() => {
    async function loadCategories() {
      try {
        console.log("API_BASE_URL =", API_BASE_URL);
        const res = await fetch(`${API_BASE_URL}/events`);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);

        const json = await res.json();
        const list = Array.isArray(json.data) ? json.data : [];

        // Extraemos las categorías únicas y las normalizamos
        const unique = [
          ...new Set(
            list
              .map((e) => e.category?.trim().toLowerCase())
              .filter(Boolean)
          ),
        ];

        setCategories(unique);
      } catch (err) {
        console.error("Error al obtener categorías:", err);
        setCategories([]); // fallback vacío
      }
    }

    loadCategories();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (onSearch) onSearch({ category: selectedCategory, query });
  };

  return (
    <form className="w-170 flex justify-center mt-6" onSubmit={handleSearch}>
      <div className="flex w-full max-w-6xl shadow rounded overflow-hidden border">
        {/* Dropdown de categorías */}
        <select
          className="appearance-none bg:transparent p-2 border-r outline-none w-44"
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
        >
          <option className="p-1" value="">Todas las categorías</option>
          {categories.map((cat) => (
            <option key={cat} value={cat}>
              {cat.charAt(0).toUpperCase() + cat.slice(1)}
            </option>
          ))}
        </select>

        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="flex-1 min-w-0 p-2 outline-none"
          placeholder="Buscar nombre del evento..."
        />

        <button
          type="submit"
          className="bg-blue-600 text-white px-4 hover:bg-blue-700 transition"
        >
          Buscar
        </button>
      </div>
    </form>
  );
};

export default SearchBar;
