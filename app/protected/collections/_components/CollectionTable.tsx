"use client";

import { useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { PlusCircle, Trash, TrashIcon } from "lucide-react";
import { Collections, createCollection, deleteCollection, fetchCollections } from "@/app/actions/collection-action";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { toast } from "@/hooks/use-toast";
import { deleteDocument, Doc, fetchDocumentByCollection } from "@/app/actions/document-action";

export default function CollectionTable({ collections }: { collections: Collections[] }) {
  const [data, setData] = useState(collections);
  const [selected, setSelected] = useState<Doc | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newName, setNewName] = useState("");
  const [files, setFiles] = useState<File[]>([]);
  const [status, setStatus] = useState<string | null>(null);

  const handleDelete = async (collection: string) => {
    try {
      const response = await deleteCollection(collection);
      if (response) {
        setData(data.filter((item) => item.name !== collection));
        if (selected?.collection_name === collection) setSelected(null);
      }
    } catch (error) {
      console.error("Error deleting collection:", error);
    }
  };

  const handleRowClick = (collection: Collections) => {
    getDocumentByCollection(collection.name, collection.status);
    setStatus(collection.status);
  };

  const handleCreateCollection = async () => {
    try {
      const creation = await createCollection(newName, files);
      if (creation.error) {
        throw new Error(creation.error);
      }
      setNewName("");
      setFiles([]);
      setIsDialogOpen(false);

      // Rafraîchir les collections après création
      const updatedCollections = await fetchCollections();
      if (updatedCollections?.collections) {
        setData(updatedCollections.collections);
      }
      if (isDialogOpen && selected && status) {
        getDocumentByCollection(selected.collection_name, status);
      }

      toast({
        title: "Collection créée",
        description: creation.response,
        variant: "default",
      });

    } catch (error: any) {
      setIsDialogOpen(false);
      toast({
        title: "Erreur lors de la création de la collection",
        description: error.message || "Une erreur s'est produite",
        variant: "destructive",
      });
    }
  };


  const getDocumentByCollection = async (collection: string, status: string) => {
    try {
      const documentData = await fetchDocumentByCollection(collection, status);

      if (documentData.error) {
        if (documentData.error) {
          setSelected(null);
        }
        return;
      }
      if (documentData.response && documentData.collection_name && documentData.status) {
        setSelected({
          response: documentData.response,
          collection_name: documentData.collection_name,
          status: documentData.status,
        });
      } else {
        setSelected(null);
      }
    } catch (error) {
      console.error("Unexpected error:", error);
      setSelected(null);
    }
  };

  const handleDeleteDocuments = async (collection: Doc, doc_id: string) => {
    try {
      const deletedDoc = await deleteDocument(collection, doc_id);
      // refresh data after deletion
      if (selected && status) {
        await getDocumentByCollection(collection.collection_name, status);
      }
      if (deletedDoc) {
        const updatedCollections = await fetchCollections();
        if (updatedCollections?.collections) {
          setData(updatedCollections.collections);
        }
        else {
          setData([]);
        }
      }
      toast({
        title: "Document supprimé",
        description: JSON.stringify(deletedDoc),
        variant: "default",
      });
    } catch (error) {
      toast({
        title: "Erreur lors de la suppression du document",
        description: JSON.stringify(error),
        variant: "destructive",
      });
      console.error("Error deleting document:", error);
    }
  }

  return (
    <Card className="p-6 shadow-lg">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Liste des Collections</h2>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button variant="outline">
              <PlusCircle className="w-5 h-5 mr-2" />
              Ingérer un nouveau document
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Ajouter une nouvelle collection</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="name">Nom de la collection</Label>
                <Input id="name" onChange={(e) => setNewName(e.target.value)} required />
              </div>
              <div>
                <Label htmlFor="file">Fichier</Label>
                <Input
                    id="file"
                    type="file"
                    onChange={(e) => setFiles(Array.from(e.target.files || []))}
                    accept="text/plain,.md"
                    multiple
                />
                <p className="text-sm text-gray-500 mt-1">Taille maximum d'un fichier: 25MB. Formats .txt et .md autorisés.</p>
              </div>
              <Button onClick={handleCreateCollection} className="w-full">
                Ajouter
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Table>
        <TableHeader>
          <TableRow className="bg-gray-100">
            <TableHead className="w-1/3">Nom</TableHead>
            <TableHead className="w-1/3">Statut</TableHead>
            <TableHead className="w-1/3 text-center">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((item) => (
            <TableRow key={item.collection} className="hover:bg-gray-50 cursor-pointer" onClick={() => handleRowClick(item)}>
              <TableCell>{item.name}</TableCell>
              <TableCell>{item.status}</TableCell>
              <TableCell className="text-center">
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={(e) => { e.stopPropagation(); handleDelete(item.name); }}
                >
                  <Trash className="w-4 h-4" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {selected && (
        <Card className="mt-4 p-4">
          <h3 className="text-lg font-semibold">Détails de {selected.collection_name}</h3>
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-100">
                <TableHead>Fichier</TableHead>
                <TableHead>Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {selected?.response.documents.map((doc) => (
                <TableRow key={doc.doc_id}>
                  <TableCell className="text-left">{doc.doc_file}</TableCell>
                  <TableCell className="text-destructive focus:text-destructive">
                    <TrashIcon className="mr-2 h-4 w-4" onClick={() => handleDeleteDocuments(selected, doc.doc_id)} />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
      )}
    </Card>
  );
}
