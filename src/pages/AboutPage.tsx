
import React from 'react';

const AboutPage: React.FC = () => {
  return (
    <div className="pizza-container py-12">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-8 text-pizza-text">About Us</h1>
        
        <div className="pizza-card p-8 mb-10">
          <h2 className="text-2xl font-semibold mb-4 text-pizza-primary">Our Story</h2>
          <p className="mb-4">
            OrderUp Pizza started in 2010 with a simple mission: to create delicious, 
            authentic pizzas using only the freshest ingredients and traditional recipes 
            handed down through generations.
          </p>
          <p className="mb-4">
            What began as a small family-run pizzeria has now grown into one of the most 
            beloved pizza restaurants in the area, known for our commitment to quality 
            and exceptional taste.
          </p>
          <p>
            Despite our growth, we've never compromised on our values. Every pizza is 
            still made with the same care and attention to detail as when we first opened.
          </p>
        </div>
        
        <div className="pizza-card p-8 mb-10">
          <h2 className="text-2xl font-semibold mb-4 text-pizza-primary">Our Ingredients</h2>
          <p className="mb-4">
            We believe that great pizza starts with great ingredients. That's why we:
          </p>
          <ul className="list-disc pl-6 mb-4 space-y-2">
            <li>Source our tomatoes from local farmers</li>
            <li>Make our dough fresh daily using our special recipe</li>
            <li>Use only premium cheeses</li>
            <li>Select the freshest vegetables and finest meats</li>
          </ul>
          <p>
            We never use preservatives or artificial flavors, because we believe that 
            real food tastes better.
          </p>
        </div>
        
        <div className="pizza-card p-8">
          <h2 className="text-2xl font-semibold mb-4 text-pizza-primary">Our Promise</h2>
          <p className="mb-4">
            Every pizza we make is a reflection of our passion and commitment to quality. 
            Whether you're dining in, carrying out, or ordering delivery, we promise to provide:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Exceptional taste in every bite</li>
            <li>Friendly, responsive service</li>
            <li>Hot, fresh pizza delivered quickly</li>
            <li>A menu that offers something for everyone</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;
