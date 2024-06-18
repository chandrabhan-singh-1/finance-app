import { useState } from "react";
import { Button } from "@/components/ui/button";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { setSourceMapsEnabled } from "process";

export const useConfirm = (
  title: string,
  message: string
): [() => JSX.Element, () => Promise<unknown>] => {
  const [open, setOpen] = useState<boolean>(false);
  const [promise, setPromise] = useState<{
    resolve: (value: boolean) => void;
  } | null>(null);

  const confirm = () =>
    new Promise((resolve, reject) => {
      setPromise({ resolve });
    });

  const handleClose = () => {
    setPromise(null);
  };

  const handleConfirm = () => {
    promise?.resolve(true);
    handleClose();
  };

  const handleCancel = () => {
    promise?.resolve(false);
    handleClose();
  };

  const ConfirmationDialog = () => (
    <Dialog open={promise !== null}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{message}</DialogDescription>
        </DialogHeader>
        <DialogFooter className="pt-4">
          <div className="w-full flex items-center justify-between">
            <Button variant={"ghost"} onClick={handleCancel}>
              Cancel
            </Button>
            <Button onClick={handleConfirm}>Confirm</Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );

  return [ConfirmationDialog, confirm];
};
