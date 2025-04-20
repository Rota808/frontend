// Payment service for handling MercadoPago payments
// Note: This is a client-side implementation that would need to connect
// to a secure backend service later

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
      
      // This will be replaced with actual MercadoPago API calls
      // We're keeping this simple since MercadoPago UI handles the payment flow
      
      // Generate transaction ID for the payment record
      const transactionId = `MP-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
      
      // Update order status if orderId is provided
      if (orderId) {
        await orderStatusService.processOrderAfterPayment(orderId);
      }
      
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
      
      // Generate transaction ID
      const transactionId = `CASH-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
      
      // For cash payments, we'll also update the order status
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
