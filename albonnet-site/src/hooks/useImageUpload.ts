"use client";

import { useState } from "react";
import { uploadImage } from "@/lib/api/upload";

export function useImageUpload(onChange: (url: string) => void) {
  const [uploading, setUploading] = useState(false);

  const handleFile = async (file: File) => {
    setUploading(true);
    try {
      const url = await uploadImage(file);
      onChange(url);
    } finally {
      setUploading(false);
    }
  };

  return { uploading, handleFile };
}
