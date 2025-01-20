import { fetchCollections } from "@/app/actions/collection-action";
import CollectionsClient from "./layout";

export default async function CollectionsPage() {
    const collections = await fetchCollections();
    return <CollectionsClient initialData={collections.collections || []} />;
}