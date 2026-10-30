"use client";

import { useEffect } from "react";
import L from "leaflet";
import {
  MapContainer,
  Marker,
  Polyline,
  Popup,
  TileLayer,
  useMap,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";

const markerIcon = (color, label) =>
  L.divIcon({
    className: "",
    html: `<div style="width:28px;height:28px;border-radius:9999px;border:2px solid #2D241E;background:${color};color:#fff;display:flex;align-items:center;justify-content:center;font-family:Poppins,sans-serif;font-size:11px;font-weight:900;box-shadow:2px 2px 0 #2D241E;">${label}</div>`,
    iconSize: [28, 28],
    iconAnchor: [14, 14],
  });

const PICKUP_ICON = markerIcon("#0C831F", "P");
const DELIVERY_ICON = markerIcon("#AE2012", "D");
const RIDER_ICON = markerIcon("#E9C46A", "R");

function FitBounds({ points }) {
  const map = useMap();

  useEffect(() => {
    if (!points.length) return;
    if (points.length === 1) {
      map.setView(points[0], 15);
      return;
    }
    map.fitBounds(points, { padding: [36, 36], maxZoom: 16 });
  }, [map, points]);

  return null;
}

export default function TripMap({ trip }) {
  const pickup =
    trip.pickup?.lat != null && trip.pickup?.lng != null
      ? [trip.pickup.lat, trip.pickup.lng]
      : null;
  const delivery =
    trip.delivery?.lat != null && trip.delivery?.lng != null
      ? [trip.delivery.lat, trip.delivery.lng]
      : null;
  const current =
    trip.current?.lat != null && trip.current?.lng != null
      ? [trip.current.lat, trip.current.lng]
      : null;

  const route = (trip.routePath ?? [])
    .filter((point) => point?.lat != null && point?.lng != null)
    .map((point) => [point.lat, point.lng]);

  const line =
    route.length > 1
      ? route
      : [pickup, delivery].filter(Boolean);

  const points = [pickup, delivery, current, ...route].filter(Boolean);
  const center = current ?? pickup ?? delivery ?? [26.8467, 80.9462];

  return (
    <div className="overflow-hidden rounded-2xl border-2 border-secondary-200">
      <MapContainer
        center={center}
        zoom={14}
        scrollWheelZoom={false}
        style={{ height: 250, width: "100%" }}
        className="z-0"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {line.length > 1 && (
          <Polyline
            positions={line}
            pathOptions={{ color: "#AE2012", weight: 4, opacity: 0.85 }}
          />
        )}

        {pickup && (
          <Marker position={pickup} icon={PICKUP_ICON}>
            <Popup>
              <strong>Pickup</strong>
              <br />
              {trip.pickup?.address || "Pickup location"}
            </Popup>
          </Marker>
        )}

        {delivery && (
          <Marker position={delivery} icon={DELIVERY_ICON}>
            <Popup>
              <strong>Delivery</strong>
              <br />
              {trip.delivery?.address || "Delivery location"}
            </Popup>
          </Marker>
        )}

        {current && (
          <Marker position={current} icon={RIDER_ICON}>
            <Popup>
              <strong>Rider</strong>
              <br />
              {trip.current?.updatedAt
                ? `Updated ${new Date(trip.current.updatedAt).toLocaleTimeString("en-IN", {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}`
                : "Live location"}
            </Popup>
          </Marker>
        )}

        <FitBounds points={points} />
      </MapContainer>
    </div>
  );
}
