import { AppLayout } from "@/components/layout/AppLayout";
import { useExpenses } from "@/hooks/use-expenses";
import { useCategories } from "@/hooks/use-categories";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Plus, Trash2, Search, Filter, CalendarIcon, Utensils, Plane, Home, GraduationCap, Stethoscope, Film, MoreHorizontal, DollarSign, CreditCard, Smartphone, Building2 } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertExpenseSchema } from "@shared/schema";
import { format } from "date-fns";
import { useState } from "react";
import { z } from "zod";

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

const getPaymentModeIcon = (mode: string) => {
  switch (mode.toLowerCase()) {
    case "cash": return <DollarSign className="w-4 h-4" />;
    case "card": return <CreditCard className="w-4 h-4" />;
    case "upi": return <Smartphone className="w-4 h-4" />;
    case "bank transfer": return <Building2 className="w-4 h-4" />;
    default: return <DollarSign className="w-4 h-4" />;
  }
};

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
            <h1 className="text-4xl font-display font-bold bg-gradient-to-r from-rose-600 to-pink-600 bg-clip-text text-transparent">Expenses</h1>
            <p className="text-muted-foreground mt-2">Track and manage your spending with ease.</p>
          </div>
          
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="shadow-lg shadow-rose-600/30 hover:shadow-rose-600/40 transition-all bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-700 hover:to-pink-700">
                <Plus className="w-4 h-4 mr-2" /> Add Expense
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px] bg-gradient-to-br from-white to-rose-50/50">
              <DialogHeader>
                <DialogTitle className="text-2xl bg-gradient-to-r from-rose-600 to-pink-600 bg-clip-text text-transparent">Add New Expense</DialogTitle>
              </DialogHeader>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5 mt-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-sm font-semibold">Amount</Label>
                    <div className="relative group">
                      <span className="absolute left-3 top-3 text-rose-600 font-bold group-hover:text-rose-700 transition">₹</span>
                      <Input 
                        type="number" 
                        step="0.01" 
                        className="pl-7 border-2 border-rose-200/50 focus:border-rose-500 focus:ring-rose-500 rounded-lg font-semibold" 
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
                        <Button variant="outline" className="w-full border-2 border-rose-200/50 justify-start text-left font-normal hover:bg-rose-50 hover:border-rose-500">
                          <CalendarIcon className="mr-2 h-4 w-4 text-rose-600" />
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
                  <Label className="text-sm font-semibold">Category</Label>
                  <Select onValueChange={(val) => form.setValue("categoryId", parseInt(val))}>
                    <SelectTrigger className="border-2 border-rose-200/50 focus:border-rose-500 focus:ring-rose-500">
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
                  <Label className="text-sm font-semibold">Payment Mode</Label>
                  <Select 
                    defaultValue="Cash"
                    onValueChange={(val) => form.setValue("paymentMode", val)}
                  >
                    <SelectTrigger className="border-2 border-rose-200/50 focus:border-rose-500 focus:ring-rose-500">
                      <SelectValue placeholder="Select Mode" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Cash"><div className="flex items-center gap-2"><DollarSign className="w-4 h-4" />Cash</div></SelectItem>
                      <SelectItem value="Card"><div className="flex items-center gap-2"><CreditCard className="w-4 h-4" />Card</div></SelectItem>
                      <SelectItem value="UPI"><div className="flex items-center gap-2"><Smartphone className="w-4 h-4" />UPI</div></SelectItem>
                      <SelectItem value="Bank Transfer"><div className="flex items-center gap-2"><Building2 className="w-4 h-4" />Bank Transfer</div></SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-semibold">Description (Optional)</Label>
                  <Input 
                    placeholder="Dinner, Taxi, Groceries..."
                    className="border-2 border-rose-200/50 focus:border-rose-500 focus:ring-rose-500 rounded-lg"
                    {...form.register("description")}
                  />
                </div>

                <div className="flex justify-end gap-3 pt-4 border-t border-rose-100">
                  <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)} className="hover:bg-rose-50">Cancel</Button>
                  <Button type="submit" className="bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-700 hover:to-pink-700 transition-all shadow-lg shadow-rose-600/30" disabled={isCreating}>
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
              className="pl-9 bg-white border-2 border-rose-100/50 focus:border-rose-500 rounded-lg focus:ring-rose-500" 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Button variant="outline" className="gap-2 bg-white hover:bg-rose-50 border-rose-100/50">
            <Filter className="w-4 h-4" /> Filter
          </Button>
        </div>

        <div className="bg-white rounded-2xl border-2 border-rose-100/50 shadow-sm overflow-hidden">
          <div className="grid grid-cols-12 gap-4 p-4 bg-gradient-to-r from-rose-50 to-pink-50 text-xs font-semibold text-rose-700 uppercase tracking-wider border-b-2 border-rose-100">
            <div className="col-span-2">Date</div>
            <div className="col-span-3">Description</div>
            <div className="col-span-2">Category</div>
            <div className="col-span-2">Mode</div>
            <div className="col-span-2 text-right">Amount</div>
            <div className="col-span-1 text-center">Action</div>
          </div>
          
          <div className="divide-y divide-rose-100">
            {isLoading ? (
              <div className="p-8 text-center text-muted-foreground">Loading expenses...</div>
            ) : filteredExpenses && filteredExpenses.length > 0 ? (
              filteredExpenses.map((expense) => (
                <div key={expense.id} className="grid grid-cols-12 gap-4 p-4 items-center hover:bg-rose-50/50 transition-colors text-sm group">
                  <div className="col-span-2 text-muted-foreground flex items-center gap-2">
                    <CalendarIcon className="w-3.5 h-3.5 text-rose-500" />
                    {format(new Date(expense.date), "MMM d")}
                  </div>
                  <div className="col-span-3 font-medium text-foreground truncate">
                    {expense.description || "-"}
                  </div>
                  <div className="col-span-2">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-rose-100 text-rose-700 group-hover:bg-rose-200 transition">
                      {getCategoryIcon(expense.category?.name || "")}
                      {expense.category?.name}
                    </span>
                  </div>
                  <div className="col-span-2 text-muted-foreground flex items-center gap-1">
                    {getPaymentModeIcon(expense.paymentMode)}
                    {expense.paymentMode}
                  </div>
                  <div className="col-span-2 text-right font-bold text-rose-600">
                    -₹{parseFloat(String(expense.amount || 0)).toLocaleString()}
                  </div>
                  <div className="col-span-1 text-center">
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-8 w-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10 opacity-0 group-hover:opacity-100 transition-opacity"
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
                <div className="w-16 h-16 bg-rose-100 rounded-full flex items-center justify-center mb-4">
                  <Search className="w-8 h-8 text-rose-300" />
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
