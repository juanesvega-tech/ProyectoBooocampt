// app/api/orders.js
let orders = [];

export function getOrders() {
  return orders;
}

export function assignOrder(orderId, repartidor, lugarEntrega) {
  orders = orders.map(o =>
    o.id === orderId ? { ...o, estado: "En camino", repartidor, lugarEntrega } : o
  );
  return orders.find(o => o.id === orderId);
}

export function createOrder(cliente, origenAddress, destinoAddress, origen, destino) {
  const newId = orders.length > 0 ? Math.max(...orders.map(o => o.id)) + 1 : 1;
  
  const newOrder = {
    id: newId,
    cliente,
    origen,
    destino,
    origenAddress,
    destinoAddress,
    estado: "Pendiente",
    repartidor: null
  };

  orders.push(newOrder);
  return newOrder;
}
