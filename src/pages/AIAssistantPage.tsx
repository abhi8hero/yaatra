import { useState, useRef, useEffect } from 'react';
import MainLayout from '@/components/layouts/MainLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/db/supabase';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { MessageSquare, Send, Bot, User, Sparkles, X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

const SUGGESTED = [
  'What are the best places to visit in Rajasthan in December?',
  'Plan a 5-day budget trip to Goa for 2 people',
  'What are the must-try foods in Varanasi?',
  'Best pilgrimage sites in South India',
  'Is Manali safe for solo travel in winter?',
  'What documents do I need for Vaishno Devi yatra?',
];

const SYSTEM_PROMPT = `You are Yaatra AI, India's intelligent travel assistant. You help users plan trips across India, suggest destinations, explain local culture, recommend food, provide safety tips, and assist with travel logistics. 
You have deep knowledge of:
- All Indian states and destinations
- Local festivals, cuisine, and customs
- Budget planning and cost estimates in Indian Rupees
- Safety tips for different types of travellers
- Best travel seasons and weather patterns
- Pilgrimage routes and religious sites
- Adventure sports and eco-tourism
Keep responses friendly, concise, and actionable. Format with bullet points where helpful.`;

export default function AIAssistantPage() {
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([{
    role: 'assistant',
    content: 'Namaste! 🙏 I\'m Yaatra AI, your intelligent travel companion for India. I can help you plan trips, discover destinations, understand local culture, estimate budgets, and much more. What would you like to explore today?',
    timestamp: new Date().toISOString(),
  }]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = async (text?: string) => {
  const msg = text || input.trim();
  if (!msg) return;

  const userMsg: Message = {
    role: 'user',
    content: msg,
    timestamp: new Date().toISOString()
  };

  setMessages(prev => [...prev, userMsg]);
  setInput('');
  setLoading(true);

  try {
    console.log("Calling ai-assistant...");

    const { data, error } = await supabase.functions.invoke(
      'ai-assistant',
      {
        body: {
          message: msg
        },
      }
    );

    console.log("DATA:", data);
    console.log("ERROR:", error);

    if (error) throw error;

    const reply =
      data?.reply ||
      'Sorry, I encountered an error. Please try again.';

    setMessages(prev => [
      ...prev,
      {
        role: 'assistant',
        content: reply,
        timestamp: new Date().toISOString()
      }
    ]);
  } catch (e: any) {
    console.error("AI FAILED:", e);

    const fallback = generateFallback(msg);

    setMessages(prev => [
      ...prev,
      {
        role: 'assistant',
        content: fallback,
        timestamp: new Date().toISOString()
      }
    ]);
  }

  setLoading(false);
};

  const generateFallback = (q: string) => {
    const lower = q.toLowerCase();
    if (lower.includes('goa')) return '🏖 **Goa** is perfect for beaches, nightlife, and Portuguese cuisine!\n\n**Best time:** October–March\n**Must-visit:** Baga Beach, Old Goa Churches, Dudhsagar Falls\n**Budget:** ₹10,000–₹30,000 per person per week\n**Pro tip:** Rent a scooter from licensed dealers only.';
    if (lower.includes('jaipur') || lower.includes('rajasthan')) return '🏰 **Jaipur** – The Pink City awaits!\n\n**Top attractions:** Amber Fort, Hawa Mahal, City Palace, Jantar Mantar\n**Best time:** October–March\n**Famous food:** Dal Baati Churma, Pyaaz Kachori, Ghewar\n**Budget:** ₹8,000–₹18,000/person/week';
    if (lower.includes('kerala') || lower.includes('backwater')) return '🌿 **Kerala Backwaters** – God\'s Own Country!\n\n**Must-do:** Alleppey houseboat cruise, Munnar tea plantations, Kathakali dance\n**Best time:** September–March\n**Signature food:** Karimeen Pollichathu, Kerala Sadya\n**Travel tip:** Book houseboats in advance during peak season.';
    if (lower.includes('manali') || lower.includes('himachal')) return '⛰ **Manali** – Himalayan paradise!\n\n**Top spots:** Rohtang Pass, Solang Valley, Hadimba Temple, Old Manali\n**Best time:** March–June (summer), December–February (snow)\n**Activities:** Skiing, paragliding, trekking, river rafting\n**Altitude note:** Acclimatize for 1 day before major activities.';
    if (lower.includes('budget') || lower.includes('cheap')) return '💰 **Budget Travel Tips for India:**\n\n• Use sleeper class trains for long journeys (₹500–₹1,500)\n• Stay in hostels or OYO rooms (₹600–₹1,500/night)\n• Eat at local dhabas (₹80–₹200/meal)\n• Use local buses instead of taxis\n• Visit state-managed museums (low entry fees)\n• Travel during shoulder season for 30–40% discounts';
    if (lower.includes('document') || lower.includes('id')) return '📋 **Essential Documents for India Travel:**\n\n• **Aadhaar Card** – Most widely accepted ID\n• **PAN Card** – Useful for financial transactions\n• **Passport** – Required for international borders\n• **Driving Licence** – For self-drive vehicles\n\n**For Pilgrimages:** Some sites (Vaishno Devi, Char Dham) require registration. Carry Aadhaar.';
    return `🗺 Great question! Yaatra knows India inside out.\n\nFor **"${q}"**, here are some quick tips:\n\n• **Plan early** – book hotels and trains 2–4 weeks in advance\n• **Check weather** – India has very diverse climates; plan seasonally\n• **Budget:** Budget travellers: ₹800–₹1,500/day | Mid-range: ₹2,500–₹5,000/day\n• **Safety:** Download offline maps, share itineraries with family\n\nTry asking me something specific like a destination name, activity, or budget for more detailed advice!`;
  };

  return (
    <MainLayout>
      <div className="max-w-3xl mx-auto px-4 md:px-6 py-8 md:py-10 space-y-6 h-[calc(100vh-3.5rem)] flex flex-col">
        {/* Header */}
        <div className="space-y-1 shrink-0">
          <h1 className="text-2xl md:text-3xl font-semibold flex items-center gap-2">
            <Sparkles className="h-6 w-6 text-primary" strokeWidth={1.5} />
            AI Travel Assistant
          </h1>
          <p className="text-sm text-muted-foreground">Your intelligent guide to exploring India.</p>
        </div>

        {/* Chat area */}
        <div className="flex-1 min-h-0 overflow-y-auto border border-border rounded-lg p-4 space-y-4">
          {messages.map((msg, i) => (
            <div key={i} className={cn('flex gap-3', msg.role === 'user' ? 'flex-row-reverse' : 'flex-row')}>
              <div className={cn('h-8 w-8 rounded-full flex items-center justify-center shrink-0', msg.role === 'user' ? 'bg-primary text-primary-foreground' : 'bg-secondary')}>
                {msg.role === 'user' ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4 text-primary" />}
              </div>
              <div className={cn('max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-relaxed', msg.role === 'user' ? 'bg-primary text-primary-foreground rounded-br-sm' : 'bg-muted rounded-bl-sm')}>
                <div className="whitespace-pre-line">{msg.content}</div>
                <div className={cn('text-xs mt-1 opacity-60', msg.role === 'user' ? 'text-right' : '')}>
                  {new Date(msg.timestamp).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
                </div>
              </div>
            </div>
          ))}
          {loading && (
            <div className="flex gap-3">
              <div className="h-8 w-8 rounded-full bg-secondary flex items-center justify-center shrink-0">
                <Bot className="h-4 w-4 text-primary" />
              </div>
              <div className="bg-muted rounded-2xl rounded-bl-sm px-4 py-3">
                <div className="flex gap-1">
                  <div className="h-2 w-2 rounded-full bg-muted-foreground animate-bounce" style={{ animationDelay: '0ms' }} />
                  <div className="h-2 w-2 rounded-full bg-muted-foreground animate-bounce" style={{ animationDelay: '150ms' }} />
                  <div className="h-2 w-2 rounded-full bg-muted-foreground animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            </div>
          )}
          <div ref={bottomRef} />
        </div>

        {/* Suggestions */}
        {messages.length === 1 && (
          <div className="shrink-0 space-y-2">
            <p className="text-xs text-muted-foreground">Suggested questions</p>
            <div className="flex flex-wrap gap-2">
              {SUGGESTED.slice(0, 4).map(s => (
                <button key={s} onClick={() => sendMessage(s)}
                  className="text-xs px-3 py-1.5 border border-border rounded-full hover:border-primary hover:text-primary transition-colors text-muted-foreground text-left">
                  {s}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Input */}
        <div className="shrink-0 flex gap-2">
          <Input
            ref={inputRef}
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && !e.shiftKey && sendMessage()}
            placeholder="Ask about any destination, activity, or travel tips…"
            className="px-4 h-11"
            disabled={loading}
          />
          <Button onClick={() => sendMessage()} disabled={loading || !input.trim()} className="h-11 px-4 shrink-0">
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </MainLayout>
  );
}
