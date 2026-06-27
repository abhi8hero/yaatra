import { Link } from 'react-router-dom';
import { Compass, ArrowLeft, Wrench } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function ResetPasswordPage() {
  return (
    <div className="min-h-screen flex items-center justify-center p-8">
      <div className="w-full max-w-md text-center space-y-8">
        <Link to="/" className="inline-flex items-center gap-2">
          <Compass className="h-5 w-5 text-primary" strokeWidth={1.5} />
          <span className="font-semibold tracking-tight">yaatra</span>
        </Link>

        <div className="space-y-4">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-muted">
            <Wrench className="h-8 w-8 text-primary" strokeWidth={1.5} />
          </div>

          <h1 className="text-2xl font-semibold">
            Password Reset Coming Soon
          </h1>

          <p className="text-sm text-muted-foreground leading-6">
            Password reset is not available at the moment.
            <br />
            We're working on this feature and it will be available in a future update. Sorry for the inconvenience.
          </p>
        </div>

        <div className="space-y-3">
          <Link to="/login">
            <Button className="w-full">
              Back to Sign In
            </Button>
          </Link>

          <Link
            to="/"
            className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Return to Home
          </Link>
        </div>
      </div>
    </div>
  );
}