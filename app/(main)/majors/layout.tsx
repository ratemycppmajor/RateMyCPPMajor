import Navbar from '@/components/navbar';

interface MajorLayoutProps {
  children: React.ReactNode;
}

export default function MainLayout({ children }: MajorLayoutProps) {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <div className="grow">{children}</div>
    </div>
  );
}
