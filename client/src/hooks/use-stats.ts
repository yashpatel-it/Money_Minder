import { useQuery } from "@tanstack/react-query";
import { api } from "@shared/routes";

export function useStats() {
  return useQuery({
    queryKey: [api.stats.summary.path],
    queryFn: async () => {
      const res = await fetch(api.stats.summary.path);
      if (!res.ok) throw new Error("Failed to fetch stats");
      return api.stats.summary.responses[200].parse(await res.json());
    },
  });
}
