import Footer from '@/components/footer';

interface MainLayoutProps {
  children: React.ReactNode;
}

export default function MainLayout({ children }: MainLayoutProps) {
  return (
    <div className="flex flex-col min-h-screen">
      <div className="grow">{children}</div>
      <Footer />
    </div>
  );
}
