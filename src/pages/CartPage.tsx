
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '@/contexts/CartContext';
import CartItem from '@/components/CartItem';
import { Button } from '@/components/ui/button';
import { ShoppingBag, ArrowLeft } from 'lucide-react';

const CartPage: React.FC = () => {
  const { items, totalPrice, removeItemFromCart, updateItemQuantity, clearCart } = useCart();
  const navigate = useNavigate();
  
  const handleCheckout = () => {
    if (items.length > 0) {
      navigate('/checkout');
    }
  };
  
  const deliveryFee = 3.99;
  const finalTotal = totalPrice + deliveryFee;
  
  return (
    <div className="pizza-container py-8">
      <h1 className="text-3xl font-bold text-center mb-6">Seu Carrinho</h1>
      
      {items.length === 0 ? (
        <div className="text-center py-10">
          <ShoppingBag className="mx-auto h-16 w-16 text-muted-foreground mb-4" />
          <h2 className="text-2xl font-semibold mb-2">Seu carrinho está vazio</h2>
          <p className="text-muted-foreground mb-6">
            Parece que você ainda  não adicinou nada ao carrinho.
          </p>
          <Button 
            onClick={() => navigate('/')}
            className="bg-pizza-primary hover:bg-pizza-primary/90"
          >
            Navegar no Menu
          </Button>
        </div>
      ) : (
        <div className="pizza-card p-6">
          <div className="divide-y">
            {items.map((item, index) => (
              <CartItem
                key={index}
                item={item}
                index={index}
                onRemove={removeItemFromCart}
                onUpdateQuantity={updateItemQuantity}
              />
            ))}
          </div>
          
          <div className="mt-6 pt-6 border-t">
            <div className="flex justify-between items-center mb-4">
              <span className="text-lg font-medium">Subtotal</span>
              <span className="text-lg font-medium">R${totalPrice.toFixed(2)}</span>
            </div>
            <div className="flex justify-between items-center mb-4 text-muted-foreground">
              <span>Taxa de Entrega</span>
              <span>R${deliveryFee.toFixed(2)}</span>
            </div>
            <div className="flex justify-between items-center mb-6 text-xl font-bold">
              <span>Total</span>
              <span>R${finalTotal.toFixed(2)}</span>
            </div>
            
            <div className="flex flex-col sm:flex-row justify-between gap-4">
              <Button
                variant="outline"
                className="flex items-center"
                onClick={() => navigate('/')}
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Continue comprando
              </Button>
              
              <div className="flex gap-3">
                <Button
                  variant="outline"
                  className="text-destructive hover:text-destructive"
                  onClick={() => clearCart()}
                >
                  Esvaziar Carrinho
                </Button>
                
                <Button
                  className="bg-pizza-primary hover:bg-pizza-primary/90"
                  onClick={handleCheckout}
                >
                  Checkout
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CartPage;
