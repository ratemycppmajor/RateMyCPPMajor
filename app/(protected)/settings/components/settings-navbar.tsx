'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function SettingsNavbar() {
  const pathname = usePathname();

  const navItems = [
    { name: 'Settings', href: '/settings' },
    { name: 'Ratings', href: '/settings/ratings' },
  ];

  return (
    <div className="px-5 border-2 rounded-md flex gap-4">
      {navItems.map((nav) => {
        const isActive = pathname === nav.href;
        return (
          <Link
            href={nav.href}
            key={nav.name}
            className={`px-3 py-2 rounded-md text-base font-medium transition hover:text-primary hover:underline-offset-13 ${isActive && 'underline underline-offset-13 text-primary'}`}
          >
            {nav.name}
          </Link>
        );
      })}
    </div>
  );
}
