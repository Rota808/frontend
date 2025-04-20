
// Payment service for handling MercadoPago payments
import { orderStatusService, ORDER_STATUS } from './orderStatus';
import { toast } from "@/components/ui/sonner";

interface PaymentResult {
  success: boolean;
  error?: string;
  transactionId?: string;
  orderId?: number;
}

export const paymentService = {
  // Process a MercadoPago payment
  processMercadoPagoPayment: async (
    amount: number,
    orderId?: number
  ): Promise<PaymentResult> => {
    try {
      console.log('Processing MercadoPago payment for amount:', amount);
      
      // If we have an orderId, confirm the payment status
      if (orderId) {
        console.log('Confirming payment for order:', orderId);
        
        const apiUrl = `https://es2back-f9bra3hfdua8cfa7.francecentral-01.azurewebsites.net/api/payments/${orderId}/confirm/`;
        //const apiUrl = `http://localhost:8000/api/payments/${orderId}/confirm/`;
        console.log('Calling API URL:', apiUrl);
        
        const response = await fetch(apiUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            status: 'approved'
          }),
        });

        console.log('Response status:', response.status);
        
        if (!response.ok) {
          const errorText = await response.text();
          console.error('API error response:', errorText);
          throw new Error('Failed to confirm payment');
        }

        let data;
        const responseText = await response.text();
        console.log('Raw response:', responseText);
        
        try {
          data = responseText ? JSON.parse(responseText) : {};
        } catch (parseError) {
          console.error('JSON parse error:', parseError);
        }
        
        console.log('Payment confirmation response:', data);

        // Update order status
        await orderStatusService.processOrderAfterPayment(orderId);
      }
      
      const transactionId = `MP-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
      
      return {
        success: true,
        transactionId,
        orderId
      };
    } catch (error) {
      console.error('MercadoPago payment error:', error);
      toast.error('Falha ao processar pagamento');
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Falha ao processar pagamento'
      };
    }
  },

  // Process a cash payment
  processCashPayment: async (
    amount: number,
    orderId?: number
  ): Promise<PaymentResult> => {
    try {
      console.log('Processing cash payment for amount:', amount);
      
      const transactionId = `CASH-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
      
      if (orderId) {
        await orderStatusService.processOrderAfterPayment(orderId);
      }
      
      return {
        success: true,
        transactionId,
        orderId
      };
    } catch (error) {
      console.error('Cash payment error:', error);
      toast.error('Falha ao processar pagamento em dinheiro');
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Falha ao processar pagamento em dinheiro'
      };
    }
  }
};
