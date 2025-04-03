import Link from "next/link"
import { signInAction } from "@/app/actions"
import { FormMessage, type Message } from "@/components/form-message"
import { SubmitButton } from "@/components/submit-button"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { GithubSSO } from "@/components/github-sso"

export default async function Login(props: { searchParams: Promise<Message> }) {
  const searchParams = await props.searchParams
  return (
    <div className="flex-grow flex justify-center items-center md:flex-row w-full max-w-12lg mx-auto p-8">
      <form className="flex-[0.7] flex flex-col space-y-4 p-4 ml-4">
        <h1 className="text-2xl text-orange-500 font-medium">Se connecter</h1>
        <p className="text-sm text-foreground">
          Pas encore de compte?{" "}
          <Link className="text-foreground font-medium underline" href="/sign-up" id="sign-up-link">
            S'inscrire
          </Link>
        </p>
        <div className="flex flex-col gap-2 [&>input]:mb-3 mt-8">
          <Input name="email" placeholder="you@example.com" className="w-full" required/>
          <div className="flex justify-between items-center">
            <Link
                className="text-xs text-foreground underline"
                href="/forgot-password"
                id="forgot-password-link"
            >
              Mot de passe oublié?
            </Link>
          </div>
          <Input
              className="w-full"
              type="password"
              name="password"
              placeholder="Your password"
              required
          />
          <SubmitButton pendingText="Connexion..." formAction={signInAction} id="sign-in-button">
            Se connecter
          </SubmitButton>
          <FormMessage message={searchParams} />

          <Separator/>
          <p className="text-sm text-foreground">
            Ou se connecter avec SSO :
          </p>
          <GithubSSO />
        </div>
      </form>

      <div className="hidden md:flex flex-1 justify-center items-center bg-[#f5f3ef] p-12 ml-12 rounded-lg max-w-24lg">
        <div className="text-sm">
          <h2 className="font-medium">ComptaCompanion</h2>
          <p className="text-gray-600 mt-2">Exploitez toute la puissance de notre IA comptable</p>
          <div className="mt-6 border p-4 bg-white rounded-lg">
            <img
              src="https://framerusercontent.com/images/EDnGwSW85QvFiX5QkrMo3rIv8.png?scale-down-to=1024"
              alt="login"
              className="mt-4 w-full h-full object-cover"
            />
          </div>
        </div>
      </div>
    </div>
  )
}