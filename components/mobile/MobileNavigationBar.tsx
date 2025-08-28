'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  Home, 
  Search, 
  Building2,
  Phone,
  Wrench
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface MobileNavigationBarProps {
  activeTab?: 'home' | 'search' | 'services' | 'work' | 'contact';
  onTabChange?: (tab: string) => void;
  notifications?: {
    messages?: number;
    updates?: number;
  };
  className?: string;
  onContactUs?: () => void;
}

const MobileNavigationBar: React.FC<MobileNavigationBarProps> = ({
  activeTab,
  onTabChange,
  notifications,
  className,
  onContactUs
}) => {
  const pathname = usePathname();

  // Navigation items configuration
  const navItems = [
    {
      id: 'home',
      label: 'Home',
      icon: Home,
      href: '/',
      active: pathname === '/'
    },
    {
      id: 'search',
      label: 'Properties',
      icon: Search,
      href: '/projects',
      active: pathname.startsWith('/projects')
    },
    {
      id: 'services',
      label: 'Services',
      icon: Wrench,
      href: '/services',
      active: pathname.startsWith('/services')
    },
    {
      id: 'work',
      label: 'Our Work',
      icon: Building2,
      href: '/work',
      active: pathname === '/work'
    },
    {
      id: 'contact',
      label: 'Contact',
      icon: Phone,
      isAction: true,
      action: onContactUs
    }
  ];

  const handleItemClick = (item: any) => {
    if (item.isAction && item.action) {
      item.action();
    } else if (item.href) {
      // Navigation will be handled by Link component
      if (onTabChange) {
        onTabChange(item.id);
      }
    }
  };

  return (
    <>
      {/* Bottom Navigation Bar - Only visible on mobile */}
      <div 
        className={cn(
          "fixed bottom-0 left-0 right-0 z-50 md:hidden",
          "bg-white/95 backdrop-blur-lg border-t border-gray-200",
          "safe-area-pb", // Handle safe area on modern mobile devices
          className
        )}
      >
        <div className="flex items-center justify-around px-2 py-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab ? activeTab === item.id : item.active;

            if (item.isAction && !item.href) {
              return (
                <Button
                  key={item.id}
                  variant="ghost"
                  size="sm"
                  onClick={() => handleItemClick(item)}
                  className={cn(
                    "flex-1 mx-1 flex flex-col items-center gap-1 h-auto py-2 px-2",
                    "text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg min-h-12",
                    "relative after:block after:h-0.5 after:w-4 after:bg-blue-600 after:rounded-full after:transition-all after:duration-200 after:mt-1 after:opacity-0 after:scale-75",
                    isActive && "text-blue-600 bg-blue-50 after:opacity-100 after:scale-100"
                  )}
                >
                  <div className="relative">
                    <Icon className="h-5 w-5" />
                    {notifications?.messages && item.id === 'contact' && (
                      <Badge 
                        variant="destructive" 
                        className="absolute -top-2 -right-2 h-4 w-4 p-0 text-xs flex items-center justify-center"
                      >
                        {notifications.messages > 9 ? '9+' : notifications.messages}
                      </Badge>
                    )}
                  </div>
                  <span className="text-xs font-medium">
                    {item.label}
                  </span>
                </Button>
              );
            }

            return (
              <Link
                key={item.id}
                href={item.href!}
                className={cn(
                  "flex-1 mx-1 flex flex-col items-center gap-1 py-2 px-2 rounded-lg min-h-12",
                  "text-gray-600 hover:text-blue-600 hover:bg-blue-50 transition-colors duration-200",
                  "relative after:block after:h-0.5 after:w-4 after:bg-blue-600 after:rounded-full after:transition-all after:duration-200 after:mt-1 after:opacity-0 after:scale-75",
                  isActive && "text-blue-600 bg-blue-50 after:opacity-100 after:scale-100"
                )}
                onClick={() => handleItemClick(item)}
              >
                <div className="relative">
                  <Icon className="h-5 w-5" />
                  {notifications?.updates && item.id === 'search' && (
                    <Badge 
                      variant="destructive" 
                      className="absolute -top-2 -right-2 h-4 w-4 p-0 text-xs flex items-center justify-center"
                    >
                      {notifications.updates > 9 ? '9+' : notifications.updates}
                    </Badge>
                  )}
                </div>
                <span className="text-xs font-medium">
                  {item.label}
                </span>
              </Link>
            );
          })}
        </div>

        {/* Safe area padding for devices with home indicator */}
        <div className="h-safe-area-inset-bottom" />
      </div>

      {/* Spacer to prevent content from being hidden behind navigation bar */}
      <div className="h-20 md:hidden" />
    </>
  );
};

export default MobileNavigationBar;
