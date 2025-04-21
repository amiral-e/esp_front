declare module "pdfjs-dist" {
    export const GlobalWorkerOptions: {
        workerSrc: string;
    };

    export function getDocument(
        src: string | Uint8Array | { url: string }
    ): {
        promise: Promise<PDFDocumentProxy>;
    };

    export interface PDFDocumentProxy {
        numPages: number;
        getPage(pageNumber: number): Promise<PDFPageProxy>;
    }

    export interface PDFPageProxy {
        getTextContent(): Promise<PDFTextContent>;
    }

    export interface PDFTextContent {
        items: Array<{ str: string }>;
    }
}