
import React, { useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface DeliveryMapProps {
  deliveryAddress: string;
  storeAddress?: string;
}

const DeliveryMap: React.FC<DeliveryMapProps> = ({ 
  deliveryAddress,
  storeAddress = "Rua da Pizza, 123, São Paulo, SP" 
}) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  
  // Replace this with your actual Mapbox token
  const mapboxToken = 'pk.eyJ1IjoiZXhhbXBsZXRva2VuIiwiYSI6ImNreHh4eHh4eDAweHgydXFxcXFxcXFxcXEifQ.example';

  useEffect(() => {
    if (!mapContainer.current || !deliveryAddress) return;

    mapboxgl.accessToken = mapboxToken;

    // Initialize map
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/streets-v11',
      zoom: 12,
      center: [-46.6333, -23.5505], // São Paulo coordinates
    });

    // Add markers for store and delivery address
    new mapboxgl.Marker({ color: '#ef4444' })
      .setLngLat([-46.6333, -23.5505])
      .setPopup(new mapboxgl.Popup().setHTML(`<h3>Rota808</h3><p>${storeAddress}</p>`))
      .addTo(map.current);

    // In a real app, we would geocode the delivery address
    new mapboxgl.Marker({ color: '#22c55e' })
      .setLngLat([-46.6433, -23.5605])
      .setPopup(new mapboxgl.Popup().setHTML(`<h3>Endereço de Entrega</h3><p>${deliveryAddress}</p>`))
      .addTo(map.current);

    // Add navigation controls
    map.current.addControl(new mapboxgl.NavigationControl(), 'top-right');

    return () => {
      map.current?.remove();
    };
  }, [deliveryAddress, storeAddress, mapboxToken]);

  return (
    <div className="h-[400px] w-full rounded-lg overflow-hidden">
      <div ref={mapContainer} className="h-full w-full" />
    </div>
  );
};

export default DeliveryMap;
