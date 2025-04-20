
// Payment service for handling MercadoPago payments
import { orderStatusService, ORDER_STATUS } from './orderStatus';

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
        const response = await fetch(`/api/payments/${orderId}/confirm/`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            status: 'approved'
          }),
        });

        if (!response.ok) {
          throw new Error('Failed to confirm payment');
        }

        const data = await response.json();
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
      return {
        success: false,
        error: 'Falha ao processar pagamento'
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
      return {
        success: false,
        error: 'Falha ao processar pagamento em dinheiro'
      };
    }
  }
};
