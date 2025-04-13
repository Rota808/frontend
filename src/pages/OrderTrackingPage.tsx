
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
  Coffee
} from 'lucide-react';

const OrderTrackingPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [orderIdInput, setOrderIdInput] = useState<string>(searchParams.get('orderId') || '');
  const [order, setOrder] = useState<Order | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const fetchOrder = async (id: string) => {
    if (!id) {
      setError('Please enter an order ID');
      return;
    }
    
    try {
      setIsLoading(true);
      setError(null);
      
      const orderData = await apiService.getOrder(parseInt(id));
      setOrder(orderData);
      
      // Update URL with order ID
      setSearchParams({ orderId: id });
      
    } catch (err) {
      console.error('Error fetching order:', err);
      setError('Order not found. Please check the order ID and try again.');
      setOrder(null);
    } finally {
      setIsLoading(false);
    }
  };
  
  useEffect(() => {
    const orderId = searchParams.get('orderId');
    if (orderId) {
      fetchOrder(orderId);
    }
  }, [searchParams]);
  
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
        return 'Delivered';
      case 'pending':
        return 'On the way';
      case 'canceled':
        return 'Canceled';
      default:
        return 'Processing';
    }
  };
  
  return (
    <div className="pizza-container py-12">
      <h1 className="text-3xl font-bold text-center mb-8">Track Your Order</h1>
      
      <div className="max-w-xl mx-auto mb-8">
        <Card>
          <CardHeader>
            <CardTitle>Enter Order ID</CardTitle>
            <CardDescription>
              Enter your order ID to track the status of your delivery
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSearch} className="flex space-x-2">
              <Input
                value={orderIdInput}
                onChange={(e) => setOrderIdInput(e.target.value)}
                placeholder="Order ID"
                className="flex-1"
              />
              <Button 
                type="submit" 
                className="bg-pizza-primary hover:bg-pizza-primary/90"
                disabled={isLoading}
              >
                <SearchIcon className="h-4 w-4 mr-2" />
                Track
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
              <CardTitle className="text-destructive">Error</CardTitle>
            </CardHeader>
            <CardContent>
              <p>{error}</p>
              <Button
                className="mt-4 bg-pizza-primary hover:bg-pizza-primary/90"
                onClick={() => window.location.href = '/'}
              >
                Return to Menu
              </Button>
            </CardContent>
          </Card>
        </div>
      ) : order ? (
        <div className="max-w-3xl mx-auto">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Order #{order.id}</CardTitle>
                <CardDescription>
                  Placed on {new Date(order.order_date || '').toLocaleString()}
                </CardDescription>
              </div>
              <div className="flex items-center">
                {getStatusIcon(order.status)}
              </div>
            </CardHeader>
            <CardContent>
              <div className="mb-8">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold">Delivery Status</h3>
                  <span className="font-medium">{getStatusText(order.status)}</span>
                </div>
                
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
                    <span>Order Placed</span>
                    <span>On the Way</span>
                    <span>Delivered</span>
                  </div>
                </div>
                
                <div className="mt-6 p-4 bg-muted rounded-lg">
                  <div className="flex items-center">
                    <TruckIcon className="h-5 w-5 mr-2 text-pizza-primary" />
                    <span>
                      {order.status === 'completed' 
                        ? 'Your order has been delivered' 
                        : `Estimated delivery time: ${order.estimated_delivery_time || 'About 30 minutes'}`
                      }
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="mb-8">
                <h3 className="text-lg font-semibold mb-4">Order Details</h3>
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
                                Size: {item.size ? 'Medium' : 'Medium'}
                              </p>
                            )}
                          </div>
                        </div>
                        <span>${item.price.toFixed(2)}</span>
                      </div>
                    ))
                  ) : (
                    <p className="text-muted-foreground">No item details available</p>
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
                  <h3 className="text-lg font-semibold mb-3">Delivery Address</h3>
                  <p className="whitespace-pre-line">{order.delivery_address}</p>
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-3">Contact</h3>
                  <p>{order.contact_phone}</p>
                </div>
              </div>
              
              <div className="mt-8 pt-4 border-t text-center">
                <Link to="/">
                  <Button 
                    className="bg-pizza-primary hover:bg-pizza-primary/90"
                  >
                    Order Again
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
