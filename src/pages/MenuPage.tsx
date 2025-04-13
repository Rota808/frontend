
import React, { useState, useEffect } from 'react';
import { apiService, Pizza, Size, PizzaPrice, Beverage } from '@/services/api';
import PizzaCard from '@/components/PizzaCard';
import BeverageCard from '@/components/BeverageCard';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Skeleton } from '@/components/ui/skeleton';

const MenuPage: React.FC = () => {
  const [pizzas, setPizzas] = useState<Pizza[]>([]);
  const [sizes, setSizes] = useState<Size[]>([]);
  const [pizzaPrices, setPizzaPrices] = useState<PizzaPrice[]>([]);
  const [beverages, setBeverages] = useState<Beverage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        const [pizzasData, sizesData, pizzaPricesData, beveragesData] = await Promise.all([
          apiService.getPizzas(),
          apiService.getSizes(),
          apiService.getPizzaPrices(),
          apiService.getBeverages(),
        ]);
        
        setPizzas(pizzasData);
        setSizes(sizesData);
        setPizzaPrices(pizzaPricesData);
        setBeverages(beveragesData);
      } catch (err) {
        setError('Falha ao carregar dados do menu. Por favor, tente novamente mais tarde.');
        console.error('Erro ao buscar dados do menu:', err);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, []);

  // Loading skeletons for pizzas and beverages
  const PizzaSkeletons = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {[...Array(6)].map((_, index) => (
        <div key={index} className="flex flex-col space-y-3">
          <Skeleton className="h-48 w-full rounded-md" />
          <Skeleton className="h-6 w-3/4 rounded-md" />
          <Skeleton className="h-4 w-full rounded-md" />
          <Skeleton className="h-10 w-full rounded-md" />
        </div>
      ))}
    </div>
  );

  return (
    <div className="pizza-container py-8">
      <h1 className="text-3xl font-bold text-center mb-8">Nosso Cardápio</h1>
      
      {error ? (
        <div className="text-center text-destructive p-4 mb-8">
          {error}
        </div>
      ) : (
        <Tabs defaultValue="pizzas" className="w-full">
          <TabsList className="grid w-full max-w-md mx-auto grid-cols-2 mb-8">
            <TabsTrigger value="pizzas">Pizzas</TabsTrigger>
            <TabsTrigger value="beverages">Bebidas</TabsTrigger>
          </TabsList>
          
          <TabsContent value="pizzas">
            <div className="mb-8">
              <h2 className="text-2xl font-semibold mb-6">Nossas Pizzas Deliciosas</h2>
              
              {isLoading ? (
                <PizzaSkeletons />
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {pizzas.map((pizza) => (
                    <PizzaCard
                      key={pizza.id}
                      pizza={pizza}
                      sizes={sizes}
                      pizzaPrices={pizzaPrices}
                    />
                  ))}
                </div>
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="beverages">
            <div className="mb-8">
              <h2 className="text-2xl font-semibold mb-6">Bebidas Refrescantes</h2>
              
              {isLoading ? (
                <PizzaSkeletons />
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {beverages.map((beverage) => (
                    <BeverageCard
                      key={beverage.id}
                      beverage={beverage}
                    />
                  ))}
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
};

export default MenuPage;
