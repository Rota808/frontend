
import React, { useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

// This would be ideally stored in a Supabase Edge Function Secret
// For now, we're using a temporary input mechanism
const MAPBOX_TOKEN = 'pk.eyJ1Ijoicm90YTgwOCIsImEiOiJja3NhbXBsZXRva2VuMTIzNCJ9.abcdefghijklmnopqrstuvwxyz';

interface StoreMapProps {
  storeAddress: string;
  storeLat?: number;
  storeLng?: number;
}

const StoreMap: React.FC<StoreMapProps> = ({ 
  storeAddress,
  storeLat = 40.7128, // Default to NYC coordinates
  storeLng = -74.0060
}) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [token, setToken] = React.useState<string>(MAPBOX_TOKEN);
  const [showTokenInput, setShowTokenInput] = React.useState<boolean>(!MAPBOX_TOKEN);

  useEffect(() => {
    if (!mapContainer.current || !token) return;

    mapboxgl.accessToken = token;
    
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/streets-v11',
      center: [storeLng, storeLat],
      zoom: 14
    });

    // Add marker for store location
    const marker = new mapboxgl.Marker()
      .setLngLat([storeLng, storeLat])
      .setPopup(new mapboxgl.Popup().setHTML(`<h3>Rota808 Pizza</h3><p>${storeAddress}</p>`))
      .addTo(map.current);

    // Add navigation controls
    map.current.addControl(new mapboxgl.NavigationControl(), 'top-right');

    return () => {
      if (map.current) {
        map.current.remove();
      }
    };
  }, [token, storeAddress, storeLat, storeLng]);

  const handleTokenSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setShowTokenInput(false);
  };

  if (showTokenInput) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Map Setup</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleTokenSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium">
                Enter your Mapbox Access Token to display the store map:
              </label>
              <input
                type="text"
                value={token}
                onChange={(e) => setToken(e.target.value)}
                className="w-full p-2 mt-1 border rounded"
                placeholder="pk.eyJ1IjoieW91cnVzZXJuYW1lIiwiYSI6ImNrZXkiOiJoZXJlIn0.123456789"
              />
              <p className="text-xs text-muted-foreground mt-1">
                Get your free token at <a href="https://mapbox.com/" target="_blank" rel="noopener noreferrer" className="underline">mapbox.com</a>
              </p>
            </div>
            <button 
              type="submit" 
              className="bg-pizza-primary text-white py-2 px-4 rounded"
            >
              Load Map
            </button>
          </form>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="overflow-hidden">
      <CardHeader>
        <CardTitle>Store Location</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div ref={mapContainer} className="h-[400px] w-full" />
        <div className="p-4">
          <p className="font-medium">Rota808 Pizza</p>
          <p className="text-muted-foreground">{storeAddress}</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default StoreMap;
