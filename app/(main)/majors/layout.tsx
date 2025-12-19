import MainNavbar from '@/components/navbar/main-navbar';

interface MajorLayoutProps {
  children: React.ReactNode;
}

export default function MajorLayout({ children }: MajorLayoutProps) {
  return (
    <div className="flex flex-col min-h-screen">
    <MainNavbar />
    <div className="grow">{children}</div>
    </div>
  );
}
