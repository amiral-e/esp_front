import { signOutAction } from "@/actions/auth.actions";
import { hasEnvVars } from "@/utils/supabase/check-env-vars";
import Link from "next/link";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { createClient } from "@/utils/supabase/server";

export default async function AuthButton() {
  const user = await (await await createClient()).auth.getUser();
  if (!hasEnvVars) {
    return (
      <nav>
        <div className="flex gap-4 items-center">
          <div>
            <Badge
              variant={"default"}
              className="font-normal pointer-events-none"
            >
              Please update .env.local file with anon key and url
            </Badge>
          </div>
          {user && (
            <div className="flex gap-2">
              <Button
                asChild
                variant={"outline"}
                disabled
                className="opacity-75 cursor-none pointer-events-none"
              >
                <Link href="/sign-in">Sign in</Link>
              </Button>
              <Button
                asChild
                variant={"default"}
                disabled
                className="opacity-75 cursor-none pointer-events-none"
              >
                <Link href="/sign-up">Sign up</Link>
              </Button>
            </div>
          )}
        </div>
      </nav>
    );
  }
  return user ? (
    <div className="flex items-center gap-4">
      {/* Hey, {user}! */}
      <form action={signOutAction}>
        <Button type="submit" variant={"outline"}>
          Log Out
        </Button>
      </form>
    </div>
  ) : (
    <div className="flex gap-2">
      <Button asChild size="sm" variant={"outline"}>
        <Link href="/sign-in">Sign in</Link>
      </Button>
      <Button asChild size="sm" variant={"default"}>
        <Link href="/sign-up">Sign up</Link>
      </Button>
    </div>
  );
}
