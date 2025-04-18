"use client"

import {
    type ColumnDef,
    flexRender,
    getCoreRowModel,
    useReactTable,
    getPaginationRowModel,
    type ColumnFiltersState,
    getFilteredRowModel,
    type VisibilityState,
} from "@tanstack/react-table"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useState } from "react"
import type { Collection } from "@/actions/collections"
import { DocumentsTable } from "./documents-table"
import { getDocumentsByCollectionName, getDocumentsByCollectionGlobal } from "@/actions/documents"
import React from "react"

interface DataTableProps<TData, TValue> {
    columns: ColumnDef<TData, TValue>[]
    data: TData[]
    isAdmin?: boolean
}

export function DataTable<TData, TValue>({ columns, data, isAdmin = false }: DataTableProps<TData, TValue>) {
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
    const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})
    const [expandedCollection, setExpandedCollection] = useState<string | null>(null)
    const [documents, setDocuments] = useState<any[]>([])
    const [loading, setLoading] = useState(false)

    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        onColumnFiltersChange: setColumnFilters,
        getFilteredRowModel: getFilteredRowModel(),
        onColumnVisibilityChange: setColumnVisibility,
        state: {
            columnFilters,
            columnVisibility,
        },
    })

    const handleRowClick = async (collection: Collection) => {
        try {
            if (expandedCollection === collection.name) {
                setExpandedCollection(null)
                setDocuments([])
                return
            }

            setLoading(true)
            setExpandedCollection(collection.name)

            const docs = isAdmin
                ? await getDocumentsByCollectionGlobal(collection.name)
                : await getDocumentsByCollectionName(collection.name)

            setDocuments(docs)
        } catch (error) {
            console.error("Error fetching documents:", error)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="space-y-4">
            <div className="flex items-center py-4">
                <Input
                    placeholder="Filter collections..."
                    value={(table.getColumn("name")?.getFilterValue() as string) ?? ""}
                    onChange={(event) => table.getColumn("name")?.setFilterValue(event.target.value)}
                    className="max-w-sm"
                />
            </div>
            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id}>
                                {headerGroup.headers.map((header) => {
                                    return (
                                        <TableHead key={header.id}>
                                            {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                                        </TableHead>
                                    )
                                })}
                            </TableRow>
                        ))}
                    </TableHeader>
                    <TableBody>
                        {table.getRowModel().rows.map((row) => (
                            <React.Fragment key={row.id}>
                                <TableRow
                                    data-state={row.getIsSelected() && "selected"}
                                    className="cursor-pointer"
                                    onClick={() => handleRowClick(row.original as Collection)}
                                >
                                    {row.getVisibleCells().map((cell) => (
                                        <TableCell key={cell.id}>
                                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                        </TableCell>
                                    ))}
                                </TableRow>
                                {expandedCollection === (row.original as Collection).name && (
                                    <TableRow key={`${row.id}-expanded`}>
                                        <TableCell colSpan={columns.length} className="p-0">
                                            <div className="p-4 bg-muted/20">
                                                {loading ? (
                                                    <div className="flex justify-center p-4">Loading documents...</div>
                                                ) : documents.length > 0 ? (
                                                    <DocumentsTable
                                                        documents={documents}
                                                        collectionName={(row.original as Collection).name}
                                                        isAdmin={isAdmin}
                                                    />
                                                ) : (
                                                    <div className="text-center p-4">Aucun document trouvé</div>
                                                )}
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                )}
                            </React.Fragment>
                        ))}
                    </TableBody>
                </Table>
            </div>
            <div className="flex items-center justify-end space-x-2 py-4">
                <Button variant="outline" size="sm" onClick={() => table.previousPage()} disabled={!table.getCanPreviousPage()}>
                    Previous
                </Button>
                <Button variant="outline" size="sm" onClick={() => table.nextPage()} disabled={!table.getCanNextPage()}>
                    Next
                </Button>
            </div>
        </div>
    )
}
