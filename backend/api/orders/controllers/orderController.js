import Order from "../models/Order.js";

export const createOrder = async (req, res) => {
  try {
    const { cliente, destinoAddress, destino } = req.body;

    if (!cliente || !destinoAddress || !destino) {
      return res.status(400).json({ msg: "Faltan campos requeridos" });
    }

    const newOrder = new Order({
      cliente,
      origenAddress: "Pendiente de recoger",
      destinoAddress,
      origen: { lat: -34.6, lng: -58.38 },
      destino,
      estado: "Pendiente",
      repartidor: null
    });

    await newOrder.save();
    res.status(201).json(newOrder);
  } catch (error) {
    console.error("Error en createOrder:", error);
    res.status(500).json({ msg: "Error al crear orden", error: error.message });
  }
};

export const getOrders = async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    console.error("Error en getOrders:", error);
    res.status(500).json({ msg: "Error al obtener órdenes", error: error.message });
  }
};

export const assignOrder = async (req, res) => {
  try {
    const { orderId, repartidor, lugarEntrega } = req.body;

    console.log("Asignando orden:", { orderId, repartidor, lugarEntrega }); // Debug

    if (!orderId || !repartidor || !lugarEntrega) {
      return res.status(400).json({ msg: "Faltan campos requeridos" });
    }

    const updatedOrder = await Order.findByIdAndUpdate(
      orderId,
      { estado: "En camino", repartidor, lugarEntrega },
      { new: true }
    );

    if (!updatedOrder) {
      return res.status(404).json({ msg: "Orden no encontrada" });
    }

    console.log("Orden asignada:", updatedOrder); // Debug
    res.json(updatedOrder);
  } catch (error) {
    console.error("Error en assignOrder:", error);
    res.status(500).json({ msg: "Error al asignar orden", error: error.message });
  }
};

export const updateOrderStatus = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { estado } = req.body;

    if (!estado || !["Pendiente", "En camino", "Entregado"].includes(estado)) {
      return res.status(400).json({ msg: "Estado inválido" });
    }

    const updatedOrder = await Order.findByIdAndUpdate(
      orderId,
      { estado },
      { new: true }
    );

    if (!updatedOrder) {
      return res.status(404).json({ msg: "Orden no encontrada" });
    }

    res.json(updatedOrder);
  } catch (error) {
    console.error("Error en updateOrderStatus:", error);
    res.status(500).json({ msg: "Error al actualizar orden", error: error.message });
  }
};
