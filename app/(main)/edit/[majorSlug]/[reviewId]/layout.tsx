import MainNavbar from '@/components/navbar/main-navbar';

interface AddMajorLayoutProps {
  children: React.ReactNode;
}

export default function AddMajorLayout({ children }: AddMajorLayoutProps) {
  return (
    <div className="flex flex-col min-h-screen">
      <MainNavbar />
      <div className="grow">{children}</div>
    </div>
  );
}
