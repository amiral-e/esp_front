import { resetPasswordAction } from "@/actions/auth.actions";
import { FormMessage, Message } from "@/components/form-message";
import { SubmitButton } from "@/components/submit-button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default async function ResetPassword(props: {
  searchParams: Promise<Message>;
}) {
  const searchParams = await props.searchParams;
  return (
    <form className="flex flex-col w-full max-w-md p-4 gap-2 [&>input]:mb-4">
      <h1 className="text-2xl font-medium">Réinitialiser le mot de passe</h1>
      <p className="text-sm text-foreground/60">
        Entrez le nouveau mot de passe ci-dessous.
      </p>
      <Label htmlFor="password">Nouveau mot de passe</Label>
      <Input
        type="password"
        name="password"
        placeholder="New password"
        required
      />
      <Label htmlFor="confirmPassword">Confirmez le mot de passe</Label>
      <Input
        type="password"
        name="confirmPassword"
        placeholder="Confirm password"
        required
      />
      <SubmitButton formAction={resetPasswordAction}>
        Réinitialiser le mot de passe
      </SubmitButton>
      <FormMessage message={searchParams} />
    </form>
  );
}
