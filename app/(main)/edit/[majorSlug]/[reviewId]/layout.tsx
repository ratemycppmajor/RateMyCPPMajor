import Navbar from '@/components/navbar';

interface AddMajorLayoutProps {
  children: React.ReactNode;
}

export default function AddMajorLayout({ children }: AddMajorLayoutProps) {
  return (
    <div className="flex flex-col min-h-screen">
    <Navbar />
    <div className="grow">{children}</div>
    </div>
  );
}
