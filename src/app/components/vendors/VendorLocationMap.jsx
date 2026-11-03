"use client";

import { useEffect } from "react";
import L from "leaflet";
import {
  MapContainer,
  Marker,
  Popup,
  TileLayer,
  useMap,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";

const PIN_ICON = L.divIcon({
  className: "",
  html: `<div style="width:30px;height:30px;border-radius:9999px;border:2px solid #2D241E;background:#AE2012;color:#fff;display:flex;align-items:center;justify-content:center;font-family:Poppins,sans-serif;font-size:12px;font-weight:900;box-shadow:2px 2px 0 #2D241E;">S</div>`,
  iconSize: [30, 30],
  iconAnchor: [15, 15],
});

function Recenter({ position }) {
  const map = useMap();

  useEffect(() => {
    map.setView(position, 16);
  }, [map, position]);

  return null;
}

export default function VendorLocationMap({ lat, lng, label }) {
  const position = [lat, lng];

  return (
    <div className="overflow-hidden rounded-2xl border-2 border-secondary-200">
      <MapContainer
        center={position}
        zoom={16}
        scrollWheelZoom={false}
        style={{ height: 200, width: "100%" }}
        className="z-0"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker position={position} icon={PIN_ICON}>
          <Popup>{label || "Store location"}</Popup>
        </Marker>
        <Recenter position={position} />
      </MapContainer>
    </div>
  );
}
