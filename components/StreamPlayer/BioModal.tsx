"use client";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Hint } from "@/components/Hint";
import { useState, useTransition, useRef } from "react";
import { updateUser } from "@/actions/user";
import { toast } from "sonner";

interface BioModalProps {
  initialBio: string | null;
}

export const BioModal = ({ initialBio }: BioModalProps) => {
  const closeRef = useRef<HTMLButtonElement>(null);
  const [bio, setBio] = useState(initialBio || "");
  const [isPending, startTransition] = useTransition();
  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    startTransition(() => {
      updateUser({ bio })
      .then(() => {
        toast.success("Bio updated");
        closeRef.current?.click();
      })
      .catch(() => toast.error("Something went wrong"));
    })
  }
  return (
    <Dialog>
      <DialogTrigger render={
        <Button variant="link" size="sm" className="ml-auto">
          Edit
        </Button>
      }>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Bio</DialogTitle>
          <DialogDescription>
            Edit your bio to share with your followers.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={onSubmit} className="space-y-4">
          <Textarea
            value={bio}
            onChange={(e) => {setBio(e.target.value)}}
            placeholder="User bio"
            className="resize-none"
            disabled={isPending}
          />
          <div className="flex justify-between">
            <DialogClose ref={closeRef} render={
              <Button variant="outline" size="sm">Cancel</Button>
            }/>
            
            <Button type="submit" variant="primary" disabled={isPending}>Save</Button>
          </div>
          
        </form>
        
      </DialogContent>
  
    </Dialog>
  )
}