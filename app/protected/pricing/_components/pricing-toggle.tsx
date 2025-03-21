"use client";

import React from "react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";

interface PricingToggleProps {
  isYearly: boolean;
  onToggle: (isYearly: boolean) => void;
}

const PricingToggle = ({ isYearly, onToggle }: PricingToggleProps) => {
  return (
    <div className="flex flex-col items-center justify-center mb-8">
      <div className="flex items-center space-x-2 mb-2">
        <Label
          htmlFor="billing-toggle"
          className={`${!isYearly ? "font-medium" : "text-muted-foreground"}`}
        >
          Mensuel
        </Label>
        <Switch
          id="billing-toggle"
          checked={isYearly}
          onCheckedChange={onToggle}
        />
        <div className="flex items-center">
          <Label
            htmlFor="billing-toggle"
            className={`${isYearly ? "font-medium" : "text-muted-foreground"}`}
          >
            Annuel
          </Label>
          <Badge
            variant="outline"
            className="ml-2 bg-green-50 text-green-700 border-green-200"
          >
            Économisez 20%
          </Badge>
        </div>
      </div>
      <p className="text-sm text-muted-foreground">
        {isYearly
          ? "Facturation annuelle, payez pour 10 mois au lieu de 12"
          : "Facturation mensuelle, sans engagement"}
      </p>
    </div>
  );
};

export default PricingToggle;
