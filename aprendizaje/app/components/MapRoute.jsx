"use client";
import { useEffect, useRef } from "react";

export default function MapRoute({ origen, destino }) {
  const mapRef = useRef(null);

  useEffect(() => {
    if (!window.google) return;

    const map = new window.google.maps.Map(mapRef.current, {
      center: origen,
      zoom: 14
    });

    const directionsService = new window.google.maps.DirectionsService();
    const directionsRenderer = new window.google.maps.DirectionsRenderer();
    directionsRenderer.setMap(map);

    directionsService.route(
      {
        origin: origen,
        destination: destino,
        travelMode: window.google.maps.TravelMode.DRIVING
      },
      (result, status) => {
        if (status === "OK") directionsRenderer.setDirections(result);
        else console.error("Error mostrando ruta:", status);
      }
    );
  }, [origen, destino]);

  return <div ref={mapRef} style={{ height: "300px", width: "100%" }} />;
}
