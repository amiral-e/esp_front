"use client"

import Link from "next/link"
import { signUpAction } from "@/actions/oauth"
import { SubmitButton } from "@/components/submit-button"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { GithubSSO } from "@/components/github-sso"
import { ArrowRight, CheckCircle, LockKeyhole, Mail, User } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { toast } from "react-toastify"

export default function SignUpComponent() {

  const register = async (formData: FormData) => {
    const password = formData.get("password") as string
    if (password.length < 8) {
      toast.error("Le mot de passe doit contenir au moins 8 caractères")
      return
    }
    try {
      const response = await signUpAction(formData)
      console.log(response)
      if(response.error) {
        toast.error(response.error)
        return
      }
      toast.success("Votre compte a été créé avec succès !")
    } catch (error) {
      toast.error("Une erreur s'est produite lors de la création de votre compte. Veuillez réessayer.")
    }
  }

  return (
    <div className="flex min-h-screen bg-gradient-to-b from-background to-muted/30">
      <div className="hidden lg:flex w-1/2 bg-primary/10 justify-center items-center p-12 relative overflow-hidden">
        <div className="absolute inset-0 bg-primary/5 backdrop-blur-sm"></div>
        <div className="relative z-10 max-w-xl">
          <div className="bg-primary/10 text-primary text-sm font-medium px-3 py-1 rounded-full w-fit mb-6">
            ComptaCompanion IA
          </div>
          <h1 className="text-4xl font-bold mb-6">Votre assistant comptable intelligent</h1>
          <p className="text-muted-foreground mb-8">
            Rejoignez des milliers de professionnels qui simplifient leur comptabilité grâce à notre plateforme IA.
          </p>

          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <CheckCircle className="h-5 w-5 text-primary mt-0.5" />
              <div>
                <h3 className="font-medium">Gain de temps considérable</h3>
                <p className="text-sm text-muted-foreground">Automatisez l'analyse de vos documents financiers</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <CheckCircle className="h-5 w-5 text-primary mt-0.5" />
              <div>
                <h3 className="font-medium">Insights financiers</h3>
                <p className="text-sm text-muted-foreground">
                  Obtenez des analyses personnalisées et des recommandations
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <CheckCircle className="h-5 w-5 text-primary mt-0.5" />
              <div>
                <h3 className="font-medium">Essai gratuit</h3>
                <p className="text-sm text-muted-foreground">Commencez sans engagement avec notre forfait gratuit</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="w-full lg:w-1/2 flex justify-center items-center p-6 md:p-12">
        <div className="w-full max-w-md">
          <div className="mb-8">
            <h2 className="text-3xl font-bold">Créer un compte</h2>
            <p className="text-muted-foreground mt-2">Commencez votre expérience avec ComptaCompanion IA</p>
          </div>

          <Card className="border-none shadow-md">
            <CardContent className="pt-6">
              <form className="space-y-5" action={register} autoComplete="off">
                <div className="space-y-2">
                  <div className="relative">
                    <User className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                    <Input name="name" placeholder="Nom complet" className="pl-10 h-12" required />
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                    <Input name="email" placeholder="Adresse email" className="pl-10 h-12" required />
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="relative">
                    <LockKeyhole className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                    <Input type="password" name="password" placeholder="Mot de passe" className="pl-10 h-12" required />
                  </div>
                  <p className="text-xs text-muted-foreground">Le mot de passe doit contenir au moins 8 caractères</p>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox id="terms" required />
                  <Label htmlFor="terms" className="text-sm text-muted-foreground">
                    J'accepte les{" "}
                    <a
                      className="text-primary hover:underline"
                      href="/privacy_policy/gcu"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      conditions d'utilisation
                    </a>{" "}
                    et la{" "}
                    <a
                      className="text-primary hover:underline"
                      href="/privacy_policy/confidentiality"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      politique de confidentialité
                    </a>
                  </Label>
                </div>

                <SubmitButton
                  pendingText="Inscription en cours..."
                  className="w-full h-12 bg-primary hover:bg-primary/90"
                  id="sign-up-button"
                >
                  Créer un compte <ArrowRight className="ml-2 h-4 w-4" />
                </SubmitButton>

                <div className="relative my-6">
                  <Separator />
                  <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-background px-2 text-xs text-muted-foreground">
                    ou continuer avec
                  </span>
                </div>

                <GithubSSO />

                <div className="text-center mt-6">
                  <p className="text-sm text-muted-foreground">
                    Déjà inscrit ?{" "}
                    <Link className="text-primary font-medium hover:underline" href="/sign-in" id="sign-in-link">
                      Se connecter
                    </Link>
                  </p>
                </div>
              </form>
            </CardContent>
          </Card>

          <div className="mt-8 text-center">
            <p className="text-xs text-muted-foreground">
              En créant un compte, vous acceptez de recevoir des emails de notre part concernant votre compte et nos
              services.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
