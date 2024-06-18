import { InferRequestType, InferResponseType } from "hono";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { client } from "@/lib/hono";
import { toast } from "sonner";

type RequestType = InferRequestType<
  (typeof client.api.transactions)["bulk-create"]["$post"]
>["json"];
type ResponseType = InferResponseType<
  (typeof client.api.transactions)["bulk-create"]["$post"]
>;

export const useBulkCreateTransactions = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async (json) => {
      const response = await client.api.transactions["bulk-create"]["$post"]({
        json,
      });

      return await response.json();
    },
    onSuccess: () => {
      toast.success("Transactions(s) created successfully!");
      queryClient.invalidateQueries({ queryKey: ["transactions"] });
      queryClient.invalidateQueries({ queryKey: ["summary"] });
    },
    onError: () => {
      toast.error("Failed to create transaction(s)!");
    },
  });

  return mutation;
};
