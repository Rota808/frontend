import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { apiService, Order } from '@/services/api';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { toast } from "@/components/ui/sonner";
import { 
  CheckCircle2, 
  Clock, 
  TruckIcon, 
  XCircle,
  SearchIcon,
  Pizza,
  Coffee,
  Map
} from 'lucide-react';
import DeliveryMap from '@/components/DeliveryMap';

const OrderTrackingPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [orderIdInput, setOrderIdInput] = useState<string>(searchParams.get('orderId') || '');
  const [order, setOrder] = useState<Order | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showMap, setShowMap] = useState(false);
  
  const [userOrders, setUserOrders] = useState<Order[]>([]);
  
  useEffect(() => {
    const localOrders = apiService.getUserOrders();
    setUserOrders(localOrders);
    
    const orderId = searchParams.get('orderId');
    if (orderId) {
      fetchOrder(orderId);
    } else if (localOrders.length > 0) {
      const mostRecentOrder = localOrders[localOrders.length - 1];
      setOrderIdInput(String(mostRecentOrder.id));
      fetchOrder(String(mostRecentOrder.id));
    }
  }, [searchParams]);

  const fetchOrder = async (id: string) => {
    if (!id) {
      setError('Por favor, digite um número de pedido');
      return;
    }
    
    try {
      setIsLoading(true);
      setError(null);
      
      const orderData = await apiService.getOrder(parseInt(id));
      setOrder(orderData);
      
      setSearchParams({ orderId: id });
      
    } catch (err) {
      console.error('Erro ao buscar pedido:', err);
      setError('Pedido não encontrado. Por favor, verifique o número do pedido e tente novamente.');
      setOrder(null);
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchOrder(orderIdInput);
  };
  
  const getStatusIcon = (status: string | undefined) => {
    switch (status) {
      case 'completed':
        return <CheckCircle2 className="h-10 w-10 text-pizza-success" />;
      case 'pending':
        return <Clock className="h-10 w-10 text-pizza-secondary" />;
      case 'canceled':
        return <XCircle className="h-10 w-10 text-destructive" />;
      default:
        return <Clock className="h-10 w-10 text-pizza-secondary" />;
    }
  };
  
  const getStatusText = (status: string | undefined) => {
    switch (status) {
      case 'completed':
        return 'Entregue';
      case 'pending':
        return 'Em trânsito';
      case 'canceled':
        return 'Cancelado';
      default:
        return 'Em processamento';
    }
  };
  
  return (
    <div className="pizza-container py-12">
      <h1 className="text-3xl font-bold text-center mb-8">Rastrear seu Pedido</h1>
      
      {userOrders.length > 0 && (
        <div className="max-w-xl mx-auto mb-8">
          <Card>
            <CardHeader>
              <CardTitle>Seus Pedidos Recentes</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {userOrders.map((userOrder) => (
                  <button
                    key={userOrder.id}
                    onClick={() => {
                      setOrderIdInput(String(userOrder.id));
                      fetchOrder(String(userOrder.id));
                    }}
                    className="w-full text-left p-4 rounded-lg border hover:bg-accent"
                  >
                    <div className="flex justify-between items-center">
                      <span>Pedido #{userOrder.id}</span>
                      <span>{getStatusText(userOrder.status)}</span>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {new Date(userOrder.order_date || '').toLocaleString()}
                    </div>
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      <div className="max-w-xl mx-auto mb-8">
        <Card>
          <CardHeader>
            <CardTitle>Digite o Número do Pedido</CardTitle>
            <CardDescription>
              Digite o número do seu pedido para rastrear o status da entrega
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSearch} className="flex space-x-2">
              <Input
                value={orderIdInput}
                onChange={(e) => setOrderIdInput(e.target.value)}
                placeholder="Número do Pedido"
                className="flex-1"
              />
              <Button 
                type="submit" 
                className="bg-pizza-primary hover:bg-pizza-primary/90"
                disabled={isLoading}
              >
                <SearchIcon className="h-4 w-4 mr-2" />
                Rastrear
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
      
      {isLoading ? (
        <div className="text-center py-8">
          <div className="animate-pulse">
            <div className="h-32 w-full max-w-xl mx-auto bg-muted rounded-lg"></div>
          </div>
        </div>
      ) : error ? (
        <div className="max-w-xl mx-auto">
          <Card className="border-destructive">
            <CardHeader>
              <CardTitle className="text-destructive">Erro</CardTitle>
            </CardHeader>
            <CardContent>
              <p>{error}</p>
              <Button
                className="mt-4 bg-pizza-primary hover:bg-pizza-primary/90"
                onClick={() => window.location.href = '/'}
              >
                Voltar ao Menu
              </Button>
            </CardContent>
          </Card>
        </div>
      ) : order ? (
        <div className="max-w-3xl mx-auto">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Pedido #{order.id}</CardTitle>
                <CardDescription>
                  Realizado em {new Date(order.order_date || '').toLocaleString()}
                </CardDescription>
              </div>
              <div className="flex items-center">
                {getStatusIcon(order.status)}
              </div>
            </CardHeader>
            <CardContent>
              <div className="mb-8">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold">Status da Entrega</h3>
                  <Button
                    variant="outline"
                    onClick={() => setShowMap(!showMap)}
                    className="flex items-center gap-2"
                  >
                    <Map className="h-4 w-4" />
                    {showMap ? 'Ocultar Mapa' : 'Ver no Mapa'}
                  </Button>
                </div>
                
                {showMap && (
                  <div className="mb-4">
                    <DeliveryMap deliveryAddress={order.delivery_address} />
                  </div>
                )}

                <div className="relative">
                  <div className="overflow-hidden h-2 text-xs flex rounded bg-muted mb-2">
                    <div 
                      className={`shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-pizza-primary ${
                        order.status === 'completed' ? 'w-full' : 
                        order.status === 'pending' ? 'w-2/3' : 'w-1/3'
                      }`}
                    ></div>
                  </div>
                  
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>Enviado</span>
                    <span>Em Trânsito</span>
                    <span>Entregue</span>
                  </div>
                </div>
                
                <div className="mt-6 p-4 bg-muted rounded-lg">
                  <div className="flex items-center">
                    <TruckIcon className="h-5 w-5 mr-2 text-pizza-primary" />
                    <span>
                      {order.status === 'completed' 
                        ? 'Seu pedido foi entregue' 
                        : `Tempo estimado de entrega: ${order.estimated_delivery_time || 'Aproximadamente 30 minutos'}`
                      }
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="mb-8">
                <h3 className="text-lg font-semibold mb-4">Detalhes do Pedido</h3>
                <div className="space-y-4">
                  {order.items && order.items.length > 0 ? (
                    order.items.map((item, index) => (
                      <div key={index} className="flex justify-between items-center p-3 bg-accent rounded-lg">
                        <div className="flex items-center">
                          {item.item_type === 'pizza' ? (
                            <Pizza className="h-5 w-5 mr-3 text-pizza-primary" />
                          ) : (
                            <Coffee className="h-5 w-5 mr-3 text-pizza-primary" />
                          )}
                          <div>
                            <p className="font-medium">{item.quantity}x {item.item_type}</p>
                            {item.pizza && (
                              <p className="text-sm text-muted-foreground">
                                Tamanho: {item.size ? 'Médio' : 'Médio'}
                              </p>
                            )}
                          </div>
                        </div>
                        <span>${item.price.toFixed(2)}</span>
                      </div>
                    ))
                  ) : (
                    <p className="text-muted-foreground">Não há detalhes do pedido disponíveis</p>
                  )}
                  
                  <div className="pt-4 mt-4 border-t">
                    <div className="flex justify-between">
                      <span>Total</span>
                      <span className="font-bold">${order.total_price.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-semibold mb-3">Endereço de Entrega</h3>
                  <p className="whitespace-pre-line">{order.delivery_address}</p>
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-3">Contato</h3>
                  <p>{order.contact_phone}</p>
                </div>
              </div>
              
              <div className="mt-8 pt-4 border-t text-center">
                <Link to="/">
                  <Button 
                    className="bg-pizza-primary hover:bg-pizza-primary/90"
                  >
                    Novo Pedido
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      ) : null}
    </div>
  );
};

export default OrderTrackingPage;
