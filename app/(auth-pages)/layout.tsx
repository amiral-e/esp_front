import Header from "@/components/header";

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="w-full">
      <Header />
      <div className="m-16">{children}</div>
    </div>
  );
}
