import React, { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import {
  ChevronLeft,
  ChevronRight,
  Edit,
  Trash2,
  PlusCircle,
  Search,
  AlertTriangle,
  MapPin,
  DollarSign,
  Building,
  CheckCircle,
  XCircle
} from 'lucide-react';
import AdminLayout from '@/layouts/AdminLayout';

interface Area {
  id: number;
  name: string;
  city: string;
  is_serviceable: boolean;
  delivery_charge: number;
  created_at: string;
  updated_at: string;
}

interface AreaIndexProps {
  areas: {
    data: Area[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    links: {
      url: string | null;
      label: string;
      active: boolean;
    }[];
  };
}

const Index: React.FC<AreaIndexProps> = ({ areas }) => {
  const [search, setSearch] = useState('');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [areaToDelete, setAreaToDelete] = useState<Area | null>(null);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    router.get(route('admin.areas.index'), { search }, { preserveState: true });
  };

  const confirmDelete = (area: Area) => {
    setAreaToDelete(area);
    setShowDeleteModal(true);
  };

  const handleDelete = () => {
    if (areaToDelete) {
      router.delete(route('admin.areas.destroy', areaToDelete.id));
      setShowDeleteModal(false);
    }
  };

  const cancelDelete = () => {
    setAreaToDelete(null);
    setShowDeleteModal(false);
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(price);
  };

  return (
    <AdminLayout title="Delivery Areas">
      <Head title="Delivery Areas" />

      <div className="px-4 sm:px-6 lg:px-8">
        <div className="sm:flex sm:items-center">
          <div className="sm:flex-auto">
            <h1 className="text-xl font-semibold text-gray-900">Delivery Areas</h1>
            <p className="mt-2 text-sm text-gray-700">
              A list of all the delivery areas and their associated delivery charges.
            </p>
          </div>
          <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
            <Link
              href={route('admin.areas.create')}
              className="inline-flex items-center rounded-md bg-emerald-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-emerald-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-600"
            >
              <PlusCircle className="h-4 w-4 mr-2" />
              Add Area
            </Link>
          </div>
        </div>

        <div className="mt-8">
          <form onSubmit={handleSearch} className="max-w-lg mb-4">
            <div className="relative rounded-md shadow-sm">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" aria-hidden="true" />
              </div>
              <input
                type="text"
                name="search"
                className="block w-full rounded-md border-0 py-2 pl-10 pr-16 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-emerald-600 sm:text-sm sm:leading-6"
                placeholder="Search by area or city..."
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
              <button
                type="submit"
                className="absolute inset-y-0 right-0 px-3 flex items-center bg-emerald-600 text-white rounded-r-md hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-emerald-700"
              >
                Search
              </button>
            </div>
          </form>

          <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
            <table className="min-w-full divide-y divide-gray-300">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">Area</th>
                  <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">City</th>
                  <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Delivery Charge</th>
                  <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Status</th>
                  <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6">
                    <span className="sr-only">Actions</span>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
                {areas.data.length > 0 ? (
                  areas.data.map((area) => (
                    <tr key={area.id}>
                      <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
                        <div className="flex items-center">
                          <MapPin className="h-5 w-5 mr-2 text-emerald-500" />
                          {area.name}
                        </div>
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                        <div className="flex items-center">
                          <Building className="h-5 w-5 mr-2 text-gray-400" />
                          {area.city}
                        </div>
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-900">
                        <div className="flex items-center font-medium">
                          <DollarSign className="h-5 w-5 mr-1 text-gray-500" />
                          {formatPrice(area.delivery_charge)}
                        </div>
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm">
                        {area.is_serviceable ? (
                          <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800">
                            <CheckCircle className="h-3.5 w-3.5 mr-1" />
                            Serviceable
                          </span>
                        ) : (
                          <span className="inline-flex items-center rounded-full bg-red-100 px-2.5 py-0.5 text-xs font-medium text-red-800">
                            <XCircle className="h-3.5 w-3.5 mr-1" />
                            Not Serviceable
                          </span>
                        )}
                      </td>
                      <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                        <div className="flex justify-end space-x-2">
                          <Link
                            href={route('admin.areas.edit', area.id)}
                            className="text-indigo-600 hover:text-indigo-900"
                            title="Edit"
                          >
                            <Edit className="h-5 w-5" />
                          </Link>
                          <button
                            onClick={() => confirmDelete(area)}
                            className="text-red-600 hover:text-red-900"
                            title="Delete"
                          >
                            <Trash2 className="h-5 w-5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="px-3 py-4 text-sm text-gray-500 text-center">
                      No areas found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {areas.last_page > 1 && (
            <div className="flex items-center justify-between border-t border-gray-200 bg-white px-4 py-3 sm:px-6 mt-4">
              <div className="flex flex-1 justify-between sm:hidden">
                <Link
                  href={areas.links[0].url || '#'}
                  className={`relative inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 ${
                    !areas.links[0].url ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-50'
                  }`}
                  preserveScroll
                >
                  Previous
                </Link>
                <Link
                  href={areas.links[areas.links.length - 1].url || '#'}
                  className={`relative ml-3 inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 ${
                    !areas.links[areas.links.length - 1].url ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-50'
                  }`}
                  preserveScroll
                >
                  Next
                </Link>
              </div>
              <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm text-gray-700">
                    Showing <span className="font-medium">{(areas.current_page - 1) * areas.per_page + 1}</span> to{' '}
                    <span className="font-medium">
                      {Math.min(areas.current_page * areas.per_page, areas.total)}
                    </span>{' '}
                    of <span className="font-medium">{areas.total}</span> results
                  </p>
                </div>
                <div>
                  <nav className="isolate inline-flex -space-x-px rounded-md shadow-sm" aria-label="Pagination">
                    {areas.links.map((link, index) => {
                      // Skip prev/next links as we'll handle them separately
                      if (index === 0 || index === areas.links.length - 1) {
                        return null;
                      }

                      return (
                        <Link
                          key={index}
                          href={link.url || '#'}
                          className={`relative inline-flex items-center px-4 py-2 text-sm font-semibold ${
                            link.active
                              ? 'z-10 bg-emerald-600 text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-600'
                              : 'text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:outline-offset-0'
                          } ${!link.url ? 'opacity-50 cursor-not-allowed' : ''}`}
                          preserveScroll
                          dangerouslySetInnerHTML={{ __html: link.label }}
                        />
                      );
                    })}
                  </nav>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity z-50 flex items-center justify-center">
          <div className="relative bg-white rounded-lg shadow-xl sm:max-w-md sm:w-full p-4">
            <div className="sm:flex sm:items-start">
              <div className="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                <AlertTriangle className="h-6 w-6 text-red-600" aria-hidden="true" />
              </div>
              <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                <h3 className="text-lg font-medium leading-6 text-gray-900">Delete Area</h3>
                <div className="mt-2">
                  <p className="text-sm text-gray-500">
                    Are you sure you want to delete the area "{areaToDelete?.name}, {areaToDelete?.city}"? This action cannot be undone.
                  </p>
                </div>
              </div>
            </div>
            <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
              <button
                type="button"
                className="inline-flex w-full justify-center rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500 sm:ml-3 sm:w-auto"
                onClick={handleDelete}
              >
                Delete
              </button>
              <button
                type="button"
                className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
                onClick={cancelDelete}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
};

export default Index;
