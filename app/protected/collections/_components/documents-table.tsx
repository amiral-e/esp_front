"use client"

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Trash2, FileText, Download } from "lucide-react"
import { useState } from "react"
import { deleteDocumentByDocId, deleteDocumentGlobalByDocId } from "@/actions/documents"
import { useRouter } from "next/navigation"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

interface Document {
  doc_id: string
  doc_file: string
}

interface DocumentsTableProps {
  documents: Document[]
  collectionName: string
  isAdmin: boolean
}

export function DocumentsTable({ documents, collectionName, isAdmin }: DocumentsTableProps) {
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const router = useRouter()

  const handleDelete = async (docId: string) => {
    try {
      setDeletingId(docId)
      if (isAdmin) {
        await deleteDocumentGlobalByDocId(collectionName, docId)
      } else {
        await deleteDocumentByDocId(collectionName, docId)
      }
      router.refresh()
    } catch (error) {
      console.error("Error deleting document:", error)
    } finally {
      setDeletingId(null)
    }
  }

  const getFileName = (path: string) => {
    return path.split("/").pop() || path
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Document ID</TableHead>
            <TableHead>File Name</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {documents.map((doc) => (
            <TableRow key={doc.doc_id}>
              <TableCell className="font-medium">{doc.doc_id}</TableCell>
              <TableCell className="flex items-center gap-2">
                <FileText className="h-4 w-4" />
                {getFileName(doc.doc_file)}
              </TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-2">
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-destructive hover:bg-destructive hover:text-destructive-foreground"
                      >
                        <Trash2 className="h-4 w-4" />
                        <span className="sr-only">Delete</span>
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                          This action cannot be undone. This will permanently delete the document.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => handleDelete(doc.doc_id)}
                          disabled={deletingId === doc.doc_id}
                          className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                        >
                          {deletingId === doc.doc_id ? "Deleting..." : "Delete"}
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
