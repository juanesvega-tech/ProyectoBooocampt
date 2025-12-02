"use client";
import React from "react";
import { Clock, Truck, CheckCircle, Package } from "lucide-react";

export function getStatusColor(status) {
  switch (status) {
    case "Pendiente":
      return "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-900/20 dark:text-amber-400 dark:border-amber-800";
    case "En camino":
      return "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-800";
    case "Entregado":
      return "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-900/20 dark:text-emerald-400 dark:border-emerald-800";
    default:
      return "bg-gray-50 text-gray-700 border-gray-200 dark:bg-gray-900/20 dark:text-gray-400 dark:border-gray-800";
  }
}

export function getStatusIcon(status) {
  switch (status) {
    case "Pendiente":
      return <Clock className="w-4 h-4" />;
    case "En camino":
      return <Truck className="w-4 h-4" />;
    case "Entregado":
      return <CheckCircle className="w-4 h-4" />;
    default:
      return <Package className="w-4 h-4" />;
  }
}

export default function StatusBadge({ status }) {
  const base = "inline-flex items-center gap-1.5 px-3 py-1.5 border rounded-lg transition-colors";
  const color = getStatusColor(status);
  const icon = getStatusIcon(status);

  return (
    <span className={`${base} ${color}`}>
      {icon}
      <span>{status}</span>
    </span>
  );
}
