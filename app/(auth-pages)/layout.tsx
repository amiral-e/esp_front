import { ThemeProvider } from "../components/theme-provider";

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
      <div className="max-w-7xl flex flex-col gap-12 items-start">{children}</div>
    </ThemeProvider>
  );
}
