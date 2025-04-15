import React from "react";
import { Link } from "react-router-dom";
import { Facebook, Instagram, Twitter } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-pizza-accent text-white">
      <div className="pizza-container py-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-xl font-bold mb-4">Rota808</h3>
            <p className="mb-4">
              Pizza deliciosa entregue diretamente em sua porta. Ingredientes
              frescos, sabores incríveis.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="hover:text-pizza-secondary">
                <Facebook />
              </a>
              <a href="#" className="hover:text-pizza-secondary">
                <Instagram />
              </a>
              <a href="#" className="hover:text-pizza-secondary">
                <Twitter />
              </a>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-bold mb-4">Links Rápidos</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="hover:text-pizza-secondary">
                  Cardápio
                </Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-pizza-secondary">
                  Sobre Nós
                </Link>
              </li>
              <li>
                <Link to="/store-info" className="hover:text-pizza-secondary">
                  Informações da Loja
                </Link>
              </li>
              <li>
                <Link
                  to="/order-tracking"
                  className="hover:text-pizza-secondary"
                >
                  Rastrear Pedido
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-bold mb-4">Contato</h3>
            <p className="mb-2">Rua da Pizza, 123</p>
            <p className="mb-2">São Paulo, SP 01001</p>
            <p className="mb-2">Telefone: (11) 5555-1234</p>
            <p>Email: contato@rota808.com</p>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-white/20 text-center">
          <p>
            &copy; {new Date().getFullYear()} Rota808. Todos os direitos
            reservados.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
