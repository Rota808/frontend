
import { initMercadoPago, Wallet } from '@mercadopago/sdk-react';
import React, { useEffect } from 'react';
import { Button } from './ui/button';

// Initialize MercadoPago with the public key
initMercadoPago('APP_USR-94cce6e2-7574-4dc9-bf81-743b7d093b08');

interface MercadoPagoPaymentProps {
  preferenceId: string | null;
  isLoading: boolean;
}

const MercadoPagoPayment: React.FC<MercadoPagoPaymentProps> = ({
  preferenceId,
  isLoading
}) => {
  if (isLoading) {
    return <Button disabled>Carregando pagamento...</Button>;
  }

  if (!preferenceId) {
    return <Button disabled>Erro ao carregar pagamento</Button>;
  }

  return (
    <div className="w-full">
      <Wallet initialization={{ preferenceId }} />
    </div>
  );
};

export default MercadoPagoPayment;
