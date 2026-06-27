import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import MainLayout from '@/components/layouts/MainLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { getTrips, getExpenses, createExpense, deleteExpense } from '@/lib/api';
import type { Trip, Expense } from '@/types/types';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { IndianRupee, Plus, Trash2, Wallet, TrendingUp, PieChart, ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';

const EXPENSE_CATS = ['accommodation', 'transport', 'food', 'activities', 'shopping', 'medical', 'other'];
const CAT_COLORS: Record<string, string> = {
  accommodation: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300',
  transport: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300',
  food: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300',
  activities: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300',
  shopping: 'bg-pink-100 text-pink-700 dark:bg-pink-900/30 dark:text-pink-300',
  medical: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300',
  other: 'bg-muted text-muted-foreground',
};

export default function TravelWalletPage() {
  const { user } = useAuth();
  const [trips, setTrips] = useState<Trip[]>([]);
  const [selectedTripId, setSelectedTripId] = useState<string>('all');
  const [allExpenses, setAllExpenses] = useState<Expense[]>([]);
  const [addOpen, setAddOpen] = useState(false);
  const [newExp, setNewExp] = useState({ title: '', category: 'food', amount: 0, expense_date: new Date().toISOString().slice(0, 10), trip_id: '' });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    getTrips(user.id).then(async t => {
      setTrips(t);
      const allExps = await Promise.all(t.map(trip => getExpenses(trip.id)));
      setAllExpenses(allExps.flat());
      if (t.length > 0) setNewExp(p => ({ ...p, trip_id: t[0].id }));
      setLoading(false);
    });
  }, [user]);

  const filteredExpenses = selectedTripId === 'all'
    ? allExpenses
    : allExpenses.filter(e => e.trip_id === selectedTripId);

  const totalSpent = filteredExpenses.reduce((s, e) => s + e.amount, 0);
  const byCategory: Record<string, number> = {};
  filteredExpenses.forEach(e => { byCategory[e.category] = (byCategory[e.category] || 0) + e.amount; });
  const sortedCats = Object.entries(byCategory).sort(([, a], [, b]) => b - a);

  const activeTrip = selectedTripId !== 'all' ? trips.find(t => t.id === selectedTripId) : null;
  const budgetPct = activeTrip ? Math.min(100, Math.round((totalSpent / activeTrip.total_budget) * 100)) : 0;

  const handleAdd = async () => {
    if (!user || !newExp.title || !newExp.amount || !newExp.trip_id) { toast.error('Fill in all fields.'); return; }
    const result = await createExpense({ trip_id: newExp.trip_id, user_id: user.id, title: newExp.title, category: newExp.category, amount: newExp.amount, expense_date: newExp.expense_date, notes: null });
    if (result) {
      setAllExpenses(prev => [result, ...prev]);
      setAddOpen(false);
      setNewExp(p => ({ ...p, title: '', amount: 0 }));
      toast.success('Expense added!');
    }
  };

  const handleDelete = async (expId: string) => {
    await deleteExpense(expId);
    setAllExpenses(prev => prev.filter(e => e.id !== expId));
    toast.success('Expense removed.');
  };

  return (
    <MainLayout>
      <div className="max-w-4xl mx-auto px-4 md:px-6 py-8 md:py-10 space-y-8">
        <div className="flex items-end justify-between">
          <div className="space-y-1">
            <h1 className="text-2xl md:text-3xl font-semibold flex items-center gap-2">
              <Wallet className="h-6 w-6 text-primary" strokeWidth={1.5} />
              Travel Wallet
            </h1>
            <p className="text-sm text-muted-foreground">Track all your travel spending in one place.</p>
          </div>
          <Dialog open={addOpen} onOpenChange={setAddOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2"><Plus className="h-4 w-4" />Add Expense</Button>
            </DialogTrigger>
            <DialogContent className="max-w-[calc(100%-2rem)] md:max-w-lg">
              <DialogHeader><DialogTitle>Add Expense</DialogTitle></DialogHeader>
              <div className="space-y-4 pt-2">
                <div className="space-y-1.5"><Label className="text-sm font-normal">Trip</Label>
                  <Select value={newExp.trip_id} onValueChange={v => setNewExp(p => ({ ...p, trip_id: v }))}>
                    <SelectTrigger className="px-3"><SelectValue /></SelectTrigger>
                    <SelectContent>{trips.map(t => <SelectItem key={t.id} value={t.id}>{t.title}</SelectItem>)}</SelectContent>
                  </Select>
                </div>
                <div className="space-y-1.5"><Label className="text-sm font-normal">Description</Label><Input value={newExp.title} onChange={e => setNewExp(p => ({ ...p, title: e.target.value }))} className="px-3" placeholder="e.g. Lunch at Amber restaurant" /></div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5"><Label className="text-sm font-normal">Category</Label>
                    <Select value={newExp.category} onValueChange={v => setNewExp(p => ({ ...p, category: v }))}>
                      <SelectTrigger className="px-3"><SelectValue /></SelectTrigger>
                      <SelectContent>{EXPENSE_CATS.map(c => <SelectItem key={c} value={c} className="capitalize">{c}</SelectItem>)}</SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-1.5"><Label className="text-sm font-normal">Amount (₹)</Label><Input type="number" min={0} value={newExp.amount} onChange={e => setNewExp(p => ({ ...p, amount: parseFloat(e.target.value) || 0 }))} className="px-3" /></div>
                </div>
                <div className="space-y-1.5"><Label className="text-sm font-normal">Date</Label><Input type="date" value={newExp.expense_date} onChange={e => setNewExp(p => ({ ...p, expense_date: e.target.value }))} className="px-3" /></div>
                <Button onClick={handleAdd} className="w-full">Add Expense</Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Trip filter */}
        <div className="flex gap-2 overflow-x-auto pb-1 whitespace-nowrap">
          <button onClick={() => setSelectedTripId('all')} className={cn('px-4 py-1.5 rounded-full border text-xs transition-colors shrink-0', selectedTripId === 'all' ? 'border-primary bg-primary text-primary-foreground' : 'border-border text-muted-foreground hover:border-foreground')}>
            All Trips
          </button>
          {trips.map(t => (
            <button key={t.id} onClick={() => setSelectedTripId(t.id)} className={cn('px-4 py-1.5 rounded-full border text-xs transition-colors shrink-0', selectedTripId === t.id ? 'border-primary bg-primary text-primary-foreground' : 'border-border text-muted-foreground hover:border-foreground')}>
              {t.title}
            </button>
          ))}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="border border-border rounded-lg p-4 space-y-1">
            <p className="text-xs text-muted-foreground">Total Spent</p>
            <p className="text-2xl font-semibold">₹{totalSpent.toLocaleString('en-IN')}</p>
          </div>
          {activeTrip ? (
            <div className="border border-border rounded-lg p-4 space-y-2 md:col-span-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Budget usage</span>
                <span className="font-medium">₹{totalSpent.toLocaleString('en-IN')} / ₹{activeTrip.total_budget.toLocaleString('en-IN')}</span>
              </div>
              <Progress value={budgetPct} className={cn('h-2', budgetPct >= 90 ? '[&>div]:bg-destructive' : '')} />
              <p className="text-xs text-muted-foreground">₹{(activeTrip.total_budget - totalSpent).toLocaleString('en-IN')} remaining</p>
            </div>
          ) : (
            <div className="border border-border rounded-lg p-4 space-y-1">
              <p className="text-xs text-muted-foreground">Transactions</p>
              <p className="text-2xl font-semibold">{filteredExpenses.length}</p>
            </div>
          )}
        </div>

        {/* Category breakdown */}
        {sortedCats.length > 0 && (
          <div className="border border-border rounded-lg p-5 space-y-4">
            <h2 className="font-medium text-sm flex items-center gap-2">
              <PieChart className="h-4 w-4 text-primary" />Spending by Category
            </h2>
            <div className="space-y-2.5">
              {sortedCats.map(([cat, amt]) => (
                <div key={cat} className="flex items-center gap-3">
                  <span className={cn('text-xs px-2 py-0.5 rounded capitalize w-24 shrink-0 text-center', CAT_COLORS[cat] || CAT_COLORS.other)}>{cat}</span>
                  <div className="flex-1"><Progress value={Math.round((amt / totalSpent) * 100)} className="h-1.5" /></div>
                  <span className="text-xs font-medium w-20 text-right shrink-0">₹{amt.toLocaleString('en-IN')}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Expense list */}
        {filteredExpenses.length === 0 ? (
          <div className="text-center py-16 space-y-3">
            <IndianRupee className="h-10 w-10 text-muted-foreground mx-auto" strokeWidth={1.5} />
            <p className="text-muted-foreground">No expenses logged yet. Start adding!</p>
          </div>
        ) : (
          <div className="space-y-2">
            <h2 className="font-medium text-sm">Recent Expenses</h2>
            <div className="overflow-x-auto">
              <table className="w-full min-w-max text-sm">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left text-xs text-muted-foreground font-normal py-2 px-3 whitespace-nowrap">Description</th>
                    <th className="text-left text-xs text-muted-foreground font-normal py-2 px-3 whitespace-nowrap">Category</th>
                    <th className="text-left text-xs text-muted-foreground font-normal py-2 px-3 whitespace-nowrap">Date</th>
                    <th className="text-right text-xs text-muted-foreground font-normal py-2 px-3 whitespace-nowrap">Amount</th>
                    <th className="py-2 px-3 whitespace-nowrap"></th>
                  </tr>
                </thead>
                <tbody>
                  {filteredExpenses.slice(0, 50).map(exp => (
                    <tr key={exp.id} className="border-b border-border">
                      <td className="py-2.5 px-3 whitespace-nowrap">{exp.title}</td>
                      <td className="py-2.5 px-3 whitespace-nowrap"><span className={cn('text-xs px-2 py-0.5 rounded capitalize', CAT_COLORS[exp.category] || CAT_COLORS.other)}>{exp.category}</span></td>
                      <td className="py-2.5 px-3 text-muted-foreground whitespace-nowrap">{new Date(exp.expense_date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}</td>
                      <td className="py-2.5 px-3 font-medium text-right whitespace-nowrap">₹{exp.amount.toLocaleString('en-IN')}</td>
                      <td className="py-2.5 px-3 whitespace-nowrap"><button onClick={() => handleDelete(exp.id)} className="text-muted-foreground hover:text-destructive transition-colors"><Trash2 className="h-4 w-4" /></button></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </MainLayout>
  );
}
