
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useCart } from '@/contexts/CartContext';

const Header = () => {
  const { items } = useCart();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  const totalItemsCount = items.reduce((total, item) => total + item.quantity, 0);
  
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };
  
  return (
    <header className="sticky top-0 z-40 w-full bg-white shadow-md">
      <div className="pizza-container">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center">
            <span className="text-2xl font-bold text-pizza-primary">
              Rota808
            </span>
          </Link>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link to="/" className="text-pizza-text hover:text-pizza-primary transition-colors">
              Cardápio
            </Link>
            <Link to="/about" className="text-pizza-text hover:text-pizza-primary transition-colors">
              Sobre Nós
            </Link>
            <Link to="/store-info" className="text-pizza-text hover:text-pizza-primary transition-colors">
              Informações da Loja
            </Link>
            <Link to="/order-tracking" className="text-pizza-text hover:text-pizza-primary transition-colors">
              Rastrear Pedido
            </Link>
          </nav>
          
          {/* Cart Button */}
          <div className="flex items-center">
            <Link to="/cart">
              <Button variant="ghost" size="icon" className="relative">
                <ShoppingCart className="h-6 w-6 text-pizza-text" />
                {totalItemsCount > 0 && (
                  <Badge className="absolute -top-2 -right-2 bg-pizza-primary text-white">
                    {totalItemsCount}
                  </Badge>
                )}
              </Button>
            </Link>
            
            {/* Mobile Menu Button */}
            <Button 
              variant="ghost" 
              size="icon" 
              className="md:hidden ml-2"
              onClick={toggleMenu}
            >
              {isMenuOpen ? (
                <X className="h-6 w-6 text-pizza-text" />
              ) : (
                <Menu className="h-6 w-6 text-pizza-text" />
              )}
            </Button>
          </div>
        </div>
        
        {/* Mobile Navigation */}
        {isMenuOpen && (
          <nav className="md:hidden py-4 bg-white border-t">
            <div className="flex flex-col space-y-4">
              <Link 
                to="/" 
                className="text-pizza-text hover:text-pizza-primary transition-colors px-4"
                onClick={() => setIsMenuOpen(false)}
              >
                Cardápio
              </Link>
              <Link 
                to="/about" 
                className="text-pizza-text hover:text-pizza-primary transition-colors px-4"
                onClick={() => setIsMenuOpen(false)}
              >
                Sobre Nós
              </Link>
              <Link 
                to="/store-info" 
                className="text-pizza-text hover:text-pizza-primary transition-colors px-4"
                onClick={() => setIsMenuOpen(false)}
              >
                Informações da Loja
              </Link>
              <Link 
                to="/order-tracking" 
                className="text-pizza-text hover:text-pizza-primary transition-colors px-4"
                onClick={() => setIsMenuOpen(false)}
              >
                Rastrear Pedido
              </Link>
            </div>
          </nav>
        )}
      </div>
    </header>
  );
};

export default Header;
