import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import MainLayout from '@/components/layouts/MainLayout';
import { useAuth } from '@/contexts/AuthContext';
import { getTrips } from '@/lib/api';
import { Badge } from '@/components/ui/badge';
import { ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function MyTripsPage() {
  const { user } = useAuth();
  const [trips, setTrips] = useState<any[]>([]);

  const PHASE_COLORS: Record<string, string> = {
    planning: 'text-info',
    traveling: 'text-success',
    completed: 'text-muted-foreground',
    cancelled: 'text-destructive',
  };

  const getDaysUntil = (dateStr: string) => {
    const diff = Math.ceil(
      (new Date(dateStr).getTime() - Date.now()) /
        (1000 * 60 * 60 * 24)
    );

    if (diff < 0) return 'Past';
    if (diff === 0) return 'Today!';
    if (diff === 1) return 'Tomorrow';

    return `${diff} days away`;
  };

  useEffect(() => {
    if (!user) return;

    getTrips(user.id).then(setTrips);
  }, [user]);

  return (
    <MainLayout>
      <div className="max-w-6xl mx-auto p-6">
        <h1 className="text-3xl font-bold mb-6">
          My Trips
        </h1>

        {trips.length === 0 ? (
          <div className="border border-dashed rounded-lg p-8 text-center">
            <p className="text-muted-foreground">
              No trips found.
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            {trips.map((trip: any) => (
              <Link
                key={trip.id}
                to={`/trips/${trip.id}`}
              >
                <div className="flex items-center justify-between border border-border rounded-lg p-4 hover:border-primary/30 transition-colors cursor-pointer">

                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm truncate">
                      {trip.title}
                    </p>

                    <div className="flex items-center gap-3 mt-1">
                      <span className="text-xs text-muted-foreground">
                        {trip.destination_name}
                      </span>

                      <span className="text-xs text-muted-foreground">
                        •
                      </span>

                      <span className="text-xs text-muted-foreground">
                        {getDaysUntil(trip.start_date)}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <Badge
                      variant="secondary"
                      className={cn(
                        'text-xs capitalize',
                        PHASE_COLORS[
                          trip.phase as keyof typeof PHASE_COLORS
                        ]
                      )}
                    >
                      {trip.phase}
                    </Badge>

                    <ArrowRight className="h-4 w-4 text-muted-foreground" />
                  </div>

                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </MainLayout>
  );
}