"use client";

import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
  getExpandedRowModel,
} from "@tanstack/react-table";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Fragment, useMemo } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { EyeIcon, XIcon } from "lucide-react";
import { deleteCollection } from "@/actions/collections";
import { formatMarkdown } from "@/lib/formatMarkdown";
import { useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
}

export function DataTable<TData, TValue>({
  columns,
  data,
}: DataTableProps<TData, TValue>) {
  const router = useRouter();
  // Regrouper les données par collection
  const uniqueCollections = useMemo(() => {
    const collections = new Map();

    data.forEach((item: any) => {
      if (!collections.has(item.collection)) {
        collections.set(item.collection, {
          ...item,
          documents: [item],
        });
      } else {
        collections.get(item.collection).documents.push(item);
      }
    });

    return Array.from(collections.values());
  }, [data]);

  // const onDelete = async () => {
  //   try {
  //     setLoading(true);
  //     await deleteCollection(row.original.id);
  //     router.refresh();
  //   } catch (error) {
  //   } finally {
  //     setLoading(false);
  //     setOpen(false);
  //   }
  // };

  const onDelete = async (id: string) => {
    try {
      await deleteCollection(id);
      router.refresh();
    } catch (error) {
      console.log(error);
    }
  };

  const table = useReactTable({
    data: uniqueCollections,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getExpandedRowModel: getExpandedRowModel(),
    getRowCanExpand: () => true,
  });

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id} className="hover:bg-transparent">
              {headerGroup.headers.map((header) => (
                <TableHead key={header.id}>
                  {header.isPlaceholder
                    ? null
                    : flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                </TableHead>
              ))}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows?.length ? (
            table.getRowModel().rows.map((row) => (
              <Fragment key={row.id}>
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell
                      key={cell.id}
                      className="whitespace-nowrap [&:has([aria-expanded])]:w-px [&:has([aria-expanded])]:py-0 [&:has([aria-expanded])]:pr-0"
                    >
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
                {row.getIsExpanded() && (
                  <TableRow>
                    <TableCell colSpan={row.getVisibleCells().length}>
                      <div className="p-4">
                        <h3 className="text-sm font-medium mb-2">
                          Documents dans la collection{" "}
                          {(row.original as any).collection.includes("_")
                            ? (row.original as any).collection
                                .split("_")
                                .slice(1)
                                .join("_")
                            : (row.original as any).collection}
                        </h3>
                        <div className="space-y-2">
                          {(row.original as any).documents.map(
                            (item: any, index: number) => (
                              <div
                                key={index}
                                className="flex items-center justify-between p-2 bg-muted/50 rounded-md"
                              >
                                <span className="font-medium">
                                  {item.metadata.doc_file}
                                </span>
                                <div className="flex items-center gap-x-4">
                                  <div className="flex items-center gap-2">
                                    <Dialog>
                                      <DialogTrigger asChild>
                                        <Button variant="ghost" size="sm">
                                          <EyeIcon className="h-4 w-4 mr-1" />{" "}
                                          Voir
                                        </Button>
                                      </DialogTrigger>
                                      <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
                                        <DialogHeader>
                                          <DialogTitle>
                                            {item.metadata.doc_file}
                                          </DialogTitle>
                                        </DialogHeader>
                                        <div
                                          className="mt-4 space-y-2 whitespace-pre-wrap"
                                          dangerouslySetInnerHTML={{
                                            __html: formatMarkdown(
                                              item.document
                                            ),
                                          }}
                                        />
                                      </DialogContent>
                                    </Dialog>
                                  </div>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => onDelete(item.id)}
                                  >
                                    <XIcon className="h-4 w-4" />
                                  </Button>
                                </div>
                              </div>
                            )
                          )}
                        </div>
                      </div>
                    </TableCell>
                  </TableRow>
                )}
              </Fragment>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length} className="h-24 text-center">
                <Card className="border-dashed border-2 border-muted-foreground">
                  <CardHeader>
                    <CardTitle>Aucune collection trouvée</CardTitle>
                    <CardDescription>
                      Vous n'avez pas de collections. Veuillez en créer une
                      nouvelle.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p>
                      Vous n'avez pas de collections. Veuillez en créer une
                      nouvelle.
                    </p>
                  </CardContent>
                </Card>
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
