
import React from "react";
import { Upload } from "lucide-react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface ImageUploadProps {
  imagePreview: string | null;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const ImageUpload: React.FC<ImageUploadProps> = ({ imagePreview, onChange }) => {
  return (
    <div className="flex flex-col items-center space-y-2">
      <div 
        className={cn(
          "border-2 border-dashed rounded-md w-full h-40 flex flex-col items-center justify-center cursor-pointer hover:bg-muted/50 transition-colors",
          imagePreview ? "border-primary" : "border-muted"
        )}
        onClick={() => document.getElementById('vehicle-image')?.click()}
      >
        {imagePreview ? (
          <img 
            src={imagePreview} 
            alt="Vehicle preview" 
            className="h-full object-contain p-2"
          />
        ) : (
          <>
            <Upload className="h-10 w-10 text-muted-foreground mb-2" />
            <p className="text-sm text-muted-foreground">Click to upload vehicle image</p>
          </>
        )}
      </div>
      <Input 
        id="vehicle-image" 
        type="file" 
        accept="image/*" 
        className="hidden" 
        onChange={onChange}
      />
    </div>
  );
};

export default ImageUpload;
