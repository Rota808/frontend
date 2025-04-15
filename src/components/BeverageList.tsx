import React from 'react';
import { Beverage } from '@/services/api';
import { Button } from '@/components/ui/button';
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow 
} from '@/components/ui/table';
import { 
  Card,
  CardContent,
  CardHeader,
  CardTitle 
} from '@/components/ui/card';
import { Pencil, Trash2 } from 'lucide-react';

interface BeverageListProps {
  beverages: Beverage[];
  onEdit: (beverage: Beverage) => void;
  onDelete: (id: number) => void;
}

const BeverageList: React.FC<BeverageListProps> = ({ 
  beverages,
  onEdit, 
  onDelete 
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Bebidas Disponíveis</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Imagem</TableHead> {/* <-- Adicione esta linha */}
              <TableHead>Nome</TableHead>
              <TableHead>Descrição</TableHead>
              <TableHead>Preço (R$)</TableHead>
              <TableHead>Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {beverages.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-4">
                  Nenhuma bebida encontrada
                </TableCell>
              </TableRow>
            ) : (
              beverages.map((beverage) => (
                <TableRow key={beverage.id}>
                  <TableCell>
                    {beverage.image_url ? (
                      <img
                        src={beverage.image_url}
                        alt={beverage.beverage_name}
                        className="w-12 h-12 object-cover rounded"
                      />
                    ) : (
                      <div className="w-12 h-12 bg-muted rounded flex items-center justify-center text-muted-foreground text-xs text-center">
                        Sem imagem
                      </div>
                    )}
                  </TableCell>
                  <TableCell className="font-medium">{beverage.beverage_name}</TableCell>
                  <TableCell className="max-w-xs truncate">{beverage.description}</TableCell>
                  <TableCell>{beverage.price.toFixed(2)}</TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button 
                        size="icon" 
                        variant="outline" 
                        onClick={() => onEdit(beverage)}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button 
                        size="icon" 
                        variant="destructive" 
                        onClick={() => onDelete(beverage.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default BeverageList;