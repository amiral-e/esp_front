"use server";

import { createClient } from "@/utils/supabase/server";

export const getCollections = async () => {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("llamaindex_embedding")
    .select("*");
  if (error) {
    console.error("Error fetching collections:", error);
    throw error;
  }
  return data;
};

export const getCollectionByUserId = async (userId: string) => {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("llamaindex_embedding")
    .select("*")
    .contains("metadata", { user: userId });
  if (error) {
    throw error;
  }
  return data;
};

export const createCollection = async (
  name: string,
  userId: string,
  document: string,
  fileName: string
) => {
  const supabase = await createClient();

  const metadata = {
    user: userId,
    doc_id: crypto.randomUUID(),
    doc_file: fileName,
    create_date: new Date().toISOString(),
  };

  // Créer un vecteur d'embeddings par défaut (1536 dimensions, valeur par défaut 0)
  const defaultEmbeddings = new Array(1536).fill(0);

  const { data, error } = await supabase.from("llamaindex_embedding").insert({
    id: crypto.randomUUID(),
    collection: `${name}`,
    document: document,
    metadata: metadata,
    external_id: "",
    embeddings: defaultEmbeddings,
  });

  if (error) {
    console.error("Erreur lors de la création de la collection:", error);
    throw error;
  }
  return data;
};

export const deleteCollection = async (id: string) => {
  const supabase = await createClient();
  const { error } = await supabase
    .from("llamaindex_embedding")
    .delete()
    .eq("id", id);
  if (error) {
    throw error;
  }
  return true;
};

export const updateCollection = async (id: string, name: string) => {
  const supabase = await createClient();
  const { error } = await supabase
    .from("llamaindex_embedding")
    .update({ name })
    .eq("id", id);
  if (error) {
    throw error;
  }
  return true;
};

export const addDocumentsToCollection = async (
  collectionName: string,
  userId: string,
  documents: string[],
  documentName: string
) => {
  const supabase = await createClient();

  const documentsToInsert = documents.map((document) => ({
    id: crypto.randomUUID(),
    collection: collectionName,
    document: document,
    metadata: {
      user: userId,
      doc_id: crypto.randomUUID(),
      doc_file: `${documentName}`,
      create_date: new Date().toISOString(),
    },
    external_id: "",
    embeddings: new Array(1536).fill(0),
  }));

  const { data, error } = await supabase
    .from("llamaindex_embedding")
    .insert(documentsToInsert);

  if (error) {
    console.error(
      "Erreur lors de l'ajout des documents à la collection:",
      error
    );
    throw error;
  }
  return data;
};
