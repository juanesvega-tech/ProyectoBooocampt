"use client";
import { useEffect, useRef, useState } from "react";

export default function MapRoute({ origen, destino }) {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!origen || !destino) return;
    if (typeof window === "undefined") return;

    const oLat = Number(origen.lat);
    const oLng = Number(origen.lng);
    const dLat = Number(destino.lat);
    const dLng = Number(destino.lng);
    if (!isFinite(oLat) || !isFinite(oLng) || !isFinite(dLat) || !isFinite(dLng)) {
      setError("Coordenadas inválidas para dibujar el mapa.");
      return;
    }

    // Añadir CSS de Leaflet si no existe
    const container = mapRef.current;
    const doc = (container && container.ownerDocument) ? container.ownerDocument : (typeof document !== "undefined" ? document : null);
    if (doc && doc.head && !doc.querySelector('link[href*="leaflet.css"]')) {
      const link = doc.createElement("link");
      link.rel = "stylesheet";
      link.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css";
      try { doc.head.appendChild(link); } catch {}
    }

    // Cargar Leaflet dinámicamente
    let L;
    let routeLayer;
    let cancelled = false;

    import("leaflet")
      .then((leaflet) => {
        L = leaflet.default || leaflet;

        if (!container) return;
        if (!container.isConnected) return;

        // Limpiar mapa previo si existe
        if (mapInstanceRef.current) {
          try { mapInstanceRef.current.remove(); } catch {}
          mapInstanceRef.current = null;
        }

        // Inicializar mapa
        const map = L.map(container).setView([oLat, oLng], 14);
        mapInstanceRef.current = map;

        L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
          maxZoom: 19,
          attribution:
            '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        }).addTo(map);

        // Marcadores de origen/destino
        try {
          L.marker([oLat, oLng]).addTo(map).bindPopup("Origen").openPopup();
          L.marker([dLat, dLng]).addTo(map).bindPopup("Destino");
        } catch {}

        // Pedir ruta a OSRM (server público)
        const coords = `${oLng},${oLat};${dLng},${dLat}`;
        const url = `https://router.project-osrm.org/route/v1/driving/${coords}?overview=full&geometries=geojson`;

        fetch(url)
          .then((res) => res.json())
          .then((data) => {
            if (cancelled || !mapInstanceRef.current || !container.isConnected) return;
            if (data.code !== "Ok" || !data.routes || !data.routes.length) {
              // Fallback: línea recta entre puntos
              const fallback = L.polyline(
                [
                  [oLat, oLng],
                  [dLat, dLng],
                ],
                { color: "#007bff", weight: 4, opacity: 0.8, dashArray: "6,6" }
              ).addTo(map);
              const bounds = fallback.getBounds();
              map.fitBounds(bounds, { padding: [50, 50] });
              setError(null);
              return;
            }
            const route = data.routes[0].geometry;
            try {
              routeLayer = L.geoJSON(route, {
                style: { color: "#007bff", weight: 4, opacity: 0.8 },
              }).addTo(map);
            } catch (e) {
              // Si falla, usar fallback
              const fallback = L.polyline(
                [
                  [oLat, oLng],
                  [dLat, dLng],
                ],
                { color: "#007bff", weight: 4, opacity: 0.8, dashArray: "6,6" }
              ).addTo(map);
              const bounds = fallback.getBounds();
              map.fitBounds(bounds, { padding: [50, 50] });
              setError(null);
              return;
            }

            // Ajustar vista al bounds de la ruta
            const bounds = routeLayer.getBounds();
            map.fitBounds(bounds, { padding: [50, 50] });
          })
          .catch((err) => {
            console.error(err);
            if (cancelled || !mapInstanceRef.current || !container.isConnected) return;
            // Fallback: línea recta entre puntos
            const fallback = L.polyline(
              [
                [oLat, oLng],
                [dLat, dLng],
              ],
              { color: "#007bff", weight: 4, opacity: 0.8, dashArray: "6,6" }
            ).addTo(map);
            const bounds = fallback.getBounds();
            map.fitBounds(bounds, { padding: [50, 50] });
            setError(null);
          });
      })
      .catch((err) => {
        console.error("Error cargando Leaflet:", err);
        setError("Error cargando biblioteca de mapas.");
      });

    return () => {
      cancelled = true;
      if (mapInstanceRef.current) {
        try { mapInstanceRef.current.remove(); } catch {}
        mapInstanceRef.current = null;
      }
    };
  }, [origen, destino]);

  if (error) return <div className="text-sm text-red-500">Error mapa: {error}</div>;

  return <div ref={mapRef} style={{ height: "300px", width: "100%" }} />;
}
