import React, { useState, useRef } from 'react';
import { Camera, Upload, User, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';

interface AvatarUploaderProps {
  currentAvatarUrl?: string;
  userName?: string;
  onUpload: (file: File) => Promise<string | null>;
  loading?: boolean;
  className?: string;
}

export const AvatarUploader: React.FC<AvatarUploaderProps> = ({
  currentAvatarUrl,
  userName = 'User',
  onUpload,
  loading = false,
  className = ''
}) => {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const validateFile = (file: File): boolean => {
    // Check file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      toast({
        title: 'Invalid file type',
        description: 'Please upload a JPEG, PNG, or WebP image.',
        variant: 'destructive',
      });
      return false;
    }

    // Check file size (max 5MB)
    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      toast({
        title: 'File too large',
        description: 'Please upload an image smaller than 5MB.',
        variant: 'destructive',
      });
      return false;
    }

    return true;
  };

  const handleFileSelect = (file: File) => {
    if (!validateFile(file)) return;

    // Create preview
    const reader = new FileReader();
    reader.onload = (e) => {
      setPreviewUrl(e.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleFileInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(false);

    const file = event.dataTransfer.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(false);
  };

  const handleUpload = async () => {
    if (!fileInputRef.current?.files?.[0]) return;

    const file = fileInputRef.current.files[0];
    setUploading(true);

    try {
      const uploadedUrl = await onUpload(file);
      if (uploadedUrl) {
        toast({
          title: 'Avatar updated!',
          description: 'Your profile picture has been successfully updated.',
        });
        setPreviewUrl(null);
        // Reset file input
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
      }
    } catch (error) {
      toast({
        title: 'Upload failed',
        description: 'Failed to update your avatar. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setUploading(false);
    }
  };

  const handleCancel = () => {
    setPreviewUrl(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const displayUrl = previewUrl || currentAvatarUrl;
  const initials = getInitials(userName);

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Avatar Display */}
      <div className="flex justify-center">
        <div className="relative">
          <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-primary/20 shadow-lg">
            {displayUrl ? (
              <img
                src={displayUrl}
                alt={`${userName}'s avatar`}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-gradient-primary flex items-center justify-center text-primary-foreground text-xl font-bold">
                {initials}
              </div>
            )}
          </div>
          
          {/* Camera icon overlay */}
          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={loading || uploading}
            className="absolute bottom-0 right-0 w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center shadow-lg hover:bg-primary/90 transition-colors disabled:opacity-50"
          >
            <Camera className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Upload Area */}
      <Card
        className={`border-2 border-dashed transition-colors ${
          isDragging
            ? 'border-primary bg-primary/5'
            : 'border-border hover:border-primary/50'
        }`}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
      >
        <div className="p-6 text-center space-y-4">
          <div className="flex justify-center">
            <Upload className="h-10 w-10 text-muted-foreground" />
          </div>
          
          <div>
            <p className="text-sm font-medium">
              Drop your image here, or{' '}
              <button
                onClick={() => fileInputRef.current?.click()}
                className="text-primary hover:underline"
                disabled={loading || uploading}
              >
                browse
              </button>
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              Supports JPEG, PNG, WebP up to 5MB
            </p>
          </div>

          {/* Hidden file input */}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/jpg,image/png,image/webp"
            onChange={handleFileInput}
            className="hidden"
            disabled={loading || uploading}
          />
        </div>
      </Card>

      {/* Preview Actions */}
      {previewUrl && (
        <div className="flex gap-2 justify-center">
          <Button
            onClick={handleUpload}
            disabled={uploading || loading}
            className="flex-1 max-w-32"
          >
            {uploading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                Uploading...
              </>
            ) : (
              <>
                <Upload className="h-4 w-4 mr-2" />
                Upload
              </>
            )}
          </Button>
          
          <Button
            variant="outline"
            onClick={handleCancel}
            disabled={uploading || loading}
            className="flex-1 max-w-32"
          >
            <X className="h-4 w-4 mr-2" />
            Cancel
          </Button>
        </div>
      )}

      {/* Loading state */}
      {(loading || uploading) && !previewUrl && (
        <div className="text-center">
          <div className="inline-flex items-center text-sm text-muted-foreground">
            <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin mr-2" />
            {uploading ? 'Uploading avatar...' : 'Loading...'}
          </div>
        </div>
      )}
    </div>
  );
};