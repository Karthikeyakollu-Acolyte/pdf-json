"use client";
import React, { useState, useMemo, useEffect, useRef } from "react";
import { Document, pdfjs } from "react-pdf";

// Set workerSrc for pdfjs
import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";
import PDFOutlineViewer from "./PDFOutlineViewer";
pdfjs.GlobalWorkerOptions.workerSrc =
    `https://unpkg.com/pdfjs-dist@4.4.168/build/pdf.worker.min.mjs`;

const PdfViewer = () => {
    const PdfViewerRef = useRef(null);
    const [pdfDocument, setPdfDocument] = useState(null);
    const [pdfFile, setPdfFile] = useState<any>(null);

    const onDocumentLoadSuccess = (pdf:any) => {
        setPdfDocument(pdf);
    };

    const options = useMemo(() => ({
        cMapUrl: `https://unpkg.com/pdfjs-dist@${pdfjs.version}/cmaps/`,
        cMapPacked: true,
    }), []);

    const handleFileChange = (e:any) => {
        const file = e.target.files[0];
        if (file) {
            // Create an object URL for the selected file
            setPdfFile(URL.createObjectURL(file));
        }
    };

  

    return (
        <div className="relative w-full h-full">
            <div className="relative w-full h-full">
                {/* File input for local PDF */}
                <input 
                    type="file" 
                    accept="application/pdf" 
                    onChange={handleFileChange} 
                    className="mb-4"
                />
                {/* Document component to render the PDF */}
                {pdfFile && (
                    <Document
                        file={pdfFile}
                        onLoadSuccess={onDocumentLoadSuccess}
                        options={options}
                        ref={PdfViewerRef}
                        className={"pdfViewer relative"}
                    >
                        <PDFOutlineViewer pdfDocument={pdfDocument} />
                    </Document>
                )}
            </div>
        </div>
    );
};

export default PdfViewer;
