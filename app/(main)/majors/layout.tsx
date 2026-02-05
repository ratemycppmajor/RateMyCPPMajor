import MainNavbar from '@/components/navbar/main-navbar';
import { Toaster } from 'sonner';

interface MajorLayoutProps {
  children: React.ReactNode;
}

export default function MajorLayout({ children }: MajorLayoutProps) {
  return (
    <div className="flex flex-col min-h-screen">
      <MainNavbar />
      <Toaster richColors position="top-center" />
      <div className="grow">{children}</div>
    </div>
  );
}
