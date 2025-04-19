
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
  orderPlaced: boolean; // New prop to control when to show errors
}

const MercadoPagoPayment: React.FC<MercadoPagoPaymentProps> = ({
  orderId,
  cartItems,
  userInfo,
  onReady,
  orderPlaced,
}) => {
  const [isInitializing, setIsInitializing] = useState(true);
  const [preferenceId, setPreferenceId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);

  const createPaymentPreference = async () => {
    setIsInitializing(true);
    setError(null);

    try {
      if (!orderId) {
        throw new Error("Nenhum pedido encontrado");
      }

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
    } catch (err) {
      console.error("Payment error:", err);
      setError(err instanceof Error ? err.message : "Erro desconhecido");

      if (retryCount < 3) {
        setTimeout(() => {
          setRetryCount(retryCount + 1);
          createPaymentPreference();
        }, 2000);
      }
    } finally {
      setIsInitializing(false);
    }
  };

  useEffect(() => {
    createPaymentPreference();
  }, [orderId, retryCount]);

  if (isInitializing) {
    return (
      <div className="flex flex-col items-center gap-4 p-4">
        <Button disabled className="gap-2">
          <Loader2 className="h-4 w-4 animate-spin" />
          {retryCount > 0 ? "Tentando novamente..." : "Preparando pagamento..."}
        </Button>
        {orderPlaced && (
          <p className="text-sm text-muted-foreground">
            {retryCount > 0
              ? `Tentativa ${retryCount} de 3`
              : "Estabelecendo conexão segura"}
          </p>
        )}
      </div>
    );
  }

  if (error && orderPlaced) {
    return (
      <div className="flex flex-col items-center gap-4 p-4">
        <Button variant="destructive" disabled>
          Erro no pagamento
        </Button>
        <p className="text-sm text-red-500 text-center max-w-md">{error}</p>
        <Button
          onClick={() => {
            setRetryCount(0);
            createPaymentPreference();
          }}
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
        {preferenceId && (
          <Wallet
            initialization={{ preferenceId }}
            onReady={() => console.log("MercadoPago Wallet ready")}
            onError={(error) => {
              console.error("MercadoPago error:", error);
              if (orderPlaced) {
                setError("Falha ao carregar o método de pagamento");
              }
            }}
          />
        )}
      </div>
      {orderPlaced && (
        <p className="text-xs text-muted-foreground text-center">
          Pagamento 100% seguro via Mercado Pago
        </p>
      )}
    </div>
  );
};

export default MercadoPagoPayment;
