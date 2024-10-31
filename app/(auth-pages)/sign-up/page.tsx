import { signUpAction } from "@/app/actions";
import { FormMessage, Message } from "@/components/form-message";
import { SubmitButton } from "@/components/submit-button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { Separator } from "@/components/ui/separator";
import { GithubSSO } from "@/components/github-sso";

export default async function Signup(props: {
  searchParams: Promise<Message>;
}) {
  const searchParams = await props.searchParams;
  if ("message" in searchParams) {
    return (
      <div className="w-full flex-1 flex items-center h-screen sm:max-w-md justify-center gap-2 p-4">
        <FormMessage message={searchParams} />
      </div>
    );
  }

  return (
    <>
      <form className="flex flex-col min-w-64 max-w-96 mx-auto">
        <h1 className="text-3xl">Commencez dès maintenant !</h1>
        <p className="text-sm text text-foreground">
          Déjà un compte ?{" "}
          <Link className="text-primary font-medium underline" href="/sign-in">
            Se connecter
          </Link>
        </p>
        <div className="flex flex-col gap-2 [&>input]:mb-3 mt-8">
          <Label htmlFor="email">Email</Label>
          <Input
            name="email"
            placeholder="you@example.com"
            required
            className="bg-secondary rounded-full py-4"
          />
          <Label htmlFor="password">Mot de passe</Label>
          <Input
            type="password"
            name="password"
            placeholder="Your password"
            className="bg-secondary rounded-full py-4"
            minLength={6}
            required
          />
          <SubmitButton formAction={signUpAction} pendingText="Signing up...">
            S'inscrire
          </SubmitButton>
          <FormMessage message={searchParams} />

          <Separator />

          {/* <p className="text-sm text-foreground">Or sign up with SSO :</p>
          <GithubSSO /> */}
        </div>
      </form>
    </>
  );
}
