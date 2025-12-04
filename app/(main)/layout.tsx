import Navbar from '@/components/navbar';
import Footer from '@/components/footer';

interface MainLayoutProps {
  children: React.ReactNode;
}

export default function MainLayout({ children }: MainLayoutProps) {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <div className="grow">{children}</div>
      <Footer />
    </div>
  );
}
