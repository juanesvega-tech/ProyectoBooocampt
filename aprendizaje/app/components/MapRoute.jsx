"use client";
import { useEffect, useRef, useState } from "react";

export default function MapRoute({ origen, destino }) {
  const mapRef = useRef(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!origen || !destino) return;

    // Añadir CSS de Leaflet si no existe
    if (!document.querySelector('link[href*="leaflet.css"]')) {
      const link = document.createElement("link");
      link.rel = "stylesheet";
      link.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css";
      document.head.appendChild(link);
    }

    // Cargar Leaflet dinámicamente
    let L;
    let map;
    let routeLayer;

    import("leaflet")
      .then((leaflet) => {
        L = leaflet.default || leaflet;

        // Limpiar el contenedor si ya tiene un mapa
        if (mapRef.current && mapRef.current._leaflet_id) {
          mapRef.current._leaflet_id = null;
          mapRef.current.innerHTML = "";
        }

        // Inicializar mapa
        map = L.map(mapRef.current).setView([origen.lat, origen.lng], 14);

        L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
          maxZoom: 19,
          attribution:
            '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        }).addTo(map);

        // Marcadores de origen/destino
        L.marker([origen.lat, origen.lng]).addTo(map).bindPopup("Origen").openPopup();
        L.marker([destino.lat, destino.lng]).addTo(map).bindPopup("Destino");

        // Pedir ruta a OSRM (server público)
        const coords = `${origen.lng},${origen.lat};${destino.lng},${destino.lat}`;
        const url = `https://router.project-osrm.org/route/v1/driving/${coords}?overview=full&geometries=geojson`;

        fetch(url)
          .then((res) => res.json())
          .then((data) => {
            if (data.code !== "Ok" || !data.routes || !data.routes.length) {
              setError("No se pudo obtener la ruta desde OSRM.");
              return;
            }
            const route = data.routes[0].geometry;
            routeLayer = L.geoJSON(route, {
              style: { color: "#007bff", weight: 4, opacity: 0.8 },
            }).addTo(map);

            // Ajustar vista al bounds de la ruta
            const bounds = routeLayer.getBounds();
            map.fitBounds(bounds, { padding: [50, 50] });
          })
          .catch((err) => {
            console.error(err);
            setError("Error obteniendo la ruta (OSRM).");
          });
      })
      .catch((err) => {
        console.error("Error cargando Leaflet:", err);
        setError("Error cargando biblioteca de mapas.");
      });

    return () => {
      if (map) map.remove();
    };
  }, [origen, destino]);

  if (error) return <div className="text-sm text-red-500">Error mapa: {error}</div>;

  return <div ref={mapRef} style={{ height: "300px", width: "100%" }} />;
}
