import { fetchCollections } from "@/app/actions/collection-action";
import CollectionTable from "./_components/CollectionTable";

export const dynamic = "force-dynamic";

export default async function Home() {
  const collections = await fetchCollections();

  if ('error' in collections) {
    return (
      <main className="p-6">
        <p>Erreur lors du chargement des collections</p>
      </main>
    );
  }

  return (
    <main className="p-6">
      <CollectionTable collections={collections.collections} />
    </main>
  );
}
