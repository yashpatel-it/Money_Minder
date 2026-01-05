import { AppLayout } from "@/components/layout/AppLayout";
import { useIncomes } from "@/hooks/use-incomes";
import { Button } from "@/components/ui/button";
import { Plus, Trash2, Search, Filter, TrendingUp, CalendarIcon, Briefcase, Zap, Gift, MoreHorizontal, DollarSign } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertIncomeSchema } from "@shared/schema";
import { format } from "date-fns";
import { useState } from "react";
import { z } from "zod";

const getSourceIcon = (source: string) => {
  switch (source.toLowerCase()) {
    case "salary": return <Briefcase className="w-4 h-4" />;
    case "freelancing": return <Zap className="w-4 h-4" />;
    case "pocket money": return <Gift className="w-4 h-4" />;
    case "investments": return <TrendingUp className="w-4 h-4" />;
    case "gift": return <Gift className="w-4 h-4" />;
    default: return <DollarSign className="w-4 h-4" />;
  }
};

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
            <h1 className="text-4xl font-display font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">Income</h1>
            <p className="text-muted-foreground mt-2">Track and manage your revenue sources efficiently.</p>
          </div>
          
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 shadow-lg shadow-emerald-600/30 hover:shadow-emerald-600/40 transition-all">
                <Plus className="w-4 h-4 mr-2" /> Add Income
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px] bg-gradient-to-br from-white to-emerald-50/50">
              <DialogHeader>
                <DialogTitle className="text-2xl bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">Record Income</DialogTitle>
              </DialogHeader>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5 mt-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-sm font-semibold">Amount</Label>
                    <div className="relative group">
                      <span className="absolute left-3 top-3 text-emerald-600 font-bold group-hover:text-emerald-700 transition">₹</span>
                      <Input 
                        type="number" 
                        step="0.01" 
                        className="pl-7 border-2 border-emerald-200/50 focus:border-emerald-500 focus:ring-emerald-500 rounded-lg font-semibold" 
                        placeholder="0.00"
                        {...form.register("amount")}
                      />
                    </div>
                    {form.formState.errors.amount && (
                      <p className="text-xs text-destructive">{form.formState.errors.amount.message}</p>
                    )}
                  </div>
                  
                  <div className="space-y-2">
                    <Label className="text-sm font-semibold">Date</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button variant="outline" className="w-full border-2 border-emerald-200/50 justify-start text-left font-normal hover:bg-emerald-50 hover:border-emerald-500">
                          <CalendarIcon className="mr-2 h-4 w-4 text-emerald-600" />
                          {form.watch("date") ? format(form.watch("date"), "MMM dd, yyyy") : "Pick a date"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar
                          mode="single"
                          selected={form.watch("date")}
                          onSelect={(date) => date && form.setValue("date", date)}
                          disabled={(date) => date > new Date()}
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-semibold">Source</Label>
                  <Select onValueChange={(val) => form.setValue("source", val)}>
                    <SelectTrigger className="border-2 border-emerald-200/50 focus:border-emerald-500 focus:ring-emerald-500">
                      <SelectValue placeholder="Select Source" />
                    </SelectTrigger>
                    <SelectContent>
                      {sources.map((source) => (
                        <SelectItem key={source} value={source}>
                          <div className="flex items-center gap-2">
                            {getSourceIcon(source)}
                            {source}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {form.formState.errors.source && (
                    <p className="text-xs text-destructive">Please select a source</p>
                  )}
                </div>

                <div className="flex justify-end gap-3 pt-4 border-t border-emerald-100">
                  <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)} className="hover:bg-emerald-50">Cancel</Button>
                  <Button type="submit" className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 transition-all shadow-lg shadow-emerald-600/30" disabled={isCreating}>
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
              className="pl-9 bg-white border-2 border-emerald-100/50 focus:border-emerald-500 rounded-lg focus:ring-emerald-500" 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className="bg-white rounded-2xl border-2 border-emerald-100/50 shadow-sm overflow-hidden">
          <div className="grid grid-cols-12 gap-4 p-4 bg-gradient-to-r from-emerald-50 to-teal-50 text-xs font-semibold text-emerald-700 uppercase tracking-wider border-b-2 border-emerald-100">
            <div className="col-span-3">Date</div>
            <div className="col-span-5">Source</div>
            <div className="col-span-3 text-right">Amount</div>
            <div className="col-span-1 text-center">Action</div>
          </div>
          
          <div className="divide-y divide-emerald-100">
            {isLoading ? (
              <div className="p-8 text-center text-muted-foreground">Loading income data...</div>
            ) : filteredIncomes && filteredIncomes.length > 0 ? (
              filteredIncomes.map((income) => (
                <div key={income.id} className="grid grid-cols-12 gap-4 p-4 items-center hover:bg-emerald-50/50 transition-colors text-sm group">
                  <div className="col-span-3 text-muted-foreground flex items-center gap-2">
                    <CalendarIcon className="w-3.5 h-3.5 text-emerald-500" />
                    {format(new Date(income.date), "MMM d")}
                  </div>
                  <div className="col-span-5 font-medium flex items-center gap-2">
                    <div className="p-2 rounded-lg bg-emerald-100 text-emerald-700 group-hover:bg-emerald-200 transition">
                      {getSourceIcon(income.source)}
                    </div>
                    {income.source}
                  </div>
                  <div className="col-span-3 text-right font-bold text-emerald-600">
                    +₹{parseFloat(String(income.amount || 0)).toLocaleString()}
                  </div>
                  <div className="col-span-1 text-center">
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-8 w-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10 opacity-0 group-hover:opacity-100 transition-opacity"
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
              <div className="p-12 text-center text-muted-foreground flex flex-col items-center">
                <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mb-4">
                  <TrendingUp className="w-8 h-8 text-emerald-300" />
                </div>
                <p>No income records found</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
