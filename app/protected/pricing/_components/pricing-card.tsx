"use client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface PricingCardProps {
  title: string
  price: number
  description: string
  popular?: boolean
  onSelectPlan: (price: string) => void
  buttonText?: string
  disabled?: boolean
}

const PricingCard = ({
  title,
  price,
  description,
  popular = false,
  onSelectPlan,
  buttonText = "Ajouter crédit",
  disabled = false,
}: PricingCardProps) => {
  return (
    <Card className={`w-full flex flex-col ${popular ? "border-primary shadow-lg" : "border-border"}`}>
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
        <div className="flex items-baseline justify-center mb-4">
          <span className="text-3xl font-bold">{price}€</span>
          {/* <span className="text-muted-foreground ml-1"></span> */}
        </div>
      </CardContent>
      <CardFooter>
        <Button
          onClick={() => onSelectPlan(title)}
          className="w-full"
          variant={popular ? "default" : "outline"}
          disabled={disabled}
        >
          {buttonText}
        </Button>
      </CardFooter>
    </Card>
  )
}

export default PricingCard