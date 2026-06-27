import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '@/db/supabase';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { getDestinations, createDestination, updateDestination, deleteDestination } from '@/lib/api';
import type { Destination } from '@/types/types';
import { toast } from 'sonner';
import { Shield, Users, Map, BarChart2, Plus, Pencil, Trash2, ChevronRight, Star, AlertTriangle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useNavigate } from 'react-router-dom';

export default function AdminPanelPage() {
  const { user, profile } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState({ users: 0, destinations: 0, trips: 0, reviews: 0 });
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Destination form state
  const [editDest, setEditDest] = useState<Destination | null>(null);
  const [destFormOpen, setDestFormOpen] = useState(false);
  const [destForm, setDestForm] = useState({
    name: '', slug: '', state: '', description: '',
    image_url: '', budget_min: 5000, budget_mid: 15000, budget_luxury: 40000,
    rating: 4.0, is_pilgrimage: false,
  });

  useEffect(() => {
    if (!user || profile?.role !== 'admin') { navigate('/dashboard'); return; }
    loadData();
  }, [user, profile]);

  const loadData = async () => {
    setLoading(true);
    const [destsData, { count: userCount }, { count: tripCount }, { count: reviewCount }] = await Promise.all([
      getDestinations({ limit: 100 }),
      supabase.from('profiles').select('*', { count: 'exact', head: true }),
      supabase.from('trips').select('*', { count: 'exact', head: true }),
      supabase.from('reviews').select('*', { count: 'exact', head: true }),
    ]);
    const { data: usersData } = await supabase.from('profiles').select('*').order('created_at', { ascending: false }).limit(20);

    setDestinations(destsData);
    setUsers(usersData || []);
    setStats({ users: userCount || 0, destinations: destsData.length, trips: tripCount || 0, reviews: reviewCount || 0 });
    setLoading(false);
  };

  const openNewDest = () => {
    setEditDest(null);
    setDestForm({ name: '', slug: '', state: '', description: '', image_url: '', budget_min: 5000, budget_mid: 15000, budget_luxury: 40000, rating: 4.0, is_pilgrimage: false });
    setDestFormOpen(true);
  };

  const openEditDest = (dest: Destination) => {
    setEditDest(dest);
    setDestForm({
      name: dest.name, slug: dest.slug, state: dest.state || '', description: dest.description || '',
      image_url: dest.image_url || '', budget_min: dest.budget_min, budget_mid: dest.budget_mid,
      budget_luxury: dest.budget_luxury, rating: dest.rating, is_pilgrimage: dest.is_pilgrimage || false,
    });
    setDestFormOpen(true);
  };

  const handleSaveDest = async () => {
    if (!destForm.name || !destForm.slug) { toast.error('Name and slug are required.'); return; }
    if (editDest) {
      const ok = await updateDestination(editDest.id, destForm as any);
      if (ok) { toast.success('Destination updated.'); setDestFormOpen(false); loadData(); }
      else toast.error('Failed to update destination.');
    } else {
      const result = await createDestination(destForm as any);
      if (result) { toast.success('Destination created.'); setDestFormOpen(false); loadData(); }
      else toast.error('Failed to create destination.');
    }
  };

  const handleDeleteDest = async (id: string) => {
    if (!window.confirm('Delete this destination? This cannot be undone.')) return;
    await deleteDestination(id);
    setDestinations(prev => prev.filter(d => d.id !== id));
    toast.success('Destination deleted.');
  };

  const handleUpdateUserRole = async (userId: string, role: string) => {
    const { error } = await supabase.from('profiles').update({ role } as any).eq('id', userId);
    if (!error) { setUsers(prev => prev.map(u => u.id === userId ? { ...u, role } : u)); toast.success('Role updated.'); }
    else toast.error('Failed to update role.');
  };

  if (!user || profile?.role !== 'admin') return null;

  return (
    <div className="min-h-screen bg-background">
      {/* Admin header */}
      <div className="border-b border-border bg-background px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Shield className="h-5 w-5 text-primary" />
          <h1 className="font-semibold">Yaatra Admin</h1>
          <Badge variant="secondary" className="text-xs">Admin Panel</Badge>
        </div>
        <Link to="/dashboard">
          <Button variant="outline" size="sm">Back to App</Button>
        </Link>
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-6 py-8 space-y-8">
        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: 'Total Users', value: stats.users, icon: Users },
            { label: 'Destinations', value: stats.destinations, icon: Map },
            { label: 'Trips Created', value: stats.trips, icon: BarChart2 },
            { label: 'Reviews', value: stats.reviews, icon: Star },
          ].map(s => (
            <Card key={s.label} className="h-full">
              <CardContent className="p-5 space-y-2">
                <div className="flex items-center justify-between">
                  <p className="text-xs text-muted-foreground">{s.label}</p>
                  <s.icon className="h-4 w-4 text-muted-foreground" strokeWidth={1.5} />
                </div>
                <p className="text-3xl font-semibold">{loading ? '…' : s.value}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <Tabs defaultValue="destinations" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 max-w-xs">
            <TabsTrigger value="destinations">Destinations</TabsTrigger>
            <TabsTrigger value="users">Users</TabsTrigger>
          </TabsList>

          {/* DESTINATIONS */}
          <TabsContent value="destinations" className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="font-semibold">Destinations ({destinations.length})</h2>
              <Dialog open={destFormOpen} onOpenChange={setDestFormOpen}>
                <DialogTrigger asChild>
                  <Button size="sm" className="gap-2" onClick={openNewDest}><Plus className="h-4 w-4" />Add Destination</Button>
                </DialogTrigger>
                <DialogContent className="max-w-[calc(100%-2rem)] md:max-w-2xl max-h-[90dvh] overflow-y-auto">
                  <DialogHeader><DialogTitle>{editDest ? 'Edit Destination' : 'Add Destination'}</DialogTitle></DialogHeader>
                  <div className="space-y-4 pt-2">
                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1.5"><Label className="text-sm font-normal">Name</Label><Input value={destForm.name} onChange={e => setDestForm(p => ({ ...p, name: e.target.value }))} className="px-3" /></div>
                      <div className="space-y-1.5"><Label className="text-sm font-normal">Slug</Label><Input value={destForm.slug} onChange={e => setDestForm(p => ({ ...p, slug: e.target.value }))} className="px-3" placeholder="e.g. jaipur" /></div>
                    </div>
                    <div className="space-y-1.5"><Label className="text-sm font-normal">State</Label><Input value={destForm.state} onChange={e => setDestForm(p => ({ ...p, state: e.target.value }))} className="px-3" /></div>
                    <div className="space-y-1.5"><Label className="text-sm font-normal">Description</Label><Textarea value={destForm.description} onChange={e => setDestForm(p => ({ ...p, description: e.target.value }))} className="px-3 resize-none" rows={3} /></div>
                    <div className="space-y-1.5"><Label className="text-sm font-normal">Image URL</Label><Input value={destForm.image_url} onChange={e => setDestForm(p => ({ ...p, image_url: e.target.value }))} className="px-3" /></div>
                    <div className="grid grid-cols-3 gap-3">
                      <div className="space-y-1.5"><Label className="text-sm font-normal">Budget Min (₹)</Label><Input type="number" value={destForm.budget_min} onChange={e => setDestForm(p => ({ ...p, budget_min: parseInt(e.target.value) || 0 }))} className="px-3" /></div>
                      <div className="space-y-1.5"><Label className="text-sm font-normal">Budget Mid (₹)</Label><Input type="number" value={destForm.budget_mid} onChange={e => setDestForm(p => ({ ...p, budget_mid: parseInt(e.target.value) || 0 }))} className="px-3" /></div>
                      <div className="space-y-1.5"><Label className="text-sm font-normal">Budget Luxury (₹)</Label><Input type="number" value={destForm.budget_luxury} onChange={e => setDestForm(p => ({ ...p, budget_luxury: parseInt(e.target.value) || 0 }))} className="px-3" /></div>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1.5"><Label className="text-sm font-normal">Rating (0–5)</Label><Input type="number" min={0} max={5} step={0.1} value={destForm.rating} onChange={e => setDestForm(p => ({ ...p, rating: parseFloat(e.target.value) || 0 }))} className="px-3" /></div>
                      <div className="flex items-center gap-3 pt-6"><input type="checkbox" id="pilgrimage" checked={destForm.is_pilgrimage} onChange={e => setDestForm(p => ({ ...p, is_pilgrimage: e.target.checked }))} /><Label htmlFor="pilgrimage" className="text-sm font-normal cursor-pointer">Is Pilgrimage Destination</Label></div>
                    </div>
                    <Button onClick={handleSaveDest} className="w-full">{editDest ? 'Update Destination' : 'Create Destination'}</Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full min-w-max text-sm">
                <thead>
                  <tr className="border-b border-border">
                    {['Destination', 'State', 'Rating', 'Budget (min)', 'Actions'].map(h => (
                      <th key={h} className="text-left text-xs text-muted-foreground font-normal py-2 px-3 whitespace-nowrap">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {destinations.map(dest => (
                    <tr key={dest.id} className="border-b border-border hover:bg-muted/30 transition-colors">
                      <td className="py-3 px-3 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <img src={dest.image_url || ''} alt={dest.name} className="h-8 w-10 object-cover rounded shrink-0" />
                          <div>
                            <p className="font-medium">{dest.name}</p>
                            {dest.is_pilgrimage && <Badge variant="secondary" className="text-xs mt-0.5">Pilgrimage</Badge>}
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-3 text-muted-foreground whitespace-nowrap">{dest.state}</td>
                      <td className="py-3 px-3 whitespace-nowrap">
                        <span className="flex items-center gap-1"><Star className="h-3.5 w-3.5 text-primary fill-primary" />{dest.rating}</span>
                      </td>
                      <td className="py-3 px-3 whitespace-nowrap">₹{dest.budget_min.toLocaleString('en-IN')}</td>
                      <td className="py-3 px-3 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <Button variant="ghost" size="sm" className="h-7 px-2" onClick={() => openEditDest(dest)}>
                            <Pencil className="h-3.5 w-3.5" />
                          </Button>
                          <Button variant="ghost" size="sm" className="h-7 px-2 text-muted-foreground hover:text-destructive" onClick={() => handleDeleteDest(dest.id)}>
                            <Trash2 className="h-3.5 w-3.5" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </TabsContent>

          {/* USERS */}
          <TabsContent value="users" className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="font-semibold">Users ({stats.users})</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full min-w-max text-sm">
                <thead>
                  <tr className="border-b border-border">
                    {['Name', 'Username', 'Role', 'Joined', 'Actions'].map(h => (
                      <th key={h} className="text-left text-xs text-muted-foreground font-normal py-2 px-3 whitespace-nowrap">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {users.map(u => (
                    <tr key={u.id} className="border-b border-border hover:bg-muted/30 transition-colors">
                      <td className="py-3 px-3 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <div className="h-7 w-7 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                            <span className="text-xs text-primary font-medium">{(u.full_name || u.username || 'U')[0].toUpperCase()}</span>
                          </div>
                          <span className="font-medium">{u.full_name || 'Unnamed'}</span>
                        </div>
                      </td>
                      <td className="py-3 px-3 text-muted-foreground whitespace-nowrap">@{u.username || '—'}</td>
                      <td className="py-3 px-3 whitespace-nowrap">
                        <Badge variant="secondary" className="capitalize">{u.role || 'user'}</Badge>
                      </td>
                      <td className="py-3 px-3 text-muted-foreground whitespace-nowrap">{new Date(u.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</td>
                      <td className="py-3 px-3 whitespace-nowrap">
                        {u.id !== user?.id && (
                          <Select value={u.role || 'user'} onValueChange={v => handleUpdateUserRole(u.id, v)}>
                            <SelectTrigger className="h-7 w-24 px-2 text-xs"><SelectValue /></SelectTrigger>
                            <SelectContent>
                              <SelectItem value="user">User</SelectItem>
                              <SelectItem value="admin">Admin</SelectItem>
                            </SelectContent>
                          </Select>
                        )}
                        {u.id === user?.id && <span className="text-xs text-muted-foreground">(you)</span>}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
