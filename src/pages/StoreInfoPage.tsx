
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { apiService } from '@/services/api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Phone, MapPin, Clock, Info } from 'lucide-react';
import StoreMap from '@/components/StoreMap';

const StoreInfoPage: React.FC = () => {
  const { data: storeInfo, isLoading, error } = useQuery({
    queryKey: ['storeInfo'],
    queryFn: apiService.getStoreInfo,
  });

  const firstStore = storeInfo?.[0];

  return (
    <div className="pizza-container py-8">
      <h1 className="text-3xl font-bold text-center mb-2">Informações da Loja</h1>
      <p className="text-center text-muted-foreground mb-8">Encontre-nos e visite nossa loja</p>

      {isLoading ? (
        <div className="text-center py-8">Carregando informações da loja...</div>
      ) : error ? (
        <div className="text-center py-8 text-destructive">
          Erro ao carregar informações da loja. Por favor, tente novamente mais tarde.
        </div>
      ) : firstStore ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <MapPin className="mr-2 h-5 w-5 text-pizza-primary" />
                  Endereço
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="whitespace-pre-line">{firstStore.address}</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Info className="mr-2 h-5 w-5 text-pizza-primary" />
                  Como Nos Encontrar
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="whitespace-pre-line">{firstStore.directions}</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Phone className="mr-2 h-5 w-5 text-pizza-primary" />
                  Contato
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p>Telefone: {firstStore.contact_phone}</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Clock className="mr-2 h-5 w-5 text-pizza-primary" />
                  Horário de Funcionamento
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Segunda a Sexta</span>
                    <span className="font-medium">11:00 AM - 10:00 PM</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Sábado</span>
                    <span className="font-medium">10:00 AM - 11:00 PM</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Domingo</span>
                    <span className="font-medium">12:00 PM - 9:00 PM</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <StoreMap
            storeAddress={firstStore.address}
            storeLat={40.7128}  // Replace with actual store coordinates
            storeLng={-74.0060} // Replace with actual store coordinates
          />
        </div>
      ) : (
        <div className="text-center py-8">Nenhuma informação da loja disponível.</div>
      )}
    </div>
  );
};

export default StoreInfoPage;
