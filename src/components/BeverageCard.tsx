
import React from 'react';
import { Beverage } from '@/services/api';
import { 
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useCart } from '@/contexts/CartContext';

interface BeverageCardProps {
  beverage: Beverage;
}

const BeverageCard: React.FC<BeverageCardProps> = ({ beverage }) => {
  const { addBeverageToCart } = useCart();
  
  const handleAddToCart = () => {
    addBeverageToCart(beverage);
  };
  
  return (
    <Card className="pizza-card h-full flex flex-col">
      <CardHeader>
        <CardTitle className="text-xl font-bold text-pizza-text">
          {beverage.beverage_name}
        </CardTitle>
        <CardDescription className="text-muted-foreground">
          {beverage.description}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-grow">
        <div className="w-full h-32 bg-muted rounded-md mb-4 flex items-center justify-center">
          <span className="text-muted-foreground">Beverage Image</span>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between items-center">
        <span className="text-lg font-semibold">
          ${beverage.price.toFixed(2)}
        </span>
        <Button 
          onClick={handleAddToCart} 
          className="bg-pizza-primary hover:bg-pizza-primary/90"
        >
          Add to Cart
        </Button>
      </CardFooter>
    </Card>
  );
};

export default BeverageCard;
