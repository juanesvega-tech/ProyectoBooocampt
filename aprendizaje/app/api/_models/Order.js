import mongoose from "mongoose";

const OrderSchema = new mongoose.Schema({
  cliente: { type: String, required: true },
  origenAddress: { type: String, default: "Pendiente de recoger" },
  destinoAddress: { type: String, required: true },
  origen: {
    lat: { type: Number, default: -34.6 },
    lng: { type: Number, default: -58.38 }
  },
  destino: {
    lat: { type: Number, required: true },
    lng: { type: Number, required: true }
  },
  estado: { type: String, enum: ["Pendiente", "En camino", "Entregado"], default: "Pendiente" },
  repartidor: { type: String, default: null },
  lugarEntrega: { type: String, default: null },
}, { timestamps: true });

export default mongoose.models.Order || mongoose.model("Order", OrderSchema);
