import { Suspense } from 'react';
import NewVerificationForm from './new-verification-form';

export default function NewVerificationPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-[280px] items-center justify-center text-muted-foreground text-sm">
          Loading…
        </div>
      }
    >
      <NewVerificationForm />
    </Suspense>
  );
}
