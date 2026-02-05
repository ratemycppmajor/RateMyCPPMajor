'use client';
import { FaUser } from 'react-icons/fa';
import { Settings, LogOut, Star } from 'lucide-react';

import { useCurrentUser } from '@/hooks/use-current-user';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { LogoutButton } from './logout-button';
import Link from 'next/link';

export const UserButton = () => {
  const { user } = useCurrentUser();

  const settingsTab = [
    {
      name: 'Settings',
      key: 'settings' as const,
      href: '/settings',
      icon: Settings,
    },
    {
      name: 'Ratings',
      key: 'ratings' as const,
      href: '/settings/ratings',
      icon: Star,
    },
  ];

  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger>
        <Avatar className="h-8 w-8 mx-3 cursor-pointer">
          <AvatarImage src={user?.image || undefined} />
          <AvatarFallback>
            <FaUser />
          </AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-40 text-primary " align="start">
        {settingsTab.map(({ name, key, href, icon: Icon }) => (
          <Link href={href} key={key}>
            <DropdownMenuItem className="cursor-pointer text-primary hover:text-primary focus:text-primary">
              <Icon className="h-8 w-8 mr-2 text-primary hover:text-primary" />
              {name}
            </DropdownMenuItem>
          </Link>
        ))}

        <DropdownMenuSeparator />

        <LogoutButton>
          <DropdownMenuItem className="cursor-pointer text-primary hover:text-primary focus:text-primary">
            <LogOut className="h-4 w-4 mr-2 text-primary " />
            Logout
          </DropdownMenuItem>
        </LogoutButton>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
