import { z } from "zod";

import {
  Sheet,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetContent,
} from "@/components/ui/sheet";
import { useOpenTransaction } from "../hooks/use-open-transaction";
import { TransactionForm } from "./transaction-form";
import { insertTransactionSchema } from "@/db/schema";
import { useCreateTransaction } from "../api/use-create-transaction";
import { useGetTransaction } from "../api/use-get-transaction";
import { Loader2 } from "lucide-react";
import { useEditTransaction } from "../api/use-edit-transaction";
import { useDeleteTransaction } from "../api/use-delete-transaction";
import { useConfirm } from "@/hooks/use-confirm";
import { useGetCategories } from "@/features/categories/api/use-get-categories";
import { useCreateCategory } from "@/features/categories/api/use-create-category";
import { useGetAccounts } from "@/features/accounts/api/use-get-accounts";
import { useCreateAccount } from "@/features/accounts/api/use-create-account";

const formSchema = insertTransactionSchema.omit({
  id: true,
});

type FormValues = z.input<typeof formSchema>;

export const EditTransactionSheet = () => {
  const { id, isOpen, onClose } = useOpenTransaction();

  const transactionQuery = useGetTransaction(id);
  const editMutation = useEditTransaction(id);
  const deleteMutation = useDeleteTransaction(id);

  const categoriesQuery = useGetCategories();
  const categoryMutation = useCreateCategory();
  const onCreateCategory = (name: string) => {
    categoryMutation.mutate({
      name,
    });
  };
  const categoryOptions = (categoriesQuery.data ?? []).map((category) => ({
    label: category.name,
    value: category.id,
  }));

  const accountsQuery = useGetAccounts();
  const accountMutation = useCreateAccount();
  const onCreateAccount = (name: string) => {
    accountMutation.mutate({
      name,
    });
  };
  const accountOptions = (accountsQuery.data ?? []).map((account) => ({
    label: account.name,
    value: account.id,
  }));

  const isPending =
    editMutation.isPending ||
    deleteMutation.isPending ||
    accountMutation.isPending ||
    categoryMutation.isPending ||
    transactionQuery.isLoading;

  const isLoading =
    transactionQuery.isLoading ||
    accountsQuery.isLoading ||
    categoriesQuery.isLoading;

  const [ConfirmationDialog, confirm] = useConfirm(
    "Are you sure?",
    "You are about to DELETE this transaction."
  );

  const onDelete = async () => {
    const ok = await confirm();

    if (ok) {
      deleteMutation.mutate(
        { param: { id: undefined } },
        {
          onSuccess: () => {
            onClose();
          },
        }
      );
    }
  };

  const onSubmit = (values: FormValues) => {
    console.log(values);
    editMutation.mutate(values, {
      onSuccess: () => {
        onClose();
      },
    });
  };

  const defaultValues = transactionQuery.data
    ? {
        accountId: transactionQuery.data.accountId,
        categoryId: transactionQuery.data.categoryId,
        amount: transactionQuery.data.amount.toString(),
        payee: transactionQuery.data.payee,
        notes: transactionQuery.data.notes,
        date: transactionQuery.data.date
          ? new Date(transactionQuery.data.date)
          : new Date(),
      }
    : {
        accountId: "",
        categoryId: "",
        amount: "",
        payee: "",
        notes: "",
        date: new Date(),
      };

  return (
    <>
      <ConfirmationDialog />
      <Sheet open={isOpen} onOpenChange={onClose}>
        <SheetContent className="space-y-4">
          <SheetHeader>
            <SheetTitle>Edit Transaction</SheetTitle>
            <SheetDescription>Edit an existing Transaction.</SheetDescription>
          </SheetHeader>
          {isLoading ? (
            <div className="absolute inset-0 flex items-center justify-center">
              <Loader2 className="size-6 text-muted-foreground animate-spin" />
            </div>
          ) : (
            <TransactionForm
              id={id}
              defaultValues={defaultValues}
              onSubmit={onSubmit}
              onDelete={onDelete}
              disabled={isPending}
              categoryOptions={categoryOptions}
              onCreateCategory={onCreateCategory}
              accountOptions={accountOptions}
              onCreateAccount={onCreateAccount}
            />
          )}
        </SheetContent>
      </Sheet>
    </>
  );
};
