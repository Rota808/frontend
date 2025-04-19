
import { initMercadoPago, Wallet } from '@mercadopago/sdk-react';
import React, { useEffect } from 'react';
import { Button } from './ui/button';

// Inicializa o MercadoPago com chave pública de teste
initMercadoPago('TEST-91184469-7151-4220-8de6-2f233c2d51ab');

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
