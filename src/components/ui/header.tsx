import { cn } from '@/lib/utils';
import Link from 'next/link';

type HeaderProps = {
  title: string;
  root?: boolean;
};

const Header = ({ root, title }: HeaderProps) => {
  return (
    <>
      <div className={cn('flex items-baseline text-center', root ? 'justify-center' : 'justify-between')}>
        {!root && (
          <Link href={'/'} className='text-1xl mb-4 uppercase tracking-wide text-blue-500 underline'>
            BACK TO OVERVIEW
          </Link>
        )}
        <h1 className='mb-4 text-center text-3xl'>{title}</h1>
      </div>
      <hr className='mb-2' />
    </>
  );
};

export default Header;
