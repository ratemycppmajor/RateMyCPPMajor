import { Suspense } from 'react';
import NewPasswordForm from './new-password-form';

export default function NewPasswordPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-[280px] items-center justify-center text-muted-foreground text-sm">
          Loading…
        </div>
      }
    >
      <NewPasswordForm />
    </Suspense>
  );
}
