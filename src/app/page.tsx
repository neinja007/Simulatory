import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Header from '@/components/ui/header';
import { routes } from '@/data/routes';

export default function Overview() {
  return (
    <>
      <Header title='Overview' root />
      <div className='grid gap-5 md:grid-cols-2 xl:grid-cols-3'>
        {routes.map(({ name, description, href }) => (
          <Card key={name}>
            <CardHeader>
              <CardTitle>{name}</CardTitle>
              <CardDescription>{description}</CardDescription>
            </CardHeader>
            <CardContent className='bg-gray-200 pb-3 pt-3 text-center'>
              <Link href={href} className='text-blue-500 hover:underline'>
                Start {name}
              </Link>
            </CardContent>
          </Card>
        ))}
      </div>
    </>
  );
}
