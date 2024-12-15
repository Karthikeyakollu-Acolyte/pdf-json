"use client";

import React, { useEffect, useState } from "react";
import {
    Tree,
    Folder,
    File,
    CollapseButton,
} from "./ui/tree-view-api";


import type { PDFDocumentProxy } from "pdfjs-dist";

interface OutlineItem {
    action: any | null; // Additional action details if applicable
    dest: string | null; // Destination for navigation
    url: string | null; // External URL if present
    title: string; // Title of the outline entry
    color: {
        [key: string]: number; // RGB color as an object with keys 0, 1, 2
    };
    bold: boolean; // Indicates if the title is bold
    italic: boolean; // Indicates if the title is italic
    items: OutlineItem[]; // Nested children outline items
}

interface TransformedOutlineItem {
    id: string; // Unique identifier for Tree elements
    isSelectable: boolean; // Indicates if this item is selectable
    name: string; // Title of the outline entry
    children: TransformedOutlineItem[]; // Transformed nested items
    dest?: string | null; // Navigation destination
    url?: string | null; // External URL if present
}


interface PDFOutlineViewerProps {
    pdfDocument:any; // Replace with the actual PDFDocumentProxy type from PDF.js
}


// Assuming types for PDFDocument, OutlineItem, and TransformedOutlineItem
// Assuming you have a Tree, Folder, File, and CollapseButton components already

const PDFOutlineViewer: React.FC<PDFOutlineViewerProps> = ({
    pdfDocument,
}) => {
    const [outline, setOutline] = useState<TransformedOutlineItem[] | null>(null);

    // Fetch outline when the component mounts or pdfDocument changes
    useEffect(() => {
        if (!pdfDocument) return;

        pdfDocument.getOutline().then((outlineData:any) => {
            setOutline(transformOutline(outlineData));
            console.log(outlineData)
        });
    }, [pdfDocument]);

    // Transform the outline into a nested structure compatible with the Tree component
    const transformOutline = (outlineItems: OutlineItem[]): TransformedOutlineItem[] => {
        if (!outlineItems) return [];
        return outlineItems.map((item, index) => ({
            id: `item-${index}`,
            isSelectable: true,
            name: item.title || "Untitled",
            children: transformOutline(item.items || []),
            dest: item.dest,
            url: item.url,
        }));
    };

    // Recursive render function to generate the nested structure
    const renderTree = (elements: TransformedOutlineItem[]) => {
        return elements.map((item) => {
            if (item.children && item.children.length > 0) {
                return (
                    <Folder key={item.id} value={item.id} element={item.name}>
                        {renderTree(item.children)}
                    </Folder>
                );
            }
            return (
                <div key={item.id}>
                    <File value={item.id}>
                        <p>{item.name}</p>
                    </File>
                </div>
            );
        });
    };

    // Function to download the outline as a JSON file
    const downloadJSON = () => {
        if (!outline) return;
        const dataStr = JSON.stringify(outline, null, 2); // Format JSON with indentation
        const blob = new Blob([dataStr], { type: "application/json" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = "outline.json"; // Default file name for download
        link.click();
        URL.revokeObjectURL(url); // Clean up the URL object
    };

    return (
        <div>
            <Tree
                className="rounded-md h-screen bg-background overflow-hidden p-2"
                elements={outline || []}
            >
                {renderTree(outline || [])}
                <CollapseButton elements={outline || []} />
            </Tree>

            {/* Download Button */}
            <button
                onClick={downloadJSON}
                className="mt-4 p-2 bg-blue-500 text-white rounded absolute top-4 right-0 m-5"
            >
                Download Outline as JSON
            </button>
        </div>
    );
};

export default PDFOutlineViewer;


