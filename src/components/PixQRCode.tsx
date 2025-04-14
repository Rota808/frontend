
import React from 'react';
import QRCode from 'react-qr-code';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';

interface PixQRCodeProps {
  value: string;
  amount: number;
}

const PixQRCode: React.FC<PixQRCodeProps> = ({ value, amount }) => {
  return (
    <Card className="w-full max-w-sm mx-auto">
      <CardHeader>
        <CardTitle className="text-center">PIX QR Code</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col items-center space-y-4">
        <div className="bg-white p-4 rounded-lg">
          <QRCode value={value} size={200} />
        </div>
        <p className="text-sm text-muted-foreground text-center">
          Valor a pagar: R$ {amount.toFixed(2)}
        </p>
        <p className="text-xs text-muted-foreground text-center">
          Escaneie o QR Code com seu aplicativo de pagamento
        </p>
      </CardContent>
    </Card>
  );
};

export default PixQRCode;
