
import React from 'react';
import { Pizza, PizzaPrice } from '@/services/api';
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

interface PizzaListProps {
  pizzas: Pizza[];
  pizzaPrices: PizzaPrice[];
  onEdit: (pizza: Pizza) => void;
  onDelete: (id: number) => void;
}

const PizzaList: React.FC<PizzaListProps> = ({ 
  pizzas, 
  pizzaPrices,
  onEdit, 
  onDelete 
}) => {
  // Calculate how many sizes have prices for each pizza
  const getPriceCountForPizza = (pizzaId: number) => {
    return pizzaPrices.filter(price => price.pizza === pizzaId).length;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Pizzas Disponíveis</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Imagem</TableHead>
              <TableHead>Nome</TableHead>
              <TableHead>Descrição</TableHead>
              <TableHead>Contagem de Preços</TableHead>
              <TableHead>Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {pizzas.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-4">
                  Nenhuma pizza encontrada
                </TableCell>
              </TableRow>
            ) : (
              pizzas.map((pizza) => (
                <TableRow key={pizza.id}>
                  <TableCell>
                    {pizza.image_url ? (
                      <img 
                        src={pizza.image_url} 
                        alt={pizza.pizza_name} 
                        className="w-12 h-12 object-cover rounded"
                      />
                    ) : (
                      <div className="w-12 h-12 bg-gray-200 rounded flex items-center justify-center text-gray-400">
                        Sem imagem
                      </div>
                    )}
                  </TableCell>
                  <TableCell className="font-medium">{pizza.pizza_name}</TableCell>
                  <TableCell className="max-w-xs truncate">{pizza.description}</TableCell>
                  <TableCell>{getPriceCountForPizza(pizza.id)}</TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button 
                        size="icon" 
                        variant="outline" 
                        onClick={() => onEdit(pizza)}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button 
                        size="icon" 
                        variant="destructive" 
                        onClick={() => onDelete(pizza.id)}
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

export default PizzaList;
