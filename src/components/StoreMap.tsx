
import React from "react";
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

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

interface StoreMapProps {
  storeAddress: string;
  storeLat?: number;
  storeLng?: number;
}

const StoreMap: React.FC<StoreMapProps> = ({
  storeAddress,
  storeLat = -23.5505, // Default para São Paulo
  storeLng = -46.6333,
}) => {
  const position: [number, number] = [storeLat, storeLng];

  return (
    <Card className="overflow-hidden">
      <CardHeader>
        <CardTitle>Localização da Loja</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="h-[400px] w-full">
          <MapContainer 
            center={position} 
            zoom={14} 
            style={{ height: '100%', width: '100%' }}
            scrollWheelZoom={false}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <Marker position={position}>
              <Popup>
                <b>Rota808 Pizza</b><br />{storeAddress}
              </Popup>
            </Marker>
          </MapContainer>
        </div>
        <div className="p-4">
          <p className="font-medium">Rota808 Pizza</p>
          <p className="text-muted-foreground">{storeAddress}</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default StoreMap;
