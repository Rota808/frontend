
import React from 'react';
import { Link } from 'react-router-dom';
import { Facebook, Instagram, Twitter } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-pizza-accent text-white">
      <div className="pizza-container py-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-xl font-bold mb-4">OrderUp Pizza</h3>
            <p className="mb-4">
              Delicious pizza delivered right to your doorstep. Fresh ingredients, amazing flavors.
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
            <h3 className="text-lg font-bold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="hover:text-pizza-secondary">
                  Menu
                </Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-pizza-secondary">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/store-info" className="hover:text-pizza-secondary">
                  Store Info
                </Link>
              </li>
              <li>
                <Link to="/order-tracking" className="hover:text-pizza-secondary">
                  Track Order
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-bold mb-4">Contact Us</h3>
            <p className="mb-2">123 Pizza Street</p>
            <p className="mb-2">New York, NY 10001</p>
            <p className="mb-2">Phone: (555) 123-4567</p>
            <p>Email: info@orderup.com</p>
          </div>
        </div>
        
        <div className="mt-8 pt-6 border-t border-white/20 text-center">
          <p>&copy; {new Date().getFullYear()} OrderUp Pizza. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
