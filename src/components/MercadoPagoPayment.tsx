// components/MercadoPagoPayment.tsx
import { initMercadoPago, Wallet } from "@mercadopago/sdk-react";
import React, { useEffect, useState } from "react";
import { Button } from "./ui/button";
import { Loader2 } from "lucide-react";

// Initialize MercadoPago (use environment variable in production)
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
}

const MercadoPagoPayment: React.FC<MercadoPagoPaymentProps> = ({
  orderId,
  cartItems,
  userInfo,
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [preferenceId, setPreferenceId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const createPaymentPreference = async () => {
      if (!orderId) {
        setError("Nenhum pedido encontrado");
        setIsLoading(false);
        return;
      }

      try {
        console.log("Creating payment preference for order:", orderId);

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
        console.log("Payment preference response:", data);

        if (!response.ok) {
          throw new Error(data.error || "Erro ao criar pagamento");
        }

        if (!data.preference_id) {
          throw new Error("ID de preferência não recebido");
        }

        setPreferenceId(data.preference_id);
        setError(null);
      } catch (err) {
        console.error("Payment error:", err);
        setError(err instanceof Error ? err.message : "Erro desconhecido");
      } finally {
        setIsLoading(false);
      }
    };

    createPaymentPreference();
  }, [orderId, cartItems, userInfo]);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center gap-4 p-4">
        <Button disabled className="gap-2">
          <Loader2 className="h-4 w-4 animate-spin" />
          Carregando pagamento...
        </Button>
        <p className="text-sm text-muted-foreground">
          Preparando sua conexão segura com Mercado Pago
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
        <Button onClick={() => window.location.reload()} className="mt-2">
          Tentar novamente
        </Button>
      </div>
    );
  }

  if (!preferenceId) {
    return (
      <div className="flex flex-col items-center gap-4 p-4">
        <Button variant="destructive" disabled>
          Pagamento indisponível
        </Button>
        <p className="text-sm text-muted-foreground">
          Não foi possível iniciar o processo de pagamento
        </p>
      </div>
    );
  }

  return (
    <div className="w-full space-y-4">
      <div className="border rounded-lg p-4">
        <Wallet
          initialization={{ preferenceId }}
          onReady={() => console.log("MercadoPago Wallet ready")}
          onError={(error) => {
            console.error("MercadoPago error:", error);
            setError("Falha ao carregar o método de pagamento");
          }}
        />
      </div>
      <p className="text-xs text-muted-foreground text-center">
        Pagamento 100% seguro via Mercado Pago
      </p>
    </div>
  );
};

export default MercadoPagoPayment;
