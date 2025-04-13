import React from "react";

const AboutPage: React.FC = () => {
  return (
    <div className="pizza-container py-12">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-8 text-pizza-text">
          Sobre Nós
        </h1>

        <div className="pizza-card p-8 mb-10">
          <h2 className="text-2xl font-semibold mb-4 text-pizza-primary">
            Nossa História
          </h2>
          <p className="mb-4">
            A Rota808 começou em 2010 com uma missão simples: criar pizzas
            deliciosas e autênticas usando apenas os ingredientes mais frescos e
            receitas tradicionais passadas por gerações.
          </p>
          <p className="mb-4">
            O que começou como uma pequena pizzaria familiar se transformou em
            um dos restaurantes de pizza mais queridos da região, conhecido pelo
            nosso compromisso com a qualidade e sabor excepcional.
          </p>
          <p>
            Apesar do nosso crescimento, nunca abrimos mão dos nossos valores.
            Cada pizza ainda é feita com o mesmo cuidado e atenção aos detalhes
            de quando começamos.
          </p>
        </div>

        <div className="pizza-card p-8 mb-10">
          <h2 className="text-2xl font-semibold mb-4 text-pizza-primary">
            Nossos Ingredientes
          </h2>
          <p className="mb-4">
            Acreditamos que uma ótima pizza começa com ótimos ingredientes. É
            por isso que:
          </p>
          <ul className="list-disc pl-6 mb-4 space-y-2">
            <li>Compramos nossos tomates de agricultores locais</li>
            <li>
              Preparamos nossa massa fresca diariamente com uma receita especial
            </li>
            <li>Usamos apenas queijos de primeira qualidade</li>
            <li>Selecionamos os vegetais mais frescos e as melhores carnes</li>
          </ul>
          <p>
            Nunca usamos conservantes ou sabores artificiais, porque acreditamos
            que comida de verdade tem um sabor melhor.
          </p>
        </div>

        <div className="pizza-card p-8">
          <h2 className="text-2xl font-semibold mb-4 text-pizza-primary">
            Nossa Promessa
          </h2>
          <p className="mb-4">
            Cada pizza que fazemos reflete nossa paixão e compromisso com a
            qualidade. Seja para comer no local, levar ou pedir entrega,
            prometemos oferecer:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Sabor excepcional em cada mordida</li>
            <li>Atendimento amigável e atencioso</li>
            <li>Pizza quente e fresca entregue rapidamente</li>
            <li>Um cardápio com opções para todos os gostos</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;
