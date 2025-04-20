
import { initMercadoPago, Wallet } from "@mercadopago/sdk-react";
import React, { useEffect, useState } from "react";
import { Button } from "./ui/button";
import { Loader2 } from "lucide-react";

// Initialize MercadoPago
const publicKey = "APP_USR-94cce6e2-7574-4dc9-bf81-743b7d093b08";
initMercadoPago(publicKey, { locale: "pt-BR" });

interface MercadoPagoPaymentProps {
  orderId: string;
  cartItems: Array<{
    id: string;
    name: string;
    price: number;
    quantity: number;
  }>;
  userInfo: {
    email: string;
    phone: string;
  };
  onReady?: () => void;
  orderPlaced: boolean; // Prop to control when to show errors
}

const MercadoPagoPayment: React.FC<MercadoPagoPaymentProps> = ({
  orderId,
  cartItems,
  userInfo,
  onReady,
  orderPlaced,
}) => {
  const [preferenceId, setPreferenceId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const createPaymentPreference = async () => {
    if (!orderPlaced || !orderId) return;
    
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(
        "/api/orders/create_mercado_pago_preference/",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            order_id: orderId,
            items: cartItems.map((item) => ({
              id: item.id,
              title: item.name,
              unit_price: item.price,
              quantity: item.quantity,
            })),
            payer: {
              email: userInfo.email,
              phone: userInfo.phone,
            },
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Erro ao criar pagamento");
      }

      if (!data.preference_id) {
        throw new Error("ID de preferência não recebido");
      }

      setPreferenceId(data.preference_id);
      onReady?.();
      
      // For demo purposes, we'll simulate a successful API call
      // In a real application, this would come from MercadoPago's API
      setPreferenceId(`TEST-PREFERENCE-${Date.now()}`);
      
    } catch (err) {
      console.error("Payment error:", err);
      setError(err instanceof Error ? err.message : "Erro desconhecido");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // Only attempt to create a payment preference if orderPlaced is true
    if (orderPlaced && orderId) {
      createPaymentPreference();
    }
  }, [orderId, orderPlaced]);

  // Don't render anything if order hasn't been placed yet
  if (!orderPlaced) {
    return null;
  }

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin text-pizza-primary" />
        <p className="mt-2 text-sm text-muted-foreground">
          Carregando opções de pagamento...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center gap-4 p-4">
        <Button variant="destructive" disabled>
          Erro no pagamento
        </Button>
        <p className="text-sm text-red-500 text-center max-w-md">{error}</p>
        <Button
          onClick={() => createPaymentPreference()}
          className="mt-2"
        >
          Tentar novamente
        </Button>
      </div>
    );
  }

  return (
    <div className="w-full space-y-4">
      <div className="border rounded-lg p-4">
        {preferenceId ? (
          <Wallet
            initialization={{ preferenceId }}
            onReady={() => {
              console.log("MercadoPago Wallet ready");
              onReady?.();
            }}
            onError={(error) => {
              console.error("MercadoPago error:", error);
              setError("Falha ao carregar o método de pagamento");
            }}
            customization={{
              texts: {
                action: 'pay',
                valueProp: 'security_details',
              }
            }}
          />
        ) : (
          <div className="text-center p-4">
            <p>Preparando opções de pagamento...</p>
          </div>
        )}
      </div>
      <p className="text-xs text-muted-foreground text-center">
        Pagamento 100% seguro via Mercado Pago
      </p>
    </div>
  );
};

export default MercadoPagoPayment;
