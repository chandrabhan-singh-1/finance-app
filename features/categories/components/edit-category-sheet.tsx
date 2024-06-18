import { z } from "zod";

import {
  Sheet,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetContent,
} from "@/components/ui/sheet";
import { useOpenCategory } from "../hooks/use-open-category";
import { CategoryForm } from "./category-form";
import { insertCategorySchema } from "@/db/schema";
import { useGetCategory } from "../api/use-get-category";
import { Loader2 } from "lucide-react";
import { useEditCategory } from "../api/use-edit-category";
import { useDeleteCategory } from "../api/use-delete-category";
import { useConfirm } from "@/hooks/use-confirm";

const formSchema = insertCategorySchema.pick({
  name: true,
});

type FormValues = z.input<typeof formSchema>;

export const EditCategorySheet = () => {
  const { id, isOpen, onClose } = useOpenCategory();

  const categoryQuery = useGetCategory(id);
  const editMutation = useEditCategory(id);
  const deleteMutation = useDeleteCategory(id);

  const isPending = editMutation.isPending || deleteMutation.isPending;

  const isLoading = categoryQuery.isLoading;

  const [ConfirmationDialog, confirm] = useConfirm(
    "Are you sure?",
    "You are about to DELETE this category."
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

  const defaultValues = categoryQuery.data
    ? {
        name: categoryQuery.data.name,
      }
    : {
        name: "",
      };

  return (
    <>
      <ConfirmationDialog />
      <Sheet open={isOpen} onOpenChange={onClose}>
        <SheetContent className="space-y-4">
          <SheetHeader>
            <SheetTitle>Edit Category</SheetTitle>
            <SheetDescription>Edit an existing category.</SheetDescription>
          </SheetHeader>
          {isLoading ? (
            <div className="absolute inset-0 flex items-center justify-center">
              <Loader2 className="size-6 text-muted-foreground animate-spin" />
            </div>
          ) : (
            <CategoryForm
              id={id}
              onSubmit={onSubmit}
              disabled={isPending}
              defaultValues={defaultValues}
              onDelete={onDelete}
            />
          )}
        </SheetContent>
      </Sheet>
    </>
  );
};
