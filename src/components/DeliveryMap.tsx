
import React from 'react';
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
    </div>
  );
};

export default DeliveryMap;
