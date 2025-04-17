
import { apiService, Order } from '@/services/api';
import { toast } from "@/components/ui/sonner";

export const ORDER_STATUS = {
  PAYMENT_PENDING: 'payment_pending',
  PENDING: 'pending',
  IN_TRANSIT: 'in_transit',
  COMPLETED: 'completed',
  CANCELED: 'canceled'
};

export const orderStatusService = {
  // Process order after payment is confirmed
  processOrderAfterPayment: async (orderId: number): Promise<Order | null> => {
    try {
      // Simulating API call to update order status after payment
      console.log(`Processing order ${orderId} after payment...`);
      
      // Get current order
      const order = await apiService.getOrder(orderId);
      
      if (!order) {
        throw new Error('Order not found');
      }
      
      // Update order status to indicate it's in transit
      const updatedOrder = {
        ...order,
        status: ORDER_STATUS.IN_TRANSIT
      };
      
      // Update local storage to reflect status change
      const userOrders = apiService.getUserOrders();
      const updatedOrders = userOrders.map(o => 
        o.id === orderId ? updatedOrder : o
      );
      localStorage.setItem('userOrders', JSON.stringify(updatedOrders));
      
      toast.success("Pagamento confirmado! Seu pedido está em trânsito.");
      
      // Set a timer to automatically complete the order after some time
      setTimeout(() => {
        orderStatusService.completeOrder(orderId);
      }, 1000 * 60 * 3); // 3 minutes for demo purposes
      
      return updatedOrder;
    } catch (error) {
      console.error('Error processing order after payment:', error);
      toast.error('Erro ao processar pedido após pagamento');
      return null;
    }
  },
  
  // Complete an order
  completeOrder: async (orderId: number): Promise<Order | null> => {
    try {
      // Get current order
      const userOrders = apiService.getUserOrders();
      const order = userOrders.find(o => o.id === orderId);
      
      if (!order) {
        throw new Error('Order not found');
      }
      
      // Update order status to completed
      const updatedOrder = {
        ...order,
        status: ORDER_STATUS.COMPLETED
      };
      
      // Update local storage
      const updatedOrders = userOrders.map(o => 
        o.id === orderId ? updatedOrder : o
      );
      localStorage.setItem('userOrders', JSON.stringify(updatedOrders));
      
      toast.success("Seu pedido foi entregue!");
      
      return updatedOrder;
    } catch (error) {
      console.error('Error completing order:', error);
      return null;
    }
  },
  
  // Cancel an order
  cancelOrder: async (orderId: number): Promise<Order | null> => {
    try {
      // Get current order
      const userOrders = apiService.getUserOrders();
      const order = userOrders.find(o => o.id === orderId);
      
      if (!order) {
        throw new Error('Order not found');
      }
      
      // Update order status to canceled
      const updatedOrder = {
        ...order,
        status: ORDER_STATUS.CANCELED
      };
      
      // Update local storage
      const updatedOrders = userOrders.map(o => 
        o.id === orderId ? updatedOrder : o
      );
      localStorage.setItem('userOrders', JSON.stringify(updatedOrders));
      
      toast.error("Seu pedido foi cancelado.");
      
      return updatedOrder;
    } catch (error) {
      console.error('Error canceling order:', error);
      return null;
    }
  }
};
