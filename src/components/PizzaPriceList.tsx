
import React from 'react';
import { PizzaPrice, Pizza, Size } from '@/services/api';
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

interface PizzaPriceListProps {
  pizzaPrices: PizzaPrice[];
  pizzas: Pizza[];
  sizes: Size[];
  onEdit: (priceItem: PizzaPrice) => void;
  onDelete: (id: number) => void;
}

const PizzaPriceList: React.FC<PizzaPriceListProps> = ({ 
  pizzaPrices, 
  pizzas,
  sizes,
  onEdit, 
  onDelete 
}) => {
  // Helper function to find pizza name by id
  const getPizzaName = (pizzaId: number) => {
    const pizza = pizzas.find(p => p.id === pizzaId);
    return pizza ? pizza.pizza_name : 'Unknown Pizza';
  };

  // Helper function to find size name by id
  const getSizeName = (sizeId: number) => {
    const size = sizes.find(s => s.id === sizeId);
    return size ? `${size.size_name} (${size.diameter}cm)` : 'Unknown Size';
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Pizza Prices</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Pizza</TableHead>
              <TableHead>Size</TableHead>
              <TableHead>Price ($)</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {pizzaPrices.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center py-4">
                  No price information found
                </TableCell>
              </TableRow>
            ) : (
              pizzaPrices.map((price) => (
                <TableRow key={price.id}>
                  <TableCell>{getPizzaName(price.pizza)}</TableCell>
                  <TableCell>{getSizeName(price.size)}</TableCell>
                  <TableCell>${price.price.toFixed(2)}</TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button 
                        size="icon" 
                        variant="outline" 
                        onClick={() => onEdit(price)}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button 
                        size="icon" 
                        variant="destructive" 
                        onClick={() => onDelete(price.id)}
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

export default PizzaPriceList;
