"use client"

import { Button } from "@/components/ui/button";
import { IngressInput } from "livekit-server-sdk";
import { createIngress } from "@/actions/ingress";
import { useState, useTransition, useRef } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogClose,  DialogTrigger } from "@/components/ui/dialog";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertTriangleIcon } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";

const RTMP = String(IngressInput.RTMP_INPUT)
const WHIP = String(IngressInput.WHIP_INPUT)

type IngressType = typeof RTMP | typeof WHIP

const items = [
  { value: RTMP, label: "RTMP" },
  { value: WHIP, label: "WHIP" },
]

export const ConnectModal = () => {
  const closeRef = useRef<HTMLButtonElement>(null)
  const [isPending, startTransition] = useTransition()
  const [ingressType, setIngressType] = useState<IngressType>(RTMP)

  const onSubmit = () => {
    startTransition(async () => {
      await createIngress(parseInt(ingressType))
      .then(() => {
        toast.success("Ingress created successfully")
        closeRef.current?.click()
      })
      .catch(() => {
        toast.error("Failed to create ingress")
      })
    })
  }
  return (
    <Dialog>
      <DialogTrigger render={() => <Button variant="primary">Generate connection</Button>}/>
       
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Generate connection</DialogTitle>
        </DialogHeader>
        <Select items={items} value={ingressType} onValueChange={(value) => setIngressType(value as IngressType)}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Ingress Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={RTMP}>RTMP</SelectItem>
            <SelectItem value={WHIP}>WHIP</SelectItem>
          </SelectContent>
        </Select>
        <Alert>
          <AlertTriangleIcon className="w-4 h-4" />
          <AlertTitle>Warning!</AlertTitle>
          <AlertDescription>
            this action will reset all active streams using the current connection.
          </AlertDescription>
        </Alert>
        <div className="flex justify-between">
          <DialogClose  ref={closeRef} render={() => <Button variant="outline" disabled={isPending}>Cancel</Button>}/>
          <Button variant="primary" disabled={isPending} onClick={onSubmit}>Generate</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};