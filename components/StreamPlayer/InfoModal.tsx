"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogClose, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState, useTransition, useRef } from "react";
import { useRouter } from "next/navigation";
import { updateStream } from "@/actions/stream";
import { toast } from "sonner";
import { UploadDropzone } from "@/lib/uploadthing";


interface InfoModalProps {
  initialName: string;
  initialThumbnailUrl: string;
}

export const InfoModal = ({ initialName, initialThumbnailUrl }: InfoModalProps) => {
  const [name, setName] = useState(initialName);
  const [thumbnailUrl, setThumbnailUrl] = useState(initialThumbnailUrl);
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const closeRef = useRef<HTMLButtonElement>(null);
  const onChange =(e: React.ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value);
  }
  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log(name, thumbnailUrl);
    startTransition(() => {
      updateStream({ name })
      .then(() => {
        toast.success("Stream updated");
        closeRef.current?.click();
      })
      .catch(() => {
        toast.error("Something went wrong");
      })
    })
  }
  return (
    <Dialog>
      <DialogTrigger
        render={<Button variant="link" size="sm" className="ml-auto" />}
      >
        Edit
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Edit stream info</DialogTitle>
        </DialogHeader>
        <form className="space-y-14" onSubmit={onSubmit}>
          <div className="space-y-2">
            <Label>
              Name
            </Label>
            <Input
              placeholder="Stream name"
              onChange={onChange}
              value={name}
              disabled={isPending}
            />
          </div>
          <div className="space-y-2">
            <Label>
              Thumbnail
            </Label>
            <div className="rounded-xl border outline-dashed outline-muted">
              <UploadDropzone endpoint="imageUploader" 
              appearance={{
                label:{
                  color: "#FFFFFF"
                },
                allowedContent:{
                  color: "#FFFFFF"
                }
              }}
              onClientUploadComplete={(res) => {
                setThumbnailUrl(res[0].ufsUrl);
                router.refresh();
              }}
             
              />
            
            </div>
          </div>
          <div className="flex justify-between">
            <DialogClose ref={closeRef} render={<Button type="button" variant="ghost" >Cancel</Button>} />
            <Button disabled={isPending} variant="primary" type="submit">Save</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
