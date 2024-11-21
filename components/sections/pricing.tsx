import React from "react";
import PricingCard from "../pricing-card";

const pricingCards = [
  {
    title: "Basic",
    price: "9,99€",
    description: "Pour les entreprises de petite taille",
    features: ["1000 factures", "1000 clients", "1000 fournisseurs"],
  },
  {
    title: "Premium",
    price: "99€",
    description: "Pour les entreprises de taille moyenne",
    features: ["1000 factures", "1000 clients", "1000 fournisseurs"],
  },
  {
    title: "Entreprise",
    price: "999€",
    description: "Pour les entreprises de grande taille",
    features: ["1000 factures", "1000 clients", "1000 fournisseurs"],
  },
];

const Pricing = () => {
  return (
    <div className="w-full flex items-center justify-around">
      {pricingCards.map((card, index) => (
        <PricingCard
          key={index}
          title={card.title}
          price={card.price}
          description={card.description || ""}
          features={card.features}
        />
      ))}
    </div>
  );
};

export default Pricing;
