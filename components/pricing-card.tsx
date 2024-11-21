import React from "react";
import { Separator } from "./ui/separator";
import { CheckCircleIcon, CheckIcon } from "lucide-react";

interface PricingCardProps {
  title: string;
  price: string;
  description: string;
  features: string[];
}

const PricingCard = ({
  title,
  price,
  description,
  features,
}: PricingCardProps) => {
  return (
    <div className="flex flex-col space-y-4 p-4 border-2 border-primary rounded-lg border-b-4 border-b-primary w-1/5 h-auto justify-between">
      <div className="space-y-2">
        <h1 className="text-sm text-muted-foreground">{title}</h1>
        <p className="text-4xl font-bold">
          {price} <span className="text-sm text-muted-foreground">/mois</span>
        </p>
        <p className="text-md text-muted-foreground">{description}</p>
      </div>
      <h1 className="text-muted-foreground place-self-center">Features</h1>
      <ul className="space-y-4">
        {features.map((feature) => (
          <>
            <li key={feature} className="flex items-center">
              <CheckCircleIcon className="w-4 h-4 mr-2" />
              {feature}
            </li>
          </>
        ))}
      </ul>
    </div>
  );
};

export default PricingCard;
