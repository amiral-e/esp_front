import { useRef, useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "react-toastify";
import { FileUp, Loader2, X } from "lucide-react";
import * as pdfjsLib from "pdfjs-dist";

interface PdfUploaderProps {
  onDocumentsUpdate: (extractedTexts: string[], fileNames: string[]) => void;
}

export default function PdfUploader({ onDocumentsUpdate }: PdfUploaderProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [files, setFiles] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      pdfjsLib.GlobalWorkerOptions.workerSrc = "/pdf.worker.min.js";
    }
  }, []);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;

    const newFiles = Array.from(e.target.files).filter(
      (file) => file.type === "application/pdf"
    );

    if (newFiles.length === 0) {
      toast.error("Type de fichier invalide");
      return;
    }

    setFiles((prev) => [...prev, ...newFiles]);

    // Processer les fichiers PDF
    await processFiles([...files, ...newFiles]);

    // Réinitialiser l'input
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const removeFile = async (index: number) => {
    const newFiles = [...files];
    newFiles.splice(index, 1);
    setFiles(newFiles);
    await processFiles(newFiles);
  };

  const processFiles = async (filesToProcess: File[]) => {
    setIsLoading(true);

    try {
      const extractedTexts: string[] = [];
      const fileNames: string[] = [];

      for (const file of filesToProcess) {
        const arrayBuffer = await file.arrayBuffer();

        // Utiliser pdfjsLib.getDocument pour charger le PDF à partir du ArrayBuffer
        const pdf = await pdfjsLib.getDocument(new Uint8Array(arrayBuffer)).promise;

        let fullText = "";

        // Récupérer chaque page et en extraire le texte
        for (let i = 1; i <= pdf.numPages; i++) {
          const page = await pdf.getPage(i);
          const textContent = await page.getTextContent();
          const textItems = textContent.items
            .map((item: any) => (item.str ? item.str : ""))
            .join(" ");

          fullText += textItems + " ";
        }

        // Séparer le texte à chaque point
        const splitText = splitTextByPeriod(fullText);

        // Ajouter les morceaux dans extractedTexts (plats)
        extractedTexts.push(...splitText);
        fileNames.push(file.name);
      }

      // Mettre à jour les documents extraits
      onDocumentsUpdate(extractedTexts, fileNames);
    } catch (error) {
      console.error("Erreur lors du traitement des fichiers PDF :", error);
      toast.error("Erreur lors du traitement des fichiers PDF");
    } finally {
      setIsLoading(false);
    }
  };

  // Fonction pour diviser le texte à chaque point
  const splitTextByPeriod = (text: string) => {
    // Remplacer les apostrophes (') par des guillemets doubles (")
    const formattedText = text.replace(/'/g, '"');  // Remplace toutes les apostrophes par des guillemets doubles
  
    // Diviser le texte à chaque point (.)
    const splitText = formattedText.split('.')
      .map((item) => item.trim())  // Enlever les espaces avant et après chaque segment
      .filter((item) => item.length > 0);  // Filtrer les segments vides
  
    return splitText;
  };
  


  return (
    <div className="space-y-4">
      <div className="flex items-center justify-center w-full">
        <label
          htmlFor="pdf-upload"
          className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer bg-muted/20 hover:bg-muted/30 transition-colors"
        >
          <div className="flex flex-col items-center justify-center pt-5 pb-6">
            <FileUp className="w-8 h-8 mb-2 text-muted-foreground" />
            <p className="mb-2 text-sm text-muted-foreground">
              <span className="font-semibold">Cliquez pour télécharger</span> ou faites glisser et déposez
            </p>
            <p className="text-xs text-muted-foreground">Fichiers PDF uniquement</p>
          </div>
          <input
            id="pdf-upload"
            type="file"
            className="hidden"
            accept="application/pdf"
            multiple
            onChange={handleFileChange}
            ref={fileInputRef}
            disabled={isLoading}
          />
        </label>
      </div>

      {isLoading && (
        <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
          <Loader2 className="h-4 w-4 animate-spin" />
          Traitement des fichiers PDF...
        </div>
      )}

      {files.length > 0 && (
        <div className="space-y-2">
          <p className="text-sm font-medium">Fichiers sélectionnés :</p>
          <ul className="space-y-2">
            {files.map((file, index) => (
              <li key={index} className="flex items-center justify-between text-sm p-2 bg-muted/20 rounded-md">
                <span className="truncate max-w-[80%]">{file.name}</span>
                <Button variant="ghost" size="icon" onClick={() => removeFile(index)} disabled={isLoading}>
                  <X className="h-4 w-4" />
                </Button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}