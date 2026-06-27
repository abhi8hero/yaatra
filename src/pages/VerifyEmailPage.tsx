import { Link, useLocation } from "react-router-dom";
import { Compass, Mail, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function VerifyEmailPage() {
  const location = useLocation();

  const email =
    (location.state as { email?: string } | null)?.email || "";

  return (
    <div className="min-h-screen flex items-center justify-center px-6">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-primary/10 mb-4">
            <Mail className="h-8 w-8 text-primary" />
          </div>

          <div className="flex items-center justify-center gap-2 mb-6">
            <Compass className="h-5 w-5 text-primary" />
            <span className="font-semibold tracking-tight">
              yaatra
            </span>
          </div>

          <h1 className="text-3xl font-semibold mb-3">
            ✈️ Verify Your Email
          </h1>

          <p className="text-muted-foreground">
            We've sent a verification link to:
          </p>

          <p className="font-medium mt-2 break-all">
            {email}
          </p>
        </div>

        <div className="rounded-xl border p-6 space-y-3">
          <p className="text-sm text-muted-foreground">
            Please verify your email address before signing in.
          </p>

          <p className="text-sm">
            ✓ Check Inbox
          </p>

          <p className="text-sm">
            ✓✓ Check Promotions
          </p>

          <p className="text-sm">
            ✓✓✓ Check Spam Folder ⭐
          </p>
        </div>

        <div className="mt-6 space-y-3">
          <Button asChild className="w-full">
            <Link to="/login">
              Continue to Sign In
            </Link>
          </Button>

          <Button
            asChild
            variant="outline"
            className="w-full"
          >
            <Link to="/register">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Registration
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}