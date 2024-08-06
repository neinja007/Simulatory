'use client';

import Header from '@/components/ui/header';
import { routes } from '@/data/routes';
import { usePathname } from 'next/navigation';

type LayoutProps = { children: React.ReactNode };

const Layout = ({ children }: LayoutProps) => {
  const pathname = usePathname();
  const route = routes.find((route) => route.href === pathname);

  if (!route) {
    throw new Error(`Route not found for pathname: ${pathname}`);
  }

  return (
    <div className='mx-auto max-w-[900px]'>
      <Header title={route.name} />
      <span className='text-slate-500 dark:text-slate-400'>{route.description}</span>
      <div className='my-8'>{children}</div>
    </div>
  );
};

export default Layout;
