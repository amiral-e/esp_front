import Header from "@/components/header";
import Hero from "@/components/sections/hero";
import ConnectSupabaseSteps from "@/components/tutorial/connect-supabase-steps";
import SignUpUserSteps from "@/components/tutorial/sign-up-user-steps";
import { hasEnvVars } from "@/utils/supabase/check-env-vars";

export default async function Index() {
  return (
    <>
      <Header />
      <main>
        <Hero />
      </main>
    </>
  );
}
