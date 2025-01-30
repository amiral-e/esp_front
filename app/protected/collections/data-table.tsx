"use client"

import {
    ColumnDef,
    ColumnFiltersState,
    flexRender,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    SortingState,
    useReactTable,
} from "@tanstack/react-table"

import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import React, { useState } from "react"
import { Input } from "@/components/ui/input"
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { createCollection, fetchCollections } from "@/app/actions/collection-action"
import { deleteDocument, Doc, fetchDocumentByCollection } from "@/app/actions/document-action"
import { TrashIcon } from "lucide-react"
import { toast } from "@/hooks/use-toast"

interface DataTableProps<TData, TValue> {
    columns: ColumnDef<TData, TValue>[]
    data: TData[]
}

export function DataTable<TData, TValue>({
    columns,
    data,
}: Readonly<DataTableProps<TData, TValue>>) {
    const [dataState, setDataState] = React.useState<TData[]>(data || []);
    const [sorting, setSorting] = React.useState<SortingState>([])
    const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
        []
    )
    const table = useReactTable({
        data: dataState,
        columns,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        onSortingChange: setSorting,
        getSortedRowModel: getSortedRowModel(),
        onColumnFiltersChange: setColumnFilters,
        getFilteredRowModel: getFilteredRowModel(),
        state: {
            sorting,
            columnFilters,
        },
    })
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [newTitle, setNewTitle] = useState("");
    const [collection, setCollection] = useState<Doc | null>(null);
    const [files, setFiles] = useState<File[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedCollection, setSelectedCollection] = useState<string | null>(null);
    const [status, setStatus] = useState<string | null>(null);

    const handleCreateCollection = async () => {
        try {
            const creation = await createCollection(newTitle, files);
            setNewTitle("");
            setFiles([]);
            setIsDialogOpen(false);
            // Refresh the data after creating a new collection
            const updatedCollections = await fetchCollections();
            if (updatedCollections?.collections) {
                setDataState(updatedCollections.collections as TData[]);
            }
            if(isModalOpen && selectedCollection && status) {
                getDocumentByCollection(selectedCollection, status);
            }
            toast({
                title: "Collection Created",
                description: JSON.stringify(creation.response),
                variant: "default",
            });
        } catch (error) {
            console.error("Error creating collection:", error);
        }
    };

    const handleRowClick = (name: string, status: string) => {
        getDocumentByCollection(name, status);
        setIsModalOpen(true);
        setSelectedCollection(name);
        setStatus(status);
    };

    // const closeModal = () => {
    //     setIsModalOpen(false);
    //     setCollection(null);
    // };

    const getDocumentByCollection = async (collection: string, status: string) => {
        try {
            const documentData = await fetchDocumentByCollection(collection, status);
            if ('error' in documentData) {
                console.error("Error fetching document:", documentData.error);
                // Check if the error is specifically "Collection not found"
                if (documentData.error === "Collection not found") {
                    setCollection(null); // Set the collection state to null
                }
                return;
            }
            setCollection(documentData);
        } catch (error) {
            setCollection(null);
        }
    };

    const handleDelete = async (collection: Doc, doc_id: string) => {
        try {
            const deletedDoc = await deleteDocument(collection, doc_id);
            // refresh data after deletion
            if (selectedCollection && status) {
                await getDocumentByCollection(selectedCollection, status);
            }
            toast({
                title: "Document Deleted",
                description: JSON.stringify(deletedDoc),
                variant: "default",
            });
        } catch (error) {
            toast({
                title: "Error Deleting Document",
                description: JSON.stringify(error),
                variant: "destructive",
            });
            console.error("Error deleting document:", error);
        }
    }

    return (
        <div>
            <div className="flex items-center py-4">
                <Input
                    placeholder="Filter Names..."
                    value={(table.getColumn("name")?.getFilterValue() as string) ?? ""}
                    onChange={(event) =>
                        table.getColumn("name")?.setFilterValue(event.target.value)
                    }
                    className="max-w-sm"
                />
                <Button
                    id="ingest-documents-button"
                    type="button"
                    variant="outline" className="ml-auto"
                    onClick={() => {
                        setIsDialogOpen(true)
                    }}
                >
                    Ingest Document
                </Button>
            </div>
            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id}>
                                {headerGroup.headers.map((header) => {
                                    return (
                                        <TableHead key={header.id}>
                                            {header.isPlaceholder
                                                ? null
                                                : flexRender(
                                                    header.column.columnDef.header,
                                                    header.getContext()
                                                )}
                                        </TableHead>
                                    )
                                })}
                            </TableRow>
                        ))}
                    </TableHeader>
                    <TableBody id="collection-table-body">
                        {table.getRowModel().rows?.length ? (
                            table.getRowModel().rows.map((row) => (
                                <TableRow
                                    key={row.id}
                                    data-state={row.getIsSelected() && "selected"}
                                >
                                    {row.getVisibleCells().map((cell) => (
                                        <TableCell key={cell.id} onClick={() => { handleRowClick(row.getValue("name"), row.getValue("status")) }}>
                                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={columns.length} className="h-24 text-center">
                                    No results.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
            <div className="flex items-center justify-end space-x-2 py-4">
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => table.previousPage()}
                    disabled={!table.getCanPreviousPage()}
                >
                    Previous
                </Button>
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => table.nextPage()}
                    disabled={!table.getCanNextPage()}
                >
                    Next
                </Button>
            </div>

            {/* List of documents */}
            {isModalOpen && document && (
                <Table>
                    <TableCaption>A list of your documents.</TableCaption>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="text-left">File</TableHead>
                            <TableHead>Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody id="document-table-body">
                        {collection?.response.docs.map((doc) => (
                            <TableRow key={doc.doc_id}>
                                <TableCell className="text-left" id={doc.filename}>{doc.filename}</TableCell>
                                <TableCell className="text-destructive focus:text-destructive">
                                    <TrashIcon className="mr-2 h-4 w-4" onClick={() => handleDelete(collection, doc.doc_id)} />
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            )}
            {/*  */}

            <AlertDialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Nommez votre collection</AlertDialogTitle>
                        <AlertDialogDescription>
                            <Input
                                id="new-collection-title"
                                type="text"
                                value={newTitle}
                                onChange={(e) => setNewTitle(e.target.value)}
                                placeholder="Entrez le nouveau titre de la collection"
                            />
                            <Input
                                id="new-collection-files"
                                type="file"
                                multiple
                                accept="text/plain,.md"
                                onChange={(e) => setFiles(Array.from(e.target.files || []))}
                                className="mt-4"
                            />
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel onClick={() => setNewTitle("")}>
                            Annuler
                        </AlertDialogCancel>
                        <AlertDialogAction onClick={handleCreateCollection} id="create-collection">
                            Créer
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    )
}
