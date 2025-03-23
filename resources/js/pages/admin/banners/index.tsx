import React, { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import {
  ChevronLeft,
  ChevronRight,
  Edit,
  Trash2,
  PlusCircle,
  AlertTriangle,
  ExternalLink,
  Image as ImageIcon,
  Link as LinkIcon,
  ArrowUp,
  ArrowDown
} from 'lucide-react';
import AdminLayout from '@/layouts/AdminLayout';

interface Banner {
  id: number;
  title: string;
  image: string;
  link: string | null;
  is_active: boolean;
  order: number;
  created_at: string;
  updated_at: string;
}

interface BannerIndexProps {
  banners: {
    data: Banner[];
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

const Index: React.FC<BannerIndexProps> = ({ banners }) => {
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [bannerToDelete, setBannerToDelete] = useState<Banner | null>(null);

  const confirmDelete = (banner: Banner) => {
    setBannerToDelete(banner);
    setShowDeleteModal(true);
  };

  const handleDelete = () => {
    if (bannerToDelete) {
      router.delete(route('admin.banners.destroy', bannerToDelete.id));
      setShowDeleteModal(false);
    }
  };

  const cancelDelete = () => {
    setBannerToDelete(null);
    setShowDeleteModal(false);
  };

  return (
    <AdminLayout title="Banners">
      <Head title="Banners" />

      <div className="px-4 sm:px-6 lg:px-8">
        <div className="sm:flex sm:items-center">
          <div className="sm:flex-auto">
            <h1 className="text-xl font-semibold text-gray-900">Banners</h1>
            <p className="mt-2 text-sm text-gray-700">
              A list of all the banners displayed on your store's homepage and promotional areas.
            </p>
          </div>
          <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
            <Link
              href={route('admin.banners.create')}
              className="inline-flex items-center rounded-md bg-emerald-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-emerald-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-600"
            >
              <PlusCircle className="h-4 w-4 mr-2" />
              Add Banner
            </Link>
          </div>
        </div>

        <div className="mt-8">
          <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
            <table className="min-w-full divide-y divide-gray-300">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">Banner</th>
                  <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Link</th>
                  <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Order</th>
                  <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Status</th>
                  <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6">
                    <span className="sr-only">Actions</span>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
                {banners.data.length > 0 ? (
                  banners.data.map((banner) => (
                    <tr key={banner.id}>
                      <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
                        <div className="flex items-center">
                          <div className="h-16 w-28 flex-shrink-0 overflow-hidden rounded-md border border-gray-200 mr-4">
                            <img
                              src={`/storage/${banner.image}`}
                              alt={banner.title}
                              className="h-full w-full object-cover object-center"
                            />
                          </div>
                          <div>
                            <div className="font-medium">{banner.title}</div>
                          </div>
                        </div>
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                        {banner.link ? (
                          <a
                            href={banner.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-emerald-600 hover:text-emerald-900 flex items-center"
                          >
                            <LinkIcon className="h-4 w-4 mr-1" />
                            <span className="truncate max-w-xs">{banner.link}</span>
                            <ExternalLink className="h-3 w-3 ml-1" />
                          </a>
                        ) : (
                          <span className="text-gray-400 italic">No link</span>
                        )}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                        <span className="inline-flex items-center">
                          <span className="font-medium mr-2">{banner.order}</span>
                        </span>
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm">
                        <span className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${
                          banner.is_active
                            ? 'bg-green-100 text-green-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}>
                          {banner.is_active ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                        <div className="flex justify-end space-x-2">
                          <Link
                            href={route('admin.banners.edit', banner.id)}
                            className="text-indigo-600 hover:text-indigo-900"
                            title="Edit"
                          >
                            <Edit className="h-5 w-5" />
                          </Link>
                          <button
                            onClick={() => confirmDelete(banner)}
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
                      No banners found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {banners.last_page > 1 && (
            <div className="flex items-center justify-between border-t border-gray-200 bg-white px-4 py-3 sm:px-6 mt-4">
              <div className="flex flex-1 justify-between sm:hidden">
                <Link
                  href={banners.links[0].url || '#'}
                  className={`relative inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 ${
                    !banners.links[0].url ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-50'
                  }`}
                  preserveScroll
                >
                  Previous
                </Link>
                <Link
                  href={banners.links[banners.links.length - 1].url || '#'}
                  className={`relative ml-3 inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 ${
                    !banners.links[banners.links.length - 1].url ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-50'
                  }`}
                  preserveScroll
                >
                  Next
                </Link>
              </div>
              <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm text-gray-700">
                    Showing <span className="font-medium">{(banners.current_page - 1) * banners.per_page + 1}</span> to{' '}
                    <span className="font-medium">
                      {Math.min(banners.current_page * banners.per_page, banners.total)}
                    </span>{' '}
                    of <span className="font-medium">{banners.total}</span> results
                  </p>
                </div>
                <div>
                  <nav className="isolate inline-flex -space-x-px rounded-md shadow-sm" aria-label="Pagination">
                    {banners.links.map((link, index) => {
                      // Skip prev/next links as we'll handle them separately
                      if (index === 0 || index === banners.links.length - 1) {
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
                <h3 className="text-lg font-medium leading-6 text-gray-900">Delete Banner</h3>
                <div className="mt-2">
                  <p className="text-sm text-gray-500">
                    Are you sure you want to delete the banner "{bannerToDelete?.title}"? This action cannot be undone.
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
