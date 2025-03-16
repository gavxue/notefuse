"use client";

import React, { useState } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import { Button } from "./ui/button";
import { Card, CardHeader, CardTitle } from "./ui/card";
import { Input } from "./ui/input";
import { ZoomIn, ZoomOut, ChevronLeft, ChevronRight } from "lucide-react";
import "react-pdf/dist/esm/Page/TextLayer.css";
import "react-pdf/dist/esm/Page/AnnotationLayer.css";

// Set the worker source for PDF.js
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

type Props = {
  pdf_url: string;
};

export default function Viewer({ pdf_url }: Props) {
  const [numPages, setNumPages] = useState<number | null>(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [scale, setScale] = useState(1.0);
  const [loading, setLoading] = useState(true);

  function onDocumentLoadSuccess({ numPages }: { numPages: number }) {
    setNumPages(numPages);
    setLoading(false);
  }

  function changePage(offset: number) {
    setPageNumber((prevPageNumber) => {
      const newPageNumber = prevPageNumber + offset;
      return newPageNumber >= 1 && newPageNumber <= (numPages || 1)
        ? newPageNumber
        : prevPageNumber;
    });
  }

  function zoomIn() {
    setScale((prevScale) => Math.min(prevScale + 0.2, 2.5));
  }

  function zoomOut() {
    setScale((prevScale) => Math.max(prevScale - 0.2, 0.5));
  }

  return (
    <div className="flex flex-col h-screen overflow-hidden p-4">
      <Card className="flex flex-col h-full">
        <CardHeader className="border-b py-3">
          <CardTitle className="text-lg">Document Viewer</CardTitle>
        </CardHeader>
        {/* Controls */}
        {/* <div className="flex items-center justify-between p-4">
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => changePage(-1)}
              disabled={pageNumber <= 1}
            >
              <ChevronLeft size={16} />
            </Button>

            <div className="flex items-center min-w-[100px]">
              <span className="text-sm">
                Page {pageNumber} of {numPages || "--"}
              </span>
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={() => changePage(1)}
              disabled={numPages === null || pageNumber >= numPages}
            >
              <ChevronRight size={16} />
            </Button>
          </div>

          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm" onClick={zoomOut}>
              <ZoomOut size={16} />
            </Button>
            <span className="text-sm">{Math.round(scale * 100)}%</span>
            <Button variant="outline" size="sm" onClick={zoomIn}>
              <ZoomIn size={16} />
            </Button>
          </div>
        </div> */}

        {/* PDF Document */}
        <div className="flex-1 overflow-auto bg-muted/20 flex justify-center m-4">
          <Document
            file={pdf_url}
            onLoadSuccess={onDocumentLoadSuccess}
            loading={
              <div className="flex items-center justify-center h-full w-full">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
              </div>
            }
          >
              {numPages &&
                Array.from({ length: numPages }).map((_, i) => (
                  <Page
                    key={i + 1}
                    pageNumber={i + 1}
                    scale={scale}
                    renderTextLayer={true}
                    renderAnnotationLayer={true}
                    className="shadow-lg mb-4"
                  />
                ))}
              {/* <Page
              pageNumber={pageNumber}
              scale={scale}
              renderTextLayer={true}
              renderAnnotationLayer={true}
              className="shadow-lg"
            /> */}
          </Document>
        </div>
      </Card>
    </div>
  );

  // <div className="p-4 h-full">
  //   <iframe
  //     src={`https://docs.google.com/gview?url=${pdf_url}&embedded=true`}
  //     className="w-full h-full"
  //   ></iframe>
  // </div>;
}
