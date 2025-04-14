
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
  const [token, setToken] = React.useState<string>('');
  const [showTokenInput, setShowTokenInput] = React.useState<boolean>(true);

  useEffect(() => {
    if (!mapContainer.current || !token || !deliveryAddress) return;

    mapboxgl.accessToken = token;

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
  }, [deliveryAddress, token, storeAddress]);

  const handleTokenSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setShowTokenInput(false);
  };

  if (showTokenInput) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Configuração do Mapa</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleTokenSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium">
                Digite seu token de acesso do Mapbox para exibir o mapa:
              </label>
              <input
                type="text"
                value={token}
                onChange={(e) => setToken(e.target.value)}
                className="w-full p-2 mt-1 border rounded"
                placeholder="pk.eyJ1IjoieW91cnVzZXJuYW1lIiwiYSI6..."
              />
              <p className="text-xs text-muted-foreground mt-1">
                Obtenha seu token gratuito em{" "}
                <a
                  href="https://mapbox.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline"
                >
                  mapbox.com
                </a>
              </p>
            </div>
            <button
              type="submit"
              className="bg-pizza-primary text-white py-2 px-4 rounded"
            >
              Carregar Mapa
            </button>
          </form>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="h-[400px] w-full rounded-lg overflow-hidden">
      <div ref={mapContainer} className="h-full w-full" />
    </div>
  );
};

export default DeliveryMap;
