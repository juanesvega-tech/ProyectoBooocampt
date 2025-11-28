// app/api/orders.js
let orders = [
  {
    id: 1,
    cliente: "Juan Pérez",
    origen: { lat: -34.6037, lng: -58.3816 },
    destino: { lat: -34.6090, lng: -58.3840 },
    origenAddress: "C. Florida 100, CABA",
    destinoAddress: "Av. Corrientes 200, CABA",
    estado: "Pendiente",
    repartidor: null
  },
  {
    id: 2,
    cliente: "María López",
    origen: { lat: -34.6070, lng: -58.3820 },
    destino: { lat: -34.6100, lng: -58.3850 },
    origenAddress: "Lavalle 50, CABA",
    destinoAddress: "Tucumán 300, CABA",
    estado: "Pendiente",
    repartidor: null
  },
  {
    id: 3,
    cliente: "Carlos Gómez",
    origen: { lat: -34.6045, lng: -58.3800 },
    destino: { lat: -34.6110, lng: -58.3865 },
    origenAddress: "Alsina 120, CABA",
    destinoAddress: "Pueyrredón 400, CABA",
    estado: "En camino",
    repartidor: "repartidor1"
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
