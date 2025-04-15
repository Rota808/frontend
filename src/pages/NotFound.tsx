
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Pizza } from 'lucide-react';

const NotFound = () => {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center bg-background">
      <div className="text-center">
        <Pizza className="h-24 w-24 mx-auto mb-4 text-pizza-primary" />
        <h1 className="text-4xl font-bold mb-4 text-pizza-text">404</h1>
        <p className="text-xl text-muted-foreground mb-6">
          Oops! We couldn't find the page you're looking for.
        </p>
        <p className="text-muted-foreground mb-8">
          The page might have been moved or deleted,
          <br /> or maybe you just got the wrong address.
        </p>
        <Link to="/">
          <Button className="bg-pizza-primary hover:bg-pizza-primary/90">
            Return to Menu
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
