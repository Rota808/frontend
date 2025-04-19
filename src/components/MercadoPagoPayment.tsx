import { initMercadoPago, Wallet } from "@mercadopago/sdk-react";
import React, { useEffect, useState } from "react";
import { Button } from "./ui/button";

initMercadoPago("APP_USR-94cce6e2-7574-4dc9-bf81-743b7d093b08", {
  locale: "pt-BR",
});

interface MercadoPagoPaymentProps {
  preferenceId: string | null;
  isLoading: boolean;
  onPaymentSuccess?: () => void;
  onPaymentError?: (error: any) => void;
}

const MercadoPagoPayment: React.FC<MercadoPagoPaymentProps> = ({
  preferenceId,
  isLoading,
  onPaymentSuccess,
  onPaymentError,
}) => {
  const [paymentError, setPaymentError] = useState<string | null>(null);

  useEffect(() => {
    if (preferenceId) {
      setPaymentError(null);
    }
  }, [preferenceId]);

  const handleOnReady = () => {
    console.log("MercadoPago Wallet is ready");
  };

  const handleOnError = (error: any) => {
    console.error("MercadoPago Wallet error:", error);
    setPaymentError("Erro ao carregar o método de pagamento");
    if (onPaymentError) {
      onPaymentError(error);
    }
  };

  if (isLoading) {
    return <Button disabled>Carregando pagamento...</Button>;
  }

  if (!preferenceId || paymentError) {
    return (
      <div className="flex flex-col items-center gap-2">
        <Button disabled>Erro ao carregar pagamento</Button>
        {paymentError && <p className="text-sm text-red-500">{paymentError}</p>}
      </div>
    );
  }

  return (
    <div className="w-full">
      <Wallet
        initialization={{ preferenceId }}
        onReady={handleOnReady}
        onError={handleOnError}
      />
      <p className="mt-2 text-sm text-gray-500">
        Pagamento seguro via Mercado Pago
      </p>
    </div>
  );
};

export default MercadoPagoPayment;
