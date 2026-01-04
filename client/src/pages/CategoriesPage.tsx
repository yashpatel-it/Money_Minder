import { AppLayout } from "@/components/layout/AppLayout";
import { useCategories } from "@/hooks/use-categories";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tag, Plus, Check } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertCategorySchema } from "@shared/schema";
import { useState } from "react";
import { z } from "zod";

export default function CategoriesPage() {
  const { categories, createCategory, isCreating, isLoading } = useCategories();
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const formSchema = insertCategorySchema;
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      type: "expense",
      isDefault: false
    }
  });

  const onSubmit = (data: z.infer<typeof formSchema>) => {
    createCategory(data, {
      onSuccess: () => {
        setIsDialogOpen(false);
        form.reset();
      }
    });
  };

  const expenseCategories = categories?.filter(c => c.type === 'expense') || [];
  const incomeCategories = categories?.filter(c => c.type === 'income') || [];

  return (
    <AppLayout>
      <div className="space-y-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-display font-bold text-foreground">Categories</h1>
            <p className="text-muted-foreground mt-2">Organize your finances.</p>
          </div>
          
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="w-4 h-4 mr-2" /> New Category
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create Custom Category</DialogTitle>
              </DialogHeader>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 mt-4">
                <div className="space-y-2">
                  <Label>Name</Label>
                  <Input {...form.register("name")} placeholder="e.g. Subscriptions" />
                  {form.formState.errors.name && (
                    <p className="text-xs text-destructive">{form.formState.errors.name.message}</p>
                  )}
                </div>
                
                <div className="space-y-2">
                  <Label>Type</Label>
                  <Select 
                    defaultValue="expense"
                    onValueChange={(val) => form.setValue("type", val)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="expense">Expense</SelectItem>
                      <SelectItem value="income">Income</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex justify-end gap-3 pt-4">
                  <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
                  <Button type="submit" disabled={isCreating}>
                    {isCreating ? "Creating..." : "Create Category"}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Expense Categories */}
          <Card className="border-border/60 shadow-md">
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <div className="p-2 bg-rose-100 rounded-lg text-rose-600">
                  <Tag className="w-4 h-4" />
                </div>
                Expense Categories
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {isLoading ? (
                  <p className="text-muted-foreground">Loading...</p>
                ) : (
                  expenseCategories.map(cat => (
                    <div key={cat.id} className="flex items-center gap-3 p-3 rounded-lg border border-border bg-card/50">
                      <div className="w-2 h-2 rounded-full bg-rose-500" />
                      <span className="font-medium">{cat.name}</span>
                      {cat.isDefault && (
                        <span className="ml-auto text-[10px] uppercase font-bold text-muted-foreground bg-muted px-1.5 py-0.5 rounded">Default</span>
                      )}
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>

          {/* Income Categories (Using same table structure in schema but different type) */}
          {/* Note: Incomes usually use 'source' field directly in this simple schema, but if categories were used: */}
          <Card className="border-border/60 shadow-md">
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <div className="p-2 bg-emerald-100 rounded-lg text-emerald-600">
                  <Tag className="w-4 h-4" />
                </div>
                Income Categories
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                 {isLoading ? (
                  <p className="text-muted-foreground">Loading...</p>
                ) : incomeCategories.length > 0 ? (
                  incomeCategories.map(cat => (
                    <div key={cat.id} className="flex items-center gap-3 p-3 rounded-lg border border-border bg-card/50">
                      <div className="w-2 h-2 rounded-full bg-emerald-500" />
                      <span className="font-medium">{cat.name}</span>
                    </div>
                  ))
                ) : (
                  <div className="col-span-full py-8 text-center text-muted-foreground text-sm">
                    No custom income categories yet
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AppLayout>
  );
}
