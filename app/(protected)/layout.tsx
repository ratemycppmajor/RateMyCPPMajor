import Navbar from '@/components/navbar/main-navbar';
import Footer from '@/components/footer';
import SettingsNavbar from './settings/components/settings-navbar';

interface ProtectedLayoutProps {
  children: React.ReactNode;
}

const ProtectedLayout = ({ children }: ProtectedLayoutProps) => {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <div className="h-full w-full flex grow flex-col gap-y-10 items-center mt-16">
        <SettingsNavbar />
        {children}
      </div>
      <Footer />
    </div>
  );
};

export default ProtectedLayout;
