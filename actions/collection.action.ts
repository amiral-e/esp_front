"use server";

import { createClient } from "@/utils/supabase/server";
import axios from "axios";
import { cookies } from "next/headers";

const getAuthToken = async (): Promise<string | null> => {
  const cookieStore = await cookies();
  return cookieStore.get("auth_token")?.value ?? null;
};

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
    collection: `${userId}_${name}`,
    document: `${document}`,
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

export const sendDocuments = async (collectionName: string, document: File) => {
  const auth_token = await getAuthToken();
  try {
    // Vérifier que le nom de la collection est valide
    if (!collectionName || collectionName.trim() === "") {
      throw new Error("Le nom de la collection ne peut pas être vide");
    }

    // Vérifier que le document est valide
    if (!document || document.size === 0) {
      throw new Error("Le document ne peut pas être vide");
    }

    // Extraire le nom de la collection sans le préfixe utilisateur si nécessaire
    const collectionNameOnly = collectionName.includes("_")
      ? collectionName.split("_").slice(1).join("_")
      : collectionName;

    // Lire le contenu du fichier
    const fileContent = await document.text();

    // Déterminer le type MIME en fonction de l'extension
    const fileExtension = document.name.split(".").pop()?.toLowerCase();
    const mimeType = fileExtension === "md" ? "md" : "txt";

    // Créer un nouveau fichier avec le type MIME explicite
    const fileWithCorrectType = new File([fileContent], document.name, {
      type: mimeType,
    });

    // Créer un objet FormData
    const formData = new FormData();

    // Ajouter le fichier au FormData
    formData.append("document", fileWithCorrectType);

    console.log("Envoi du document:", {
      collectionName: collectionNameOnly,
      fileName: document.name,
      fileSize: document.size,
      fileType: mimeType,
      formDataEntries: Array.from(formData.entries()).map((e) => e[0]),
    });

    // Envoyer la requête
    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_API_URL}/collections/${collectionNameOnly}/documents`,
      formData,
      {
        headers: {
          Authorization: `Bearer ${auth_token}`,
          // Ne pas définir Content-Type manuellement
        },
        timeout: 30000,
      }
    );

    console.log("Réponse du serveur:", response.data);
    return response.data;
  } catch (error: any) {
    console.error("Erreur lors de l'envoi du document:", error);

    if (error.response) {
      console.error("Détails de l'erreur:", {
        status: error.response.status,
        data: error.response.data,
      });
    }

    throw new Error(
      error.response?.data?.error ||
        error.message ||
        "Erreur lors de l'envoi du document"
    );
  }
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
