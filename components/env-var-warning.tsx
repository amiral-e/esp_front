import Link from "next/link";
import { cookies } from "next/headers";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";

export async function EnvVarWarning() {
  const cookieStore = cookies();
  const token = (await cookieStore).get("auth_token")?.value ?? null;

  if (token) return null;

  return (
    <div className="flex gap-4 items-center">
      <div className="flex gap-2">
        <Button
          asChild
          size="sm"
          variant="outline"
          className="opacity-75 cursor-none pointer-events-none"
          disabled
        >
          <Link href="/sign-in">Sign in</Link>
        </Button>
        <Button
          asChild
          size="sm"
          variant="default"
          className="opacity-75 cursor-none pointer-events-none"
          disabled
        >
          <Link href="/sign-up">Sign up</Link>
        </Button>
      </div>
    </div>
  );
}