import { forgotPasswordAction } from "@/app/actions";
import { FormMessage, Message } from "@/components/form-message";
import { SubmitButton } from "@/components/submit-button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { SmtpMessage } from "../smtp-message";

export default async function ForgotPassword(
    props: {
      searchParams: Promise<Message>;
    }
) {
  const searchParams = await props.searchParams;
  return (
      <>
        <form className="flex-1 flex flex-col w-full gap-2 text-foreground [&>input]:mb-6 min-w-64 max-w-64 mx-auto">
          <div>
            <h1 className="text-2xl font-medium" data-cy="forgot-password-heading">Réinitialiser le mot de passe</h1>
            <p className="text-sm text-secondary-foreground">
              Déjà inscrit?{" "}
              <Link className="text-primary underline" href="/sign-in" data-cy="sign-in-link" id="sign-in-link">
                Se connecter
              </Link>
            </p>
          </div>
          <div className="flex flex-col gap-2 [&>input]:mb-3 mt-8">
            <Label htmlFor="email" data-cy="email-label">Email</Label>
            <Input name="email" placeholder="you@example.com" required id="email-input" />
            <SubmitButton formAction={forgotPasswordAction} id="reset-password-button">
              Réinitialiser le mot de passe
            </SubmitButton>
            <FormMessage message={searchParams} />
          </div>
        </form>
        <SmtpMessage />
      </>
  );
}
