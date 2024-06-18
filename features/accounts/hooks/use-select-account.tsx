import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { useGetAccounts } from "../api/use-get-accounts";
import { useCreateAccount } from "../api/use-create-account";
import { NewSelect } from "@/components/new-select";

export const useSelectAccount = (): [
  () => JSX.Element,
  () => Promise<unknown>
] => {
  const accountsQuery = useGetAccounts();
  const accountMutation = useCreateAccount();
  const onCreateAccount = (name: string) => accountMutation.mutate({ name });
  const accountOptions = (accountsQuery.data ?? []).map((account) => ({
    label: account.name,
    value: account.id,
  }));

  const [promise, setPromise] = useState<{
    resolve: (value: string | undefined) => void;
  } | null>(null);
  const selectValue = useRef<string>();

  const confirm = () =>
    new Promise((resolve, reject) => {
      setPromise({ resolve });
    });

  const handleClose = () => {
    setPromise(null);
  };

  const handleConfirm = () => {
    promise?.resolve(selectValue.current);
    handleClose();
  };

  const handleCancel = () => {
    promise?.resolve(undefined);
    handleClose();
  };

  const AccountDialog = () => (
    <Dialog open={promise !== null}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Select Account</DialogTitle>
          <DialogDescription>
            Please select an account to continue.
          </DialogDescription>
        </DialogHeader>
        <NewSelect
          placeholder="Select an account"
          options={accountOptions}
          onCreate={onCreateAccount}
          onChange={(value) => (selectValue.current = value)}
          disabled={accountsQuery.isLoading || accountMutation.isPending}
        />
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

  return [AccountDialog, confirm];
};
