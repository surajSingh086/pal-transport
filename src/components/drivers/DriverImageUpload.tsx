
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Upload, Image as ImageIcon } from "lucide-react";

interface DriverImageUploadProps {
  onImageSelected: (file: File | null) => void;
  currentImage: string | null;
}

export function DriverImageUpload({ onImageSelected, currentImage }: DriverImageUploadProps) {
  const [previewUrl, setPreviewUrl] = useState<string | null>(currentImage);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    
    if (file) {
      // Preview the selected image
      const reader = new FileReader();
      reader.onload = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
      
      // Send the file to the parent component
      onImageSelected(file);
    }
  };

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="space-y-2">
      <div className="flex flex-col items-center">
        <div className="mb-4 text-center">
          <p className="text-sm font-medium mb-1">Driver Photo</p>
          <p className="text-xs text-muted-foreground">
            Upload a photo of the driver
          </p>
        </div>
        
        {previewUrl ? (
          <div className="relative h-28 w-28 rounded-full overflow-hidden border mb-2">
            <img
              src={previewUrl}
              alt="Driver preview"
              className="h-full w-full object-cover"
            />
          </div>
        ) : (
          <div className="flex h-28 w-28 items-center justify-center rounded-full bg-muted mb-2">
            <ImageIcon className="h-10 w-10 text-muted-foreground" />
          </div>
        )}
        
        <Input
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          className="hidden"
          ref={fileInputRef}
        />
        
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={handleButtonClick}
          className="mt-2"
        >
          <Upload className="mr-2 h-4 w-4" />
          {previewUrl ? "Change Photo" : "Upload Photo"}
        </Button>
      </div>
    </div>
  );
}
