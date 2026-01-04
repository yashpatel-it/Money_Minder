import { AppLayout } from "@/components/layout/AppLayout";
import { useExpenses } from "@/hooks/use-expenses";
import { useCategories } from "@/hooks/use-categories";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Plus, Trash2, Search, Filter, CalendarIcon, Utensils, Plane, Home, GraduationCap, Stethoscope, Film, MoreHorizontal } from "lucide-react";

const getCategoryIcon = (name: string) => {
  switch (name.toLowerCase()) {
    case "food": return <Utensils className="w-4 h-4" />;
    case "travel": return <Plane className="w-4 h-4" />;
    case "rent": return <Home className="w-4 h-4" />;
    case "education": return <GraduationCap className="w-4 h-4" />;
    case "medical": return <Stethoscope className="w-4 h-4" />;
    case "entertainment": return <Film className="w-4 h-4" />;
    default: return <MoreHorizontal className="w-4 h-4" />;
  }
};
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertExpenseSchema } from "@shared/schema";
import { format } from "date-fns";
import { useState } from "react";
import { z } from "zod";

export default function ExpensesPage() {
  const { expenses, createExpense, deleteExpense, isCreating, isLoading } = useExpenses();
  const { categories } = useCategories();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  // Filter expenses by search term
  const filteredExpenses = expenses?.filter(e => 
    e.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    e.category?.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formSchema = insertExpenseSchema.extend({
    amount: z.coerce.number().positive(),
    categoryId: z.coerce.number(),
    date: z.coerce.date(),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      date: new Date(),
      paymentMode: "Cash",
    }
  });

  const onSubmit = (data: z.infer<typeof formSchema>) => {
    createExpense(data, {
      onSuccess: () => {
        setIsDialogOpen(false);
        form.reset();
      }
    });
  };

  const expenseCategories = categories?.filter(c => c.type === 'expense') || [];

  return (
    <AppLayout>
      <div className="space-y-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-display font-bold text-foreground">Expenses</h1>
            <p className="text-muted-foreground mt-2">Track your spending habits.</p>
          </div>
          
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="shadow-lg shadow-primary/25 hover:shadow-primary/40 transition-all">
                <Plus className="w-4 h-4 mr-2" /> Add Expense
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>Add New Expense</DialogTitle>
              </DialogHeader>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 mt-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Amount</Label>
                    <div className="relative">
                      <span className="absolute left-3 top-2.5 text-muted-foreground">₹</span>
                      <Input 
                        type="number" 
                        step="0.01" 
                        className="pl-7" 
                        placeholder="0.00"
                        {...form.register("amount")}
                      />
                    </div>
                    {form.formState.errors.amount && (
                      <p className="text-xs text-destructive">{form.formState.errors.amount.message}</p>
                    )}
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
                  <Label>Category</Label>
                  <Select onValueChange={(val) => form.setValue("categoryId", parseInt(val))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select Category" />
                    </SelectTrigger>
                    <SelectContent>
                      {expenseCategories.map((cat) => (
                        <SelectItem key={cat.id} value={cat.id.toString()}>
                          <div className="flex items-center gap-2">
                            {getCategoryIcon(cat.name)}
                            {cat.name}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {form.formState.errors.categoryId && (
                    <p className="text-xs text-destructive">Please select a category</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label>Payment Mode</Label>
                  <Select 
                    defaultValue="Cash"
                    onValueChange={(val) => form.setValue("paymentMode", val)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select Mode" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Cash">Cash</SelectItem>
                      <SelectItem value="Card">Card</SelectItem>
                      <SelectItem value="UPI">UPI</SelectItem>
                      <SelectItem value="Bank Transfer">Bank Transfer</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Description</Label>
                  <Input 
                    placeholder="Dinner, Taxi, etc."
                    {...form.register("description")}
                  />
                </div>

                <div className="flex justify-end gap-3 pt-4">
                  <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
                  <Button type="submit" disabled={isCreating}>
                    {isCreating ? "Adding..." : "Add Expense"}
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
              placeholder="Search expenses..." 
              className="pl-9 bg-white" 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Button variant="outline" className="gap-2 bg-white">
            <Filter className="w-4 h-4" /> Filter
          </Button>
        </div>

        <div className="bg-white rounded-2xl border border-border shadow-sm overflow-hidden">
          <div className="grid grid-cols-12 gap-4 p-4 bg-muted/30 text-xs font-semibold text-muted-foreground uppercase tracking-wider border-b border-border">
            <div className="col-span-2">Date</div>
            <div className="col-span-3">Description</div>
            <div className="col-span-2">Category</div>
            <div className="col-span-2">Mode</div>
            <div className="col-span-2 text-right">Amount</div>
            <div className="col-span-1 text-center">Action</div>
          </div>
          
          <div className="divide-y divide-border">
            {isLoading ? (
              <div className="p-8 text-center text-muted-foreground">Loading expenses...</div>
            ) : filteredExpenses && filteredExpenses.length > 0 ? (
              filteredExpenses.map((expense) => (
                <div key={expense.id} className="grid grid-cols-12 gap-4 p-4 items-center hover:bg-secondary/20 transition-colors text-sm">
                  <div className="col-span-2 text-muted-foreground flex items-center gap-2">
                    <CalendarIcon className="w-3 h-3" />
                    {format(new Date(expense.date), "MMM d, yyyy")}
                  </div>
                  <div className="col-span-3 font-medium text-foreground truncate">
                    {expense.description || "-"}
                  </div>
                  <div className="col-span-2">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary">
                      {getCategoryIcon(expense.category?.name || "")}
                      {expense.category?.name}
                    </span>
                  </div>
                  <div className="col-span-2 text-muted-foreground">{expense.paymentMode}</div>
                  <div className="col-span-2 text-right font-bold text-rose-600">
                    -₹{Number(expense.amount).toLocaleString()}
                  </div>
                  <div className="col-span-1 text-center">
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-8 w-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                      onClick={() => {
                        if (confirm("Are you sure you want to delete this expense?")) {
                          deleteExpense(expense.id);
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
                <div className="w-16 h-16 bg-secondary rounded-full flex items-center justify-center mb-4">
                  <Search className="w-8 h-8 opacity-20" />
                </div>
                <p>No expenses found</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
