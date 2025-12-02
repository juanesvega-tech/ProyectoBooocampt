"use client";
import { useState } from "react";
import { Truck, MapPin, User } from "lucide-react";

export default function AssignForm({ order, onSubmit }) {
  const [repartidor, setRepartidor] = useState("");
  const [lugarEntrega, setLugarEntrega] = useState("");

  function handleSubmit(e) {
    e.preventDefault();
    onSubmit(repartidor, lugarEntrega);
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

      {/* Repartidor */}
      <div>
        <label className="flex items-center gap-2 text-gray-700 dark:text-gray-300 mb-1">
          <Truck className="w-4 h-4" /> Repartidor asignado
        </label>
        <input
          type="text"
          placeholder="Ej: Juan Pérez"
          required
          value={repartidor}
          onChange={(e) => setRepartidor(e.target.value)}
          className="w-full p-2.5 border border-gray-300 dark:border-gray-600 
                     bg-white dark:bg-gray-800 rounded-lg
                     text-gray-900 dark:text-white"
        />
      </div>

      {/* Lugar de entrega */}
      <div>
        <label className="flex items-center gap-2 text-gray-700 dark:text-gray-300 mb-1">
          <MapPin className="w-4 h-4" /> Lugar de entrega
        </label>
        <input
          type="text"
          placeholder="Ej: Calle 123, Zona Centro"
          required
          value={lugarEntrega}
          onChange={(e) => setLugarEntrega(e.target.value)}
          className="w-full p-2.5 border border-gray-300 dark:border-gray-600 
                     bg-white dark:bg-gray-800 rounded-lg
                     text-gray-900 dark:text-white"
        />
      </div>

      {/* Botón */}
      <button
        type="submit"
        className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 
                   text-white rounded-lg shadow transition-all"
      >
        Confirmar asignación
      </button>
    </form>
  );
}
