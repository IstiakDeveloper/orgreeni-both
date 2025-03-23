import React, { ReactNode } from 'react';
import { Link, usePage } from '@inertiajs/react';

interface GuestLayoutProps {
  children: ReactNode;
}

interface PageProps {
  storeSettings: {
    name: string;
    logo: string | null;
  };
}

const GuestLayout: React.FC<GuestLayoutProps> = ({ children }) => {
  const { storeSettings } = usePage<PageProps>().props;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex-shrink-0">
              <Link href="/" className="flex items-center">
                {storeSettings?.logo ? (
                  <img
                    className="h-8 w-auto"
                    src={`/storage/${storeSettings?.logo}`}
                    alt={storeSettings?.name}
                  />
                ) : (
                  <span className="text-xl font-bold text-emerald-600">
                    {storeSettings?.name || 'Grocery Shop'}
                  </span>
                )}
              </Link>
            </div>
            <div className="hidden md:flex md:items-center">
              <Link
                href={route('register')}
                className="ml-8 inline-flex items-center justify-center whitespace-nowrap rounded-md bg-white px-4 py-2 text-sm font-medium text-emerald-600 ring-1 ring-inset ring-emerald-600 hover:bg-emerald-50"
              >
                Register
              </Link>
              <Link
                href={route('login')}
                className="ml-4 inline-flex items-center justify-center whitespace-nowrap rounded-md bg-emerald-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-emerald-500"
              >
                Login
              </Link>
            </div>
          </div>
        </div>
      </div>

      <main>
        {children}
      </main>

      <footer className="bg-white mt-auto">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <div className="text-center text-sm text-gray-500">
            <p>© {new Date().getFullYear()} {storeSettings?.name || 'Grocery Shop'}. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default GuestLayout;
