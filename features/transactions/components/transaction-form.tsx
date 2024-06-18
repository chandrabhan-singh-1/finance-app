import { z } from "zod";
import { Trash } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { insertTransactionSchema } from "@/db/schema";
import { NewSelect } from "@/components/new-select";
import { DatePicker } from "@/components/date-picker";
import { Textarea } from "@/components/ui/textarea";
import { AmountInput } from "@/components/amount-input";
import { convertAmountToMiliunits } from "@/lib/utils";

const formSchema = z.object({
  date: z.coerce.date(),
  accountId: z.string(),
  categoryId: z.string().nullable().optional(),
  payee: z.string(),
  amount: z.string(),
  notes: z.string().nullable().optional(),
});

const apiSchema = insertTransactionSchema.omit({
  id: true,
});

type FormValues = z.input<typeof formSchema>;
type ApiFormValues = z.input<typeof apiSchema>;

type Props = {
  id?: string;
  defaultValues?: FormValues;
  onSubmit: (values: ApiFormValues) => void;
  onDelete?: () => void;
  disabled?: boolean;
  accountOptions: { label: string; value: string }[];
  onCreateAccount: (name: string) => void;
  categoryOptions: { label: string; value: string }[];
  onCreateCategory: (name: string) => void;
};

export const TransactionForm = ({
  id,
  defaultValues,
  onSubmit,
  onDelete,
  disabled,
  accountOptions,
  onCreateAccount,
  categoryOptions,
  onCreateCategory,
}: Props) => {
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: defaultValues,
  });

  const handleSubmit = (values: FormValues) => {
    const amount = parseFloat(values.amount);
    const amountInMiliunits = convertAmountToMiliunits(amount);

    onSubmit({
      ...values,
      amount: amountInMiliunits,
    });
  };

  const handleDelete = () => {
    onDelete?.();
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleSubmit)}
        className="space-y-4 pt-4"
      >
        <FormField
          name="date"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <DatePicker
                  value={field.value}
                  disabled={disabled}
                  onChange={field.onChange}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          name="accountId"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Account</FormLabel>
              <FormControl>
                <NewSelect
                  placeholder="Select an account"
                  value={field.value}
                  disabled={disabled}
                  options={accountOptions}
                  onCreate={onCreateAccount}
                  onChange={field.onChange}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          name="categoryId"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Category</FormLabel>
              <FormControl>
                <NewSelect
                  placeholder="Select a category"
                  value={field.value}
                  disabled={disabled}
                  options={categoryOptions}
                  onCreate={onCreateCategory}
                  onChange={field.onChange}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          name="payee"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Payee</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  disabled={disabled}
                  placeholder="Add a payee"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          name="amount"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Amount</FormLabel>
              <FormControl>
                <AmountInput
                  value={field.value}
                  disabled={disabled}
                  placeholder="0.00"
                  onChange={field.onChange}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          name="notes"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Notes</FormLabel>
              <FormControl>
                <Textarea
                  {...field}
                  value={field.value ?? ""}
                  disabled={disabled}
                  placeholder="Optional notes"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" disabled={disabled} className="w-full">
          {id ? "Save Changes" : "Add Transaction"}
        </Button>
        {!!id && (
          <Button
            type="button"
            disabled={disabled}
            onClick={handleDelete}
            variant={"outline"}
            className="w-full flex items-center justify-center gap-2"
          >
            <Trash className="size-4" />
            Delete Transaction
          </Button>
        )}
      </form>
    </Form>
  );
};
