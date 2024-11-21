
import Link from "next/link";
import { signInAction } from "@/app/actions";
import { FormMessage, Message } from "@/components/form-message";
import { SubmitButton } from "@/components/submit-button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator"
import { GithubSSO } from '@/components/github-sso'


export default async function Login(props: { searchParams: Promise<Message> }) {
  const searchParams = await props.searchParams;
  return (
    <div className="flex flex-col md:flex-row w-full max-w-12lg mx-auto p-8">
      <form className="flex-[0.7] flex flex-col space-y-4 p-4 ml-4">
        <h1 className="text-2xl text-orange-500 font-medium">Login</h1>
        <p className="text-sm text-foreground">
          Don't have an account?{" "}
          <Link className="text-foreground font-medium underline" href="/sign-up">
            Sign in
          </Link>
        </p>
        <div className="flex flex-col gap-2 [&>input]:mb-3 mt-8">
          <Input variant="outline" size="md" name="email" placeholder="you@example.com" className="w-full" required/>
          <div className="flex justify-between items-center">
            <Link
                className="text-xs text-foreground underline"
                href="/forgot-password"
            >
              Forgot Password?
            </Link>
          </div>
          <Input
              variant="outline"
              size="md"
              type="password"
              name="password"
              placeholder="Your password"
              required
          />
          <SubmitButton pendingText="Signing In..." formAction={signInAction}>
            Se connecter
          </SubmitButton>
          <FormMessage message={searchParams}/>


          <Separator/>
          <p className="text-sm text-foreground">
            Or sign in with SSO :
          </p>
          <GithubSSO />
        </div>
      </form>

      <div className="hidden md:flex flex-1 justify-center items-center bg-[#f5f3ef] p-12 ml-12 rounded-lg max-w-24lg">
        <div className="text-sm">
          <h2 className="font-medium">Finmate</h2>
          <p className="text-gray-600 mt-2">Débloquer toute la puissance d'une IA comptable</p>
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
);
}



{/* <div className="flex flex-col md:flex-row w-full max-w-12lg mx-auto p-8">
      <div className="flex-[0.7] flex flex-col space-y-4 p-4 ml-4">
        <p className="text-2sm font-semibold text-orange-500">REGISTER</p>
        <h1 className="text-3xl font-semibold text-black">Commencez maintenant !</h1>
        <br />
        <div className="space-y-2">
          <Input variant="outline" size="md" name="name" placeholder="Nom" className="w-full" required />
        </div>
        <div className="space-y-2">
          <Input variant="outline" size="md" name="email" placeholder="Email" className="w-full" required />
        </div>
        <div className="space-y-2">
          <Input variant="outline" size="md" type="password" name="password" placeholder="Mot de passe" className="w-full" required />
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
              <input type="checkbox" id="remember" className="rounded" />
              <Label className="text-sm" htmlFor="remember">Se souvenir</Label>
          </div>
          <Link className="text-xs text-orange-500 underline" href="/forgot-password">
              Mot de passe oublié
          </Link>
        </div>
        <SubmitButton pendingText="Signing Up..." formAction={signInAction} className="bg-orange-500 text-white w-full py-2">
          S'inscrire
        </SubmitButton>
        <FormMessage message={searchParams} />

        <Separator/>
        <p className="text-sm text-foreground">
          Or sign in with SSO :
        </p>
        <GithubSSO />

        <p className="text-sm text-center text-gray-600 mt-4">
          Déjà inscrit ?{" "}
          <Link className="text-orange-500 font-medium" href="/login">
            Se connecter
          </Link>
        </p>
      </div>

      <div className="hidden md:flex flex-1 justify-center items-center bg-[#f5f3ef] p-12 ml-12 rounded-lg max-w-24lg">
        <div className="text-sm">
          <h2 className="font-medium">Finmate</h2>
          <p className="text-gray-600 mt-2">Débloquer toute la puissance d'une IA comptable</p>
          <div className="mt-6 border p-4 bg-white rounded-lg">
            <img
              src="https://framerusercontent.com/images/EDnGwSW85QvFiX5QkrMo3rIv8.png?scale-down-to=1024"
              alt="login"
              className="mt-4 w-full h-full object-cover"
            />
          </div>
        </div>
      </div>
    </div> */}