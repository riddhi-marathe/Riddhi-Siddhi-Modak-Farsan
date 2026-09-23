import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents, useMap } from 'react-leaflet';
import L from 'leaflet';
import './MapTracker.css';

// Fix Leaflet default icon issue
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

const shopIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-red.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

const deliveryIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-green.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

function LocationMarker({ position, setPosition, shopLocation }) {
  useMapEvents({
    click(e) {
      setPosition(e.latlng);
    },
  });

  return position === null ? null : (
    <Marker position={position} icon={deliveryIcon}>
      <Popup>
        📍 Your delivery location
      </Popup>
    </Marker>
  );
}

function ShopMarker({ shopLocation }) {
  return (
    <Marker position={shopLocation} icon={shopIcon}>
      <Popup>
        <strong>🏪 Riddhi Siddhi Modak Farsan</strong><br/>
        165/2A, Saket Nagar, Bhopal
      </Popup>
    </Marker>
  );
}

function MapView({ center, zoom }) {
  const map = useMap();
  useEffect(() => {
    if (center) {
      map.setView(center, zoom || 14);
    }
  }, [center, zoom, map]);
  return null;
}

function MapTracker({ onLocationChange, shopLocation }) {
  const defaultCenter = shopLocation || [23.2321, 77.4300];
  const [position, setPosition] = useState(null);

  const handleSetPosition = (latlng) => {
    setPosition(latlng);
    if (onLocationChange) {
      onLocationChange(latlng.lat, latlng.lng);
    }
  };

  return (
    <div className="map-tracker">
      <div className="map-instructions">
        <span className="map-instruction-icon">📍</span>
        Click on the map to set your delivery location
      </div>
      <div className="map-container">
        <MapContainer
          center={defaultCenter}
          zoom={14}
          className="leaflet-map"
          scrollWheelZoom={true}
        >
          <MapView center={defaultCenter} zoom={14} />
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <ShopMarker shopLocation={defaultCenter} />
          <LocationMarker
            position={position}
            setPosition={handleSetPosition}
            shopLocation={defaultCenter}
          />
          {position && (
            <Marker position={position} icon={deliveryIcon}>
              <Popup>📦 Delivery Location</Popup>
            </Marker>
          )}
        </MapContainer>
      </div>
      <div className="map-legend">
        <div className="legend-item">
          <span className="legend-dot shop-dot"></span>
          <span>Shop Location</span>
        </div>
        <div className="legend-item">
          <span className="legend-dot delivery-dot"></span>
          <span>Your Delivery Location</span>
        </div>
      </div>
    </div>
  );
}

export default MapTracker;

