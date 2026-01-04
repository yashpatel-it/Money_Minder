import { AppLayout } from "@/components/layout/AppLayout";
import { useIncomes } from "@/hooks/use-incomes";
import { Button } from "@/components/ui/button";
import { Plus, Trash2, Search, Filter, TrendingUp } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertIncomeSchema } from "@shared/schema";
import { format } from "date-fns";
import { useState } from "react";
import { z } from "zod";

export default function IncomesPage() {
  const { incomes, createIncome, deleteIncome, isCreating, isLoading } = useIncomes();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const filteredIncomes = incomes?.filter(i => 
    i.source.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formSchema = insertIncomeSchema.extend({
    amount: z.coerce.number().positive(),
    date: z.coerce.date(),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      date: new Date(),
    }
  });

  const onSubmit = (data: z.infer<typeof formSchema>) => {
    createIncome(data, {
      onSuccess: () => {
        setIsDialogOpen(false);
        form.reset();
      }
    });
  };

  const sources = ["Salary", "Freelancing", "Investments", "Pocket Money", "Gift", "Other"];

  return (
    <AppLayout>
      <div className="space-y-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-display font-bold text-foreground">Income</h1>
            <p className="text-muted-foreground mt-2">Manage your revenue sources.</p>
          </div>
          
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-emerald-600 hover:bg-emerald-700 shadow-lg shadow-emerald-600/25">
                <Plus className="w-4 h-4 mr-2" /> Add Income
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>Record Income</DialogTitle>
              </DialogHeader>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 mt-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Amount</Label>
                    <div className="relative">
                      <span className="absolute left-3 top-2.5 text-muted-foreground">$</span>
                      <Input 
                        type="number" 
                        step="0.01" 
                        className="pl-7" 
                        placeholder="0.00"
                        {...form.register("amount")}
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Date</Label>
                    <Input 
                      type="date" 
                      {...form.register("date")}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Source</Label>
                  <Select onValueChange={(val) => form.setValue("source", val)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select Source" />
                    </SelectTrigger>
                    <SelectContent>
                      {sources.map((source) => (
                        <SelectItem key={source} value={source}>
                          {source}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {form.formState.errors.source && (
                    <p className="text-xs text-destructive">Please select a source</p>
                  )}
                </div>

                <div className="flex justify-end gap-3 pt-4">
                  <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
                  <Button type="submit" className="bg-emerald-600 hover:bg-emerald-700" disabled={isCreating}>
                    {isCreating ? "Adding..." : "Add Income"}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Search income sources..." 
              className="pl-9 bg-white" 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-border shadow-sm overflow-hidden">
          <div className="grid grid-cols-12 gap-4 p-4 bg-muted/30 text-xs font-semibold text-muted-foreground uppercase tracking-wider border-b border-border">
            <div className="col-span-3">Date</div>
            <div className="col-span-5">Source</div>
            <div className="col-span-3 text-right">Amount</div>
            <div className="col-span-1 text-center">Action</div>
          </div>
          
          <div className="divide-y divide-border">
            {isLoading ? (
              <div className="p-8 text-center text-muted-foreground">Loading income data...</div>
            ) : filteredIncomes && filteredIncomes.length > 0 ? (
              filteredIncomes.map((income) => (
                <div key={income.id} className="grid grid-cols-12 gap-4 p-4 items-center hover:bg-secondary/20 transition-colors text-sm">
                  <div className="col-span-3 text-muted-foreground">
                    {format(new Date(income.date), "MMMM d, yyyy")}
                  </div>
                  <div className="col-span-5 font-medium flex items-center gap-2">
                    <div className="p-1.5 rounded-md bg-emerald-100 text-emerald-700">
                      <TrendingUp className="w-4 h-4" />
                    </div>
                    {income.source}
                  </div>
                  <div className="col-span-3 text-right font-bold text-emerald-600">
                    +${Number(income.amount).toLocaleString()}
                  </div>
                  <div className="col-span-1 text-center">
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-8 w-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                      onClick={() => {
                        if (confirm("Are you sure you want to delete this record?")) {
                          deleteIncome(income.id);
                        }
                      }}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-12 text-center text-muted-foreground">
                No income records found
              </div>
            )}
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
