import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api, buildUrl, type InsertIncome } from "@shared/routes";
import { useToast } from "@/hooks/use-toast";

export function useIncomes() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const { data: incomes, isLoading } = useQuery({
    queryKey: [api.incomes.list.path],
    queryFn: async () => {
      const res = await fetch(api.incomes.list.path);
      if (!res.ok) throw new Error("Failed to fetch incomes");
      return api.incomes.list.responses[200].parse(await res.json());
    },
  });

  const createIncomeMutation = useMutation({
    mutationFn: async (data: InsertIncome) => {
      const res = await fetch(api.incomes.create.path, {
        method: api.incomes.create.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Failed to create income");
      return api.incomes.create.responses[201].parse(await res.json());
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.incomes.list.path] });
      queryClient.invalidateQueries({ queryKey: [api.stats.summary.path] });
      toast({ title: "Success", description: "Income added successfully" });
    },
    onError: () => {
      toast({ title: "Error", description: "Failed to add income", variant: "destructive" });
    },
  });

  const deleteIncomeMutation = useMutation({
    mutationFn: async (id: number) => {
      const url = buildUrl(api.incomes.delete.path, { id });
      const res = await fetch(url, { method: api.incomes.delete.method });
      if (!res.ok) throw new Error("Failed to delete income");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.incomes.list.path] });
      queryClient.invalidateQueries({ queryKey: [api.stats.summary.path] });
      toast({ title: "Success", description: "Income deleted" });
    },
    onError: () => {
      toast({ title: "Error", description: "Failed to delete income", variant: "destructive" });
    },
  });

  return {
    incomes,
    isLoading,
    createIncome: createIncomeMutation.mutate,
    isCreating: createIncomeMutation.isPending,
    deleteIncome: deleteIncomeMutation.mutate,
    isDeleting: deleteIncomeMutation.isPending,
  };
}
