
import React, { useState } from 'react';
import { Pizza, Size, PizzaPrice } from '@/services/api';
import { 
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useCart } from '@/contexts/CartContext';

interface PizzaCardProps {
  pizza: Pizza;
  sizes: Size[];
  pizzaPrices: PizzaPrice[];
}

const PizzaCard: React.FC<PizzaCardProps> = ({ pizza, sizes, pizzaPrices }) => {
  const [selectedSizeId, setSelectedSizeId] = useState<string>(
    sizes.length > 0 ? String(sizes[0].id) : ''
  );
  
  const { addPizzaToCart } = useCart();
  
  // Get the available sizes for this pizza
  const availableSizes = sizes.filter(size => 
    pizzaPrices.some(
      price => price.pizza === pizza.id && price.size === size.id
    )
  );
  
  // Get price for the selected size
  const getPrice = (): number => {
    if (!selectedSizeId) return 0;
    
    const priceEntry = pizzaPrices.find(
      price => 
        price.pizza === pizza.id && 
        price.size === parseInt(selectedSizeId)
    );
    
    return priceEntry ? priceEntry.price : 0;
  };
  
  const price = getPrice();
  
  const handleAddToCart = () => {
    const selectedSize = sizes.find(size => size.id === parseInt(selectedSizeId));
    if (selectedSize) {
      addPizzaToCart(pizza, selectedSize, price);
    }
  };
  
  // Get selected size name
  const getSelectedSizeName = (): string => {
    if (!selectedSizeId) return '';
    const size = sizes.find(size => size.id === parseInt(selectedSizeId));
    return size ? size.size_name : '';
  };
  
  return (
    <Card className="pizza-card h-full flex flex-col">
      <CardHeader>
        <CardTitle className="text-xl font-bold text-pizza-text">
          {pizza.pizza_name}
        </CardTitle>
        <CardDescription className="text-muted-foreground">
          {pizza.description}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-grow">
        <div className="w-full h-48 bg-muted rounded-md mb-4 flex items-center justify-center overflow-hidden">
          {pizza.image_url ? (
            <img 
              src={pizza.image_url} 
              alt={pizza.pizza_name} 
              className="w-full h-full object-cover"
            />
          ) : (
            <span className="text-muted-foreground">Pizza Image</span>
          )}
        </div>
      </CardContent>
      <CardFooter className="flex flex-col space-y-3">
        <div className="w-full">
          <Select 
            value={selectedSizeId} 
            onValueChange={setSelectedSizeId}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select a size" />
            </SelectTrigger>
            <SelectContent>
              {availableSizes.map((size) => (
                <SelectItem key={size.id} value={String(size.id)}>
                  {size.size_name} ({size.diameter}cm)
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div className="w-full flex items-center justify-between">
          <span className="text-lg font-semibold">
            ${price.toFixed(2)}
          </span>
          <Button 
            onClick={handleAddToCart} 
            className="bg-pizza-primary hover:bg-pizza-primary/90"
            disabled={!selectedSizeId}
          >
            Adicionar ao Carrinho
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};

export default PizzaCard;
