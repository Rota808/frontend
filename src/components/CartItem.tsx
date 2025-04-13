
import React from 'react';
import { CartItem as CartItemType } from '@/contexts/CartContext';
import { MinusCircle, PlusCircle, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface CartItemProps {
  item: CartItemType;
  index: number;
  onRemove: (index: number) => void;
  onUpdateQuantity: (index: number, quantity: number) => void;
}

const CartItem: React.FC<CartItemProps> = ({
  item,
  index,
  onRemove,
  onUpdateQuantity,
}) => {
  const handleRemove = () => {
    onRemove(index);
  };

  const handleIncreaseQuantity = () => {
    onUpdateQuantity(index, item.quantity + 1);
  };

  const handleDecreaseQuantity = () => {
    if (item.quantity > 1) {
      onUpdateQuantity(index, item.quantity - 1);
    }
  };

  return (
    <div className="flex items-center justify-between py-4 border-b">
      <div className="flex-1">
        {item.type === 'pizza' ? (
          <div>
            <h3 className="font-medium text-pizza-text">{item.pizza.pizza_name}</h3>
            <p className="text-sm text-muted-foreground">Size: {item.size.size_name}</p>
          </div>
        ) : (
          <div>
            <h3 className="font-medium text-pizza-text">{item.beverage.beverage_name}</h3>
          </div>
        )}
      </div>

      <div className="flex items-center space-x-2">
        <Button 
          variant="ghost" 
          size="icon" 
          className="h-8 w-8" 
          onClick={handleDecreaseQuantity}
          disabled={item.quantity <= 1}
        >
          <MinusCircle className="h-5 w-5" />
        </Button>
        <span className="w-8 text-center">{item.quantity}</span>
        <Button 
          variant="ghost" 
          size="icon" 
          className="h-8 w-8" 
          onClick={handleIncreaseQuantity}
        >
          <PlusCircle className="h-5 w-5" />
        </Button>
      </div>

      <div className="w-24 text-right">
        ${(item.price * item.quantity).toFixed(2)}
      </div>

      <Button 
        variant="ghost" 
        size="icon" 
        className="ml-2 text-destructive" 
        onClick={handleRemove}
      >
        <Trash2 className="h-5 w-5" />
      </Button>
    </div>
  );
};

export default CartItem;
