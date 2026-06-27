import { useState, useEffect } from 'react';
import MainLayout from '@/components/layouts/MainLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { getTravelDocuments, createTravelDocument, deleteTravelDocument, getTrips } from '@/lib/api';
import type { TravelDocument, Trip, DocumentType } from '@/types/types';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { FileText, Plus, Trash2, Calendar, ExternalLink, AlertTriangle } from 'lucide-react';
import { cn } from '@/lib/utils';

const DOC_TYPES: { value: DocumentType; label: string }[] = [
  { value: 'aadhaar', label: 'Aadhaar Card' },
  { value: 'pan', label: 'PAN Card' },
  { value: 'passport', label: 'Passport' },
  { value: 'visa', label: 'Visa' },
  { value: 'hotel_voucher', label: 'Hotel Voucher' },
  { value: 'flight_ticket', label: 'Flight Ticket' },
  { value: 'train_ticket', label: 'Train Ticket' },
  { value: 'travel_insurance', label: 'Travel Insurance' },
  { value: 'other', label: 'Other' },
];

export default function MyDocumentsPage() {
  const { user } = useAuth();
  const [docs, setDocs] = useState<TravelDocument[]>([]);
  const [trips, setTrips] = useState<Trip[]>([]);
  const [addOpen, setAddOpen] = useState(false);
  const [newDoc, setNewDoc] = useState({ name: '', document_type: 'passport' as DocumentType, expiry_date: '', notes: '', trip_id: 'none' });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    Promise.all([getTravelDocuments(user.id), getTrips(user.id)]).then(([d, t]) => {
      setDocs(d); setTrips(t); setLoading(false);
    });
  }, [user]);

  const handleAdd = async () => {
    if (!user || !newDoc.name) { toast.error('Please enter a document name.'); return; }
    const result = await createTravelDocument({
      user_id: user.id,
      document_type: newDoc.document_type,
      name: newDoc.name,
      trip_id: (newDoc.trip_id && newDoc.trip_id !== 'none') ? newDoc.trip_id : null,
      file_url: null,
      file_size: null,
      expiry_date: newDoc.expiry_date || null,
      notes: newDoc.notes || null,
    });
    if (result) {
      setDocs(prev => [result, ...prev]);
      setAddOpen(false);
      setNewDoc({ name: '', document_type: 'passport', expiry_date: '', notes: '', trip_id: '' });
      toast.success('Document added!');
    }
  };

  const handleDelete = async (docId: string) => {
    await deleteTravelDocument(docId);
    setDocs(prev => prev.filter(d => d.id !== docId));
    toast.success('Document removed.');
  };

  const isExpiringSoon = (dateStr: string | null) => {
    if (!dateStr) return false;
    const diff = (new Date(dateStr).getTime() - Date.now()) / (1000 * 60 * 60 * 24);
    return diff > 0 && diff <= 90;
  };

  const isExpired = (dateStr: string | null) => {
    if (!dateStr) return false;
    return new Date(dateStr) < new Date();
  };

  return (
    <MainLayout>
      <div className="max-w-4xl mx-auto px-4 md:px-6 py-8 md:py-10 space-y-8">
        <div className="flex items-end justify-between">
          <div className="space-y-1">
            <h1 className="text-2xl md:text-3xl font-semibold flex items-center gap-2">
              <FileText className="h-6 w-6 text-primary" strokeWidth={1.5} />
              My Documents
            </h1>
            <p className="text-sm text-muted-foreground">Store and access all your travel documents digitally.</p>
          </div>
          <Dialog open={addOpen} onOpenChange={setAddOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2"><Plus className="h-4 w-4" />Add Document</Button>
            </DialogTrigger>
            <DialogContent className="max-w-[calc(100%-2rem)] md:max-w-lg">
              <DialogHeader><DialogTitle>Add Document</DialogTitle></DialogHeader>
              <div className="space-y-4 pt-2">
                <div className="space-y-1.5"><Label className="text-sm font-normal">Document Name</Label><Input value={newDoc.name} onChange={e => setNewDoc(p => ({ ...p, name: e.target.value }))} placeholder="e.g. My Passport, Air India Ticket" className="px-3" /></div>
                <div className="space-y-1.5"><Label className="text-sm font-normal">Document Type</Label>
                  <Select value={newDoc.document_type} onValueChange={v => setNewDoc(p => ({ ...p, document_type: v as DocumentType }))}>
                    <SelectTrigger className="px-3"><SelectValue /></SelectTrigger>
                    <SelectContent>{DOC_TYPES.map(t => <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>)}</SelectContent>
                  </Select>
                </div>
                <div className="space-y-1.5"><Label className="text-sm font-normal">Expiry Date (optional)</Label><Input type="date" value={newDoc.expiry_date} onChange={e => setNewDoc(p => ({ ...p, expiry_date: e.target.value }))} className="px-3" /></div>
                <div className="space-y-1.5"><Label className="text-sm font-normal">Link to Trip (optional)</Label>
                  <Select value={newDoc.trip_id} onValueChange={v => setNewDoc(p => ({ ...p, trip_id: v }))}>
                    <SelectTrigger className="px-3"><SelectValue placeholder="No trip" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">No specific trip</SelectItem>
                      {trips.map(t => <SelectItem key={t.id} value={t.id}>{t.title}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1.5"><Label className="text-sm font-normal">Notes (optional)</Label><Input value={newDoc.notes} onChange={e => setNewDoc(p => ({ ...p, notes: e.target.value }))} placeholder="Document number, notes…" className="px-3" /></div>
                <Button onClick={handleAdd} className="w-full">Add Document</Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[...Array(4)].map((_, i) => <div key={i} className="h-32 bg-muted rounded-lg animate-pulse" />)}
          </div>
        ) : docs.length === 0 ? (
          <div className="text-center py-20 space-y-3">
            <FileText className="h-10 w-10 text-muted-foreground mx-auto" strokeWidth={1.5} />
            <p className="text-muted-foreground">No documents yet. Add your Aadhaar, passport, tickets and more.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {docs.map(doc => (
              <div key={doc.id} className={cn('border rounded-lg p-4 space-y-3 h-full flex flex-col', isExpired(doc.expiry_date) ? 'border-destructive/50 bg-destructive/5' : isExpiringSoon(doc.expiry_date) ? 'border-warning/50 bg-warning/5' : 'border-border')}>
                <div className="flex items-start justify-between gap-3 flex-1">
                  <div className="min-w-0 space-y-1 flex-1">
                    <div className="flex items-start gap-2">
                      <div className="min-w-0">
                        <h3 className="font-medium text-sm truncate">{doc.name}</h3>
                        <p className="text-xs text-muted-foreground">{DOC_TYPES.find(t => t.value === doc.document_type)?.label || doc.document_type}</p>
                      </div>
                    </div>
                    {doc.expiry_date && (
                      <div className={cn('flex items-center gap-1 text-xs', isExpired(doc.expiry_date) ? 'text-destructive' : isExpiringSoon(doc.expiry_date) ? 'text-warning' : 'text-muted-foreground')}>
                        {(isExpired(doc.expiry_date) || isExpiringSoon(doc.expiry_date)) && <AlertTriangle className="h-3 w-3 shrink-0" />}
                        <Calendar className="h-3 w-3 shrink-0" />
                        Expires: {new Date(doc.expiry_date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                        {isExpired(doc.expiry_date) && ' (Expired)'}
                        {isExpiringSoon(doc.expiry_date) && !isExpired(doc.expiry_date) && ' (Expiring soon)'}
                      </div>
                    )}
                    {doc.notes && <p className="text-xs text-muted-foreground">{doc.notes}</p>}
                  </div>
                </div>
                <div className="flex items-center justify-between pt-2 border-t border-border mt-auto">
                  {doc.file_url ? (
                    <a href={doc.file_url} target="_blank" rel="noopener noreferrer">
                      <Button variant="outline" size="sm" className="h-7 text-xs gap-1"><ExternalLink className="h-3 w-3" />View</Button>
                    </a>
                  ) : (
                    <span className="text-xs text-muted-foreground">No file attached</span>
                  )}
                  <button onClick={() => handleDelete(doc.id)} className="text-muted-foreground hover:text-destructive transition-colors">
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </MainLayout>
  );
}
