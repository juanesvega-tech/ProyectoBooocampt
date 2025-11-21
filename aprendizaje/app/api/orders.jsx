// app/api/orders.js
let orders = [
  {
    id: 1,
    cliente: "Juan Pérez",
    origen: { lat: -34.6037, lng: -58.3816 },
    destino: { lat: -34.6090, lng: -58.3840 },
    estado: "Pendiente",
    repartidor: null
  },
  {
    id: 2,
    cliente: "María López",
    origen: { lat: -34.6070, lng: -58.3820 },
    destino: { lat: -34.6100, lng: -58.3850 },
    estado: "Pendiente",
    repartidor: null
  }
];

export function getOrders() {
  return orders;
}

export function assignOrder(orderId, repartidor) {
  orders = orders.map(o =>
    o.id === orderId ? { ...o, estado: "En camino", repartidor } : o
  );
  return orders.find(o => o.id === orderId);
}
