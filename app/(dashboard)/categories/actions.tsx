"use client";

import { CheckCheck, Copy, Edit, MoreHorizontal, Trash } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";
import { useState } from "react";
import { useOpenCategory } from "@/features/categories/hooks/use-open-category";
import { useDeleteCategory } from "@/features/categories/api/use-delete-category";
import { useConfirm } from "@/hooks/use-confirm";

type Props = {
  id: string;
};

export const Actions = ({ id }: Props) => {
  const [copy, setCopy] = useState<boolean>(false);
  const { onOpen } = useOpenCategory();

  const Icon = copy ? CheckCheck : Copy;

  const deleteMutation = useDeleteCategory(id);
  const [ConfirmationDialog, confirm] = useConfirm(
    "Are you sure?",
    "You are about to delete this category."
  );

  const handleDelete = async () => {
    const ok = await confirm();

    if (ok) {
      deleteMutation.mutate({ param: { id: undefined } });
    }
  };

  return (
    <>
      <ConfirmationDialog />
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            className="h-8 w-8 p-0 focus-visible:ring-0 focus-visible:ring-offset-0 "
          >
            <span className="sr-only">Open menu</span>
            <MoreHorizontal className="size-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={() => {
              setCopy(true);
              navigator.clipboard.writeText(id);
              toast.success("Account id copied!");
              setTimeout(() => setCopy(false), 1000);
            }}
          >
            <Icon className="size-4 mr-2" /> Account ID
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => onOpen(id)}
            disabled={deleteMutation.isPending}
          >
            <Edit className="size-4 mr-2" />
            Edit
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={handleDelete}
            disabled={deleteMutation.isPending}
          >
            <Trash className="size-4 mr-2" />
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};
