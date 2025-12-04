"use client";
import { useState, useEffect } from "react";
import { Truck, MapPin, User } from "lucide-react";

export default function AssignForm({ order, onSubmit }) {
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:4000";
  const [repartidor, setRepartidor] = useState(order.repartidor || "");
  const [origenAddress, setOrigenAddress] = useState(order.origenAddress || "");
  const [repartidores, setRepartidores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchRepartidores();
  }, []);

  async function fetchRepartidores() {
    try {
      const response = await fetch(`${API_BASE_URL}/api/users/repartidores`);
      if (!response.ok) throw new Error("Error al obtener repartidores");
      const data = await response.json();
      setRepartidores(data);
      setError(null);
    } catch (err) {
      console.error("Error fetching repartidores:", err);
      setError("No se pudieron cargar los repartidores");
    } finally {
      setLoading(false);
    }
  }

  function handleSubmit(e) {
    e.preventDefault();
    onSubmit(repartidor, origenAddress);
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">

      {/* Cliente */}
      <div>
        <label className="flex items-center gap-2 text-gray-700 dark:text-gray-300 mb-1">
          <User className="w-4 h-4" /> Cliente
        </label>
        <input
          disabled
          value={order.cliente}
          className="w-full p-2.5 bg-gray-100 dark:bg-gray-700 rounded-lg text-gray-600 dark:text-gray-300"
        />
      </div>

      {/* Repartidor - Select */}
      <div>
        <label className="flex items-center gap-2 text-gray-700 dark:text-gray-300 mb-1">
          <Truck className="w-4 h-4" /> Repartidor asignado
        </label>
        {loading ? (
          <div className="w-full p-2.5 bg-gray-100 dark:bg-gray-700 rounded-lg text-gray-600 dark:text-gray-300">
            Cargando repartidores...
          </div>
        ) : error ? (
          <div className="w-full p-2.5 bg-red-100 dark:bg-red-900/30 rounded-lg text-red-600 dark:text-red-400">
            {error}
          </div>
        ) : (
          <select
            required
            value={repartidor}
            onChange={(e) => setRepartidor(e.target.value)}
            className="w-full p-2.5 border border-gray-300 dark:border-gray-600 
                       bg-white dark:bg-gray-800 rounded-lg
                       text-gray-900 dark:text-white
                       focus:ring-2 focus:ring-indigo-500 focus:border-transparent
                       transition-all"
          >
            <option value="">-- Selecciona un repartidor --</option>
            {repartidores.map((rep) => (
              <option key={rep._id} value={rep.name}>
                {rep.name}
              </option>
            ))}
          </select>
        )}
      </div>

      {/* Dirección de origen */}
      <div>
        <label className="flex items-center gap-2 text-gray-700 dark:text-gray-300 mb-1">
          <MapPin className="w-4 h-4" /> Dirección de origen
        </label>
        <input
          type="text"
          value={origenAddress}
          onChange={(e) => setOrigenAddress(e.target.value)}
          placeholder="Calle 123 #45-67, Ciudad, Colombia"
          className="w-full p-2.5 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 rounded-lg text-gray-900 dark:text-white"
        />
      </div>

      {/* Botón */}
      <button
        type="submit"
        disabled={loading || !repartidor}
        className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-400
                   text-white rounded-lg shadow transition-all"
      >
        Confirmar asignación
      </button>
    </form>
  );
}
