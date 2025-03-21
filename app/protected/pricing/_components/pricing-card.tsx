import React from "react";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface PricingCardProps {
  title: string;
  price: number;
  description: string;
  features: string[];
  popular?: boolean;
  priceId: string;
  onSelectPlan: (priceId: string) => void;
  buttonText?: string;
}

const PricingCard = ({
  title,
  price,
  description,
  features,
  popular = false,
  priceId,
  onSelectPlan,
  buttonText = "Choisir ce plan",
}: PricingCardProps) => {
  return (
    <Card
      className={`w-full flex flex-col ${popular ? "border-primary shadow-lg" : "border-border"}`}
    >
      <CardHeader>
        {popular && (
          <Badge className="w-fit mb-2" variant="secondary">
            Recommandé
          </Badge>
        )}
        <CardTitle className="text-xl font-bold">{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="flex-grow">
        <div className="flex items-baseline mb-4">
          <span className="text-3xl font-bold">{price}€</span>
          <span className="text-muted-foreground ml-1">/mois</span>
        </div>
        <ul className="space-y-2">
          {features.map((feature, index) => (
            <li key={index} className="flex items-center">
              <Check className="h-4 w-4 text-primary mr-2" />
              <span className="text-sm">{feature}</span>
            </li>
          ))}
        </ul>
      </CardContent>
      <CardFooter>
        <Button
          onClick={() => onSelectPlan(priceId)}
          className="w-full"
          variant={popular ? "default" : "outline"}
        >
          {buttonText}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default PricingCard;
