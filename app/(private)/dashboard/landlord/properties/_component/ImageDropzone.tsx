"use client";

import { useRef, useState, DragEvent, ChangeEvent } from "react";
import Image from "next/image";
import { ImagePlus, Loader2, UploadCloud, X } from "lucide-react";

import { cn } from "@/lib/utils";

interface ImageDropzoneProps {
    images: string[];
    onChange: (images: string[]) => void;
    maxImages?: number;
    disabled?: boolean;
}

const readAsDataUrl = (file: File) =>
    new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(file);
    });

const ACCEPTED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/avif"];
const MAX_FILE_SIZE_MB = 5;

export default function ImageDropzone({
    images,
    onChange,
    maxImages = 10,
    disabled = false,
}: ImageDropzoneProps) {
    const inputRef = useRef<HTMLInputElement>(null);
    const [isDragging, setIsDragging] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const remainingSlots = maxImages - images.length;

    const processFiles = async (fileList: FileList | File[]) => {
        setError(null);

        const files = Array.from(fileList);

        const valid = files.filter((file) => {
            if (!ACCEPTED_TYPES.includes(file.type)) return false;
            if (file.size > MAX_FILE_SIZE_MB * 1024 * 1024) return false;
            return true;
        });

        if (valid.length === 0) {
            setError(
                `Please select JPG, PNG, WEBP, or AVIF images under ${MAX_FILE_SIZE_MB}MB.`
            );
            return;
        }

        if (valid.length < files.length) {
            setError(
                `Some files were skipped (unsupported type or over ${MAX_FILE_SIZE_MB}MB).`
            );
        }

        const toProcess = valid.slice(0, Math.max(remainingSlots, 0));

        if (toProcess.length === 0) {
            setError(`You can upload up to ${maxImages} images.`);
            return;
        }

        setUploading(true);
        try {
            // Replace readAsDataUrl(file) with a real upload call
            // (e.g. uploadImage(file) -> returns a hosted URL) once
            // a backend upload endpoint exists. The rest of the flow
            // stays identical since we just append resulting URLs.
            const uploaded = await Promise.all(toProcess.map(readAsDataUrl));
            onChange([...images, ...uploaded]);
        } catch {
            setError("Something went wrong reading those images.");
        } finally {
            setUploading(false);
        }
    };

    const handleInputChange = async (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            await processFiles(e.target.files);
        }
        e.target.value = "";
    };

    const handleDrop = async (e: DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setIsDragging(false);
        if (disabled || uploading) return;
        if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
            await processFiles(e.dataTransfer.files);
        }
    };

    const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        if (disabled || uploading) return;
        setIsDragging(true);
    };

    const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setIsDragging(false);
    };

    const removeImage = (index: number) => {
        onChange(images.filter((_, i) => i !== index));
    };

    return (
        <div className="space-y-3">
            {/* Dropzone */}
            <div
                role="button"
                tabIndex={0}
                onClick={() => !disabled && !uploading && inputRef.current?.click()}
                onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                        inputRef.current?.click();
                    }
                }}
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                className={cn(
                    "flex cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed px-6 py-8 text-center transition-colors",
                    isDragging
                        ? "border-primary bg-primary/5"
                        : "border-input hover:border-primary/50 hover:bg-muted/40",
                    (disabled || uploading || remainingSlots <= 0) &&
                        "pointer-events-none opacity-60"
                )}
            >
                <input
                    ref={inputRef}
                    type="file"
                    accept={ACCEPTED_TYPES.join(",")}
                    multiple
                    className="hidden"
                    disabled={disabled || uploading}
                    onChange={handleInputChange}
                />

                {uploading ? (
                    <>
                        <Loader2 className="h-8 w-8 animate-spin text-primary" />
                        <p className="text-sm font-medium">Processing images...</p>
                    </>
                ) : (
                    <>
                        <div className="rounded-full bg-primary/10 p-3">
                            <UploadCloud className="h-6 w-6 text-primary" />
                        </div>
                        <p className="text-sm font-medium">
                            Drag & drop images here, or{" "}
                            <span className="text-primary underline underline-offset-2">
                                browse
                            </span>
                        </p>
                        <p className="text-xs text-muted-foreground">
                            JPG, PNG, WEBP or AVIF, up to {MAX_FILE_SIZE_MB}MB each
                            {" · "}
                            {remainingSlots > 0
                                ? `${remainingSlots} slot${remainingSlots === 1 ? "" : "s"} left`
                                : "Limit reached"}
                        </p>
                    </>
                )}
            </div>

            {error && (
                <p className="text-sm font-medium text-destructive">{error}</p>
            )}

            {/* Previews */}
            {images.length > 0 && (
                <div className="grid grid-cols-3 gap-3 sm:grid-cols-4 md:grid-cols-5">
                    {images.map((url, i) => (
                        <div
                            key={i}
                            className="group relative aspect-square overflow-hidden rounded-lg border bg-muted"
                        >
                            <Image
                                src={url}
                                alt={`Property image ${i + 1}`}
                                fill
                                sizes="120px"
                                className="object-cover"
                                unoptimized={url.startsWith("data:")}
                            />

                            {i === 0 && (
                                <span className="absolute left-1.5 top-1.5 rounded-full bg-primary px-2 py-0.5 text-[10px] font-medium text-primary-foreground shadow">
                                    Cover
                                </span>
                            )}

                            <button
                                type="button"
                                onClick={() => removeImage(i)}
                                disabled={disabled || uploading}
                                className="absolute right-1.5 top-1.5 flex h-6 w-6 items-center justify-center rounded-full bg-black/60 text-white opacity-0 transition-opacity hover:bg-black/80 group-hover:opacity-100 disabled:pointer-events-none"
                                aria-label={`Remove image ${i + 1}`}
                            >
                                <X className="h-3.5 w-3.5" />
                            </button>
                        </div>
                    ))}

                    {/* Add-more tile */}
                    {remainingSlots > 0 && !uploading && (
                        <button
                            type="button"
                            onClick={() => inputRef.current?.click()}
                            disabled={disabled}
                            className="flex aspect-square flex-col items-center justify-center gap-1 rounded-lg border-2 border-dashed text-muted-foreground transition-colors hover:border-primary/50 hover:text-primary disabled:pointer-events-none disabled:opacity-60"
                        >
                            <ImagePlus className="h-5 w-5" />
                            <span className="text-xs">Add more</span>
                        </button>
                    )}
                </div>
            )}
        </div>
    );
}