"use client";

import { Collections, createCollection, fetchCollections } from "@/app/actions/collection-action";
import { DataTable } from "./data-table";
import { columns } from "./_components/columns";
import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";

interface CollectionsClientProps {
    initialData: Collections[];
}

export default function CollectionsClient({ initialData }: CollectionsClientProps) {
    const [data, setData] = useState<Collections[]>(initialData);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const collections = await fetchCollections();
                if (collections?.collections) {
                    setData(collections.collections);
                }
            } catch (error) {
                console.error("Error fetching collections:", error);
            }
        };
        fetchData();
    }, []);

    return (
        <div className="container mx-auto py-10">
            <DataTable columns={columns} data={data} />
        </div>
    );
}
