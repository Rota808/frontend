
import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix for Leaflet marker icons
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

// Fix default icon issue in Leaflet
let DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41]
});

L.Marker.prototype.options.icon = DefaultIcon;

interface DeliveryMapProps {
  deliveryAddress: string;
  storeAddress?: string;
}

const DeliveryMap: React.FC<DeliveryMapProps> = ({ 
  deliveryAddress,
  storeAddress = "Rua da Pizza, 123, São Paulo, SP" 
}) => {
  // São Paulo default coordinates
  const storePosition: [number, number] = [-23.5505, -46.6333];
  const deliveryPosition: [number, number] = [-23.5605, -46.6433]; // Slightly offset for demo
  const [distance, setDistance] = useState<number>(0);

  useEffect(() => {
    // Calculate distance between points using Haversine formula
    const calculateDistance = () => {
      const R = 6371; // Radius of earth in km
      const dLat = deg2rad(deliveryPosition[0] - storePosition[0]);
      const dLon = deg2rad(deliveryPosition[1] - storePosition[1]);
      const a = 
        Math.sin(dLat/2) * Math.sin(dLat/2) +
        Math.cos(deg2rad(storePosition[0])) * Math.cos(deg2rad(deliveryPosition[0])) * 
        Math.sin(dLon/2) * Math.sin(dLon/2);
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
      const d = R * c; // Distance in km
      setDistance(parseFloat(d.toFixed(2)));
    };

    const deg2rad = (deg: number) => {
      return deg * (Math.PI/180);
    };

    calculateDistance();
  }, [storePosition, deliveryPosition]);

  return (
    <div className="h-[400px] w-full rounded-lg overflow-hidden">
      <MapContainer 
        center={storePosition} 
        zoom={13} 
        style={{ height: '100%', width: '100%' }}
        scrollWheelZoom={false}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker position={storePosition}>
          <Popup>
            <b>Rota808</b><br />{storeAddress}
          </Popup>
        </Marker>
        <Marker position={deliveryPosition}>
          <Popup>
            <b>Endereço de Entrega</b><br />{deliveryAddress}
          </Popup>
        </Marker>
      </MapContainer>
      <div className="bg-muted mt-2 p-2 rounded text-sm">
        <p className="font-medium">Distância estimada: {distance} km</p>
        <p className="text-xs text-muted-foreground">Tempo estimado: ~{Math.ceil(distance * 5)} minutos</p>
      </div>
    </div>
  );
};

export default DeliveryMap;
