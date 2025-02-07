import { EnvVarWarning } from "./env-var-warning";
import NavigationMenuWrapper from "./navigationMenuWrapper";
import { Logo } from "./logo";
import NextLogo from "./next-logo";
import SupabaseLogo from "./supabase-logo";

export default function Header() {
  return (
    <div>
      <nav className="w-full flex border-b border-b-foreground/10 h-16">
        <div className="w-full flex justify-between items-center p-3 px-5 text-sm">
          <div className="flex gap-5 items-center font-semibold">
            <Logo />
            <div className="flex items-center gap-2">
              <NavigationMenuWrapper />
            </div>
          </div>
          <EnvVarWarning />
        </div>
      </nav>
      <div className="flex flex-col gap-16 items-center">
        <div className="flex gap-8 justify-center items-center">
          <a
            href="https://supabase.com/?utm_source=create-next-app&utm_medium=template&utm_term=nextjs"
            target="_blank"
            rel="noreferrer"
          >
            <SupabaseLogo />
          </a>
          <span className="border-l rotate-45 h-6" />
          <a href="https://nextjs.org/" target="_blank" rel="noreferrer">
            <NextLogo />
          </a>
        </div>
        <h1 className="sr-only">Supabase and Next.js Starter Template</h1>
        <p className="text-3xl lg:text-4xl !leading-tight mx-auto max-w-xl text-center">
          The fastest way to build apps with{" "}
          <a
            href="https://supabase.com/?utm_source=create-next-app&utm_medium=template&utm_term=nextjs"
            target="_blank"
            className="font-bold hover:underline"
            rel="noreferrer"
          >
            Supabase
          </a>{" "}
          and{" "}
          <a
            href="https://nextjs.org/"
            target="_blank"
            className="font-bold hover:underline"
            rel="noreferrer"
          >
            Next.js
          </a>
        </p>
        <div className="w-full p-[1px] bg-gradient-to-r from-transparent via-foreground/10 to-transparent my-8" />
      </div>
    </div>
  );
}
