"use client";

import React, { useState } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import { Card, CardHeader, CardTitle } from "./ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import "react-pdf/dist/esm/Page/TextLayer.css";
import "react-pdf/dist/esm/Page/AnnotationLayer.css";

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

type Props = {
  pdf_url: string;
};

export default function Viewer({ pdf_url }: Props) {
  const [numPages, setNumPages] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  function onDocumentLoadSuccess({ numPages }: { numPages: number }) {
    setNumPages(numPages);
    setLoading(false);
  }

  return (
    <div className="flex flex-col h-screen overflow-hidden p-4">
      <Card className="flex flex-col h-full">
        <CardHeader className="border-b py-3">
          <CardTitle className="text-lg">Document Viewer</CardTitle>
        </CardHeader>

        {/* pdf document viewer */}
        <div className="flex-1 overflow-auto bg-muted/20 flex justify-center m-4">
          <Document
            file={pdf_url}
            onLoadSuccess={onDocumentLoadSuccess}
            loading={
              <div className="space-y-4">
                <Skeleton className="h-12 w-2/3" />
                <Skeleton className="h-12 w-3/4 ml-auto" />
                <Skeleton className="h-12 w-2/3" />
                <Skeleton className="h-12 w-1/2 ml-auto" />
              </div>
            }
          >
            {numPages &&
              Array.from({ length: numPages }).map((_, i) => (
                <Page
                  key={i + 1}
                  pageNumber={i + 1}
                  renderTextLayer={true}
                  renderAnnotationLayer={true}
                  className="shadow-lg mb-4"
                />
              ))}

          </Document>
        </div>
      </Card>
    </div>
  );
}
