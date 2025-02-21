import { fetchCollections } from "@/app/actions/collection-action";
import CollectionTable from "./_components/CollectionTable";

export default async function Home() {
  const collections = await fetchCollections();

  if ('error' in collections) {
    return (
      <main className="p-6">
        <p>Error loading collections</p>
      </main>
    );
  }

  return (
    <main className="p-6">
      <CollectionTable collections={collections.collections} />
    </main>
  );
}
