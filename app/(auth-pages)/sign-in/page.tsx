import Link from "next/link"
import { signInAction } from "@/app/actions"
import { FormMessage, type Message } from "@/components/form-message"
import { SubmitButton } from "@/components/submit-button"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { GithubSSO } from "@/components/github-sso"
import { ArrowRight, CheckCircle, LockKeyhole, Mail } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"

export default async function Login(props: { searchParams: Promise<Message> }) {
  const searchParams = await props.searchParams

  return (
    <div className="flex min-h-screen bg-gradient-to-b from-background to-muted/30">
      <div className="hidden lg:flex w-1/2 bg-primary/10 justify-center items-center p-12 relative overflow-hidden">
        <div className="absolute inset-0 bg-primary/5 backdrop-blur-sm"></div>
        <div className="relative z-10 max-w-xl">
          <div className="bg-primary/10 text-primary text-sm font-medium px-3 py-1 rounded-full w-fit mb-6">
            ComptaCompanion IA
          </div>
          <h1 className="text-4xl font-bold mb-6">Simplifiez votre comptabilité avec l'intelligence artificielle</h1>
          <p className="text-muted-foreground mb-8">
            Téléchargez vos documents financiers et obtenez des réponses instantanées, des analyses et de l'aide grâce à
            notre chat intelligent.
          </p>

          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <CheckCircle className="h-5 w-5 text-primary mt-0.5" />
              <div>
                <h3 className="font-medium">Analyse intelligente</h3>
                <p className="text-sm text-muted-foreground">
                  Notre IA analyse vos documents et extrait les informations clés automatiquement
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <CheckCircle className="h-5 w-5 text-primary mt-0.5" />
              <div>
                <h3 className="font-medium">Réponses instantanées</h3>
                <p className="text-sm text-muted-foreground">
                  Posez des questions en langage naturel et obtenez des réponses précises
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <CheckCircle className="h-5 w-5 text-primary mt-0.5" />
              <div>
                <h3 className="font-medium">Sécurité garantie</h3>
                <p className="text-sm text-muted-foreground">
                  Vos données sont protégées par un chiffrement de niveau bancaire
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="w-full lg:w-1/2 flex justify-center items-center p-6 md:p-12">
        <div className="w-full max-w-md">
          <div className="mb-8">
            <h2 className="text-3xl font-bold">Connexion</h2>
            <p className="text-muted-foreground mt-2">Bienvenue ! Connectez-vous pour accéder à votre compte.</p>
          </div>

          <Card className="border-none shadow-md">
            <CardContent className="pt-6">
              <form className="space-y-5" action={signInAction}>
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
                  <div className="flex justify-end">
                    <Link className="text-xs text-primary hover:underline" href="/forgot-password">
                      Mot de passe oublié ?
                    </Link>
                  </div>
                </div>

                <SubmitButton
                  pendingText="Connexion en cours..."
                  className="w-full h-12 bg-primary hover:bg-primary/90"
                >
                  Se connecter <ArrowRight className="ml-2 h-4 w-4" />
                </SubmitButton>

                <FormMessage message={searchParams} />

                <div className="relative my-6">
                  <Separator />
                  <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-background px-2 text-xs text-muted-foreground">
                    ou continuer avec
                  </span>
                </div>

                <GithubSSO />

                <div className="text-center mt-6">
                  <p className="text-sm text-muted-foreground">
                    Pas encore de compte ?{" "}
                    <Link className="text-primary font-medium hover:underline" href="/sign-up">
                      S'inscrire
                    </Link>
                  </p>
                </div>
              </form>
            </CardContent>
          </Card>

          <div className="mt-8 text-center">
            <p className="text-xs text-muted-foreground">
              En vous connectant, vous acceptez nos{" "}
              <Link href="/terms" className="text-primary hover:underline">
                Conditions d'utilisation
              </Link>{" "}
              et notre{" "}
              <Link href="/privacy" className="text-primary hover:underline">
                Politique de confidentialité
              </Link>
              .
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}