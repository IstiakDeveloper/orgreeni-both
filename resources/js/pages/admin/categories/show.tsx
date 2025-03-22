import React, { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import {
    ArrowLeft,
    Edit,
    Trash2,
    Tag,
    AlertTriangle,
    Calendar,
    Eye,
    Clock,
    CheckCircle,
    XCircle,
    Hash,
    FolderTree,
    AlignLeft,
    Package,
    ExternalLink,
    FileImage
} from 'lucide-react';
import AdminLayout from '@/layouts/AdminLayout';

interface Product {
    id: number;
    name: string;
    slug: string;
    thumbnail?: string | null;
    price: number;
    sale_price?: number | null;
}

interface Category {
    id: number;
    name: string;
    slug: string;
    description: string | null;
    image: string | null;
    parent_id: number | null;
    order: number;
    is_active: boolean;
    created_at: string;
    updated_at: string;
    parent?: {
        id: number;
        name: string;
    } | null;
    children?: Category[];
    products?: Product[];
}

interface CategoryShowProps {
    category: Category;
}

const Show: React.FC<CategoryShowProps> = ({ category }) => {
    const [showDeleteModal, setShowDeleteModal] = useState(false);

    const confirmDelete = () => {
        setShowDeleteModal(true);
    };

    const handleDelete = () => {
        router.delete(route('admin.categories.destroy', category.id));
        setShowDeleteModal(false);
    };

    const cancelDelete = () => {
        setShowDeleteModal(false);
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });
    };

    const canDelete =
        (!category.children || category.children.length === 0) &&
        (!category.products || category.products.length === 0);

    return (
        <AdminLayout title={`Category: ${category.name}`}>
            <Head title={`Category: ${category.name}`} />

            <div className="px-4 sm:px-6 lg:px-8">
                <div className="mb-6 flex justify-between items-center">
                    <Link
                        href={route('admin.categories.index')}
                        className="inline-flex items-center text-sm font-medium text-emerald-600 hover:text-emerald-500"
                    >
                        <ArrowLeft className="h-4 w-4 mr-1" />
                        Back to Categories
                    </Link>

                    <div className="flex space-x-2">
                        <Link
                            href={route('admin.categories.edit', category.id)}
                            className="inline-flex items-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-600"
                        >
                            <Edit className="h-4 w-4 mr-1" />
                            Edit
                        </Link>
                        <button
                            onClick={confirmDelete}
                            disabled={!canDelete}
                            className={`inline-flex items-center rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-600 ${!canDelete ? 'opacity-50 cursor-not-allowed' : ''
                                }`}
                            title={!canDelete ? "Cannot delete categories with subcategories or products" : "Delete category"}
                        >
                            <Trash2 className="h-4 w-4 mr-1" />
                            Delete
                        </button>
                    </div>
                </div>

                <div className="bg-white shadow overflow-hidden sm:rounded-lg">
                    <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
                        <div>
                            <h3 className="text-lg leading-6 font-medium text-gray-900">Category Details</h3>
                            <p className="mt-1 max-w-2xl text-sm text-gray-500">Detailed information about this category.</p>
                        </div>
                        <div className="flex items-center">
                            <span className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${category.is_active
                                    ? 'bg-green-100 text-green-800'
                                    : 'bg-gray-100 text-gray-800'
                                }`}>
                                {category.is_active ? 'Active' : 'Inactive'}
                            </span>
                        </div>
                    </div>
                    <div className="border-t border-gray-200">
                        <dl>
                            <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                <dt className="text-sm font-medium text-gray-500 flex items-center">
                                    <Tag className="h-5 w-5 mr-1 text-emerald-600" />
                                    Name
                                </dt>
                                <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0 font-medium">
                                    {category.name}
                                </dd>
                            </div>
                            <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                <dt className="text-sm font-medium text-gray-500 flex items-center">
                                    <Eye className="h-5 w-5 mr-1 text-emerald-600" />
                                    Slug
                                </dt>
                                <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
                                    {category.slug}
                                </dd>
                            </div>
                            {category.parent && (
                                <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                    <dt className="text-sm font-medium text-gray-500 flex items-center">
                                        <FolderTree className="h-5 w-5 mr-1 text-emerald-600" />
                                        Parent Category
                                    </dt>
                                    <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
                                        <Link
                                            href={route('admin.categories.show', category.parent.id)}
                                            className="text-emerald-600 hover:text-emerald-500"
                                        >
                                            {category.parent.name}
                                        </Link>
                                    </dd>
                                </div>
                            )}
                            <div className={`${category.parent ? 'bg-white' : 'bg-gray-50'} px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6`}>
                                <dt className="text-sm font-medium text-gray-500 flex items-center">
                                    <Hash className="h-5 w-5 mr-1 text-emerald-600" />
                                    Display Order
                                </dt>
                                <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
                                    {category.order}
                                </dd>
                            </div>
                            <div className={`${category.parent ? 'bg-gray-50' : 'bg-white'} px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6`}>
                                <dt className="text-sm font-medium text-gray-500 flex items-center">
                                    <AlignLeft className="h-5 w-5 mr-1 text-emerald-600" />
                                    Description
                                </dt>
                                <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
                                    {category.description || <span className="text-gray-400 italic">No description provided</span>}
                                </dd>
                            </div>
                            <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                <dt className="text-sm font-medium text-gray-500 flex items-center">
                                    {category.is_active ? (
                                        <CheckCircle className="h-5 w-5 mr-1 text-green-600" />
                                    ) : (
                                        <XCircle className="h-5 w-5 mr-1 text-red-600" />
                                    )}
                                    Status
                                </dt>
                                <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
                                    {category.is_active ? 'Active' : 'Inactive'}
                                </dd>
                            </div>
                            <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                <dt className="text-sm font-medium text-gray-500 flex items-center">
                                    <Calendar className="h-5 w-5 mr-1 text-emerald-600" />
                                    Created At
                                </dt>
                                <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
                                    {formatDate(category.created_at)}
                                </dd>
                            </div>
                            <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                <dt className="text-sm font-medium text-gray-500 flex items-center">
                                    <Clock className="h-5 w-5 mr-1 text-emerald-600" />
                                    Last Updated
                                </dt>
                                <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
                                    {formatDate(category.updated_at)}
                                </dd>
                            </div>
                            {category.image && (
                                <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                    <dt className="text-sm font-medium text-gray-500 flex items-center">
                                        <FileImage className="h-5 w-5 mr-1 text-emerald-600" />
                                        Image
                                    </dt>
                                    <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
                                        <img
                                            src={`/storage/${category.image}`}
                                            alt={category.name}
                                            className="h-24 w-24 object-cover rounded-md border border-gray-200"
                                        />
                                    </dd>
                                </div>
                            )}
                        </dl>
                    </div>
                </div>

                {/* Subcategories Section */}
                {category.children && category.children.length > 0 && (
                    <div className="mt-8">
                        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
                            <div className="px-4 py-5 sm:px-6">
                                <h3 className="text-lg leading-6 font-medium text-gray-900 flex items-center">
                                    <FolderTree className="h-5 w-5 mr-2 text-emerald-600" />
                                    Subcategories
                                    <span className="ml-2 text-sm font-medium text-gray-600 bg-gray-100 rounded-full px-2">
                                        {category.children.length}
                                    </span>
                                </h3>
                            </div>
                            <div className="border-t border-gray-200 px-4 py-5 sm:p-0">
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
                                    {category.children.map((child) => (
                                        <div key={child.id} className="border border-gray-200 rounded-md overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                                            <div className="p-4">
                                                <div className="flex items-center">
                                                    {child.image ? (
                                                        <img
                                                            src={`/storage/${child.image}`}
                                                            alt={child.name}
                                                            className="h-10 w-10 mr-3 rounded-md object-cover"
                                                        />
                                                    ) : (
                                                        <div className="h-10 w-10 mr-3 rounded-md bg-emerald-100 flex items-center justify-center">
                                                            <Tag className="h-5 w-5 text-emerald-600" />
                                                        </div>
                                                    )}
                                                    <div>
                                                        <Link
                                                            href={route('admin.categories.show', child.id)}
                                                            className="font-medium text-emerald-600 hover:text-emerald-500"
                                                        >
                                                            {child.name}
                                                        </Link>
                                                        <p className="text-xs text-gray-500 mt-1">
                                                            {child.is_active ? (
                                                                <span className="text-green-600 flex items-center">
                                                                    <CheckCircle className="h-3 w-3 mr-1" /> Active
                                                                </span>
                                                            ) : (
                                                                <span className="text-gray-400 flex items-center">
                                                                    <XCircle className="h-3 w-3 mr-1" /> Inactive
                                                                </span>
                                                            )}
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Products Section */}
                {category.products && category.products.length > 0 && (
                    <div className="mt-8">
                        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
                            <div className="px-4 py-5 sm:px-6">
                                <h3 className="text-lg leading-6 font-medium text-gray-900 flex items-center">
                                    <Package className="h-5 w-5 mr-2 text-emerald-600" />
                                    Products in this Category
                                    <span className="ml-2 text-sm font-medium text-gray-600 bg-gray-100 rounded-full px-2">
                                        {category.products.length}
                                    </span>
                                </h3>
                            </div>
                            <div className="border-t border-gray-200">
                                <div className="overflow-x-auto">
                                    <table className="min-w-full divide-y divide-gray-200">
                                        <thead className="bg-gray-50">
                                            <tr>
                                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Product
                                                </th>
                                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Price
                                                </th>
                                                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Actions
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody className="bg-white divide-y divide-gray-200">
                                            {category.products.map((product) => (
                                                <tr key={product.id}>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <div className="flex items-center">
                                                            {product.thumbnail ? (
                                                                <img
                                                                    src={`/storage/${product.thumbnail}`}
                                                                    alt={product.name}
                                                                    className="h-10 w-10 rounded-md object-cover mr-3"
                                                                />
                                                            ) : (
                                                                <div className="h-10 w-10 rounded-md bg-gray-100 flex items-center justify-center mr-3">
                                                                    <Package className="h-5 w-5 text-gray-400" />
                                                                </div>
                                                            )}
                                                            <div>
                                                                <div className="text-sm font-medium text-gray-900">{product.name}</div>
                                                                <div className="text-sm text-gray-500">{product.slug}</div>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <div className="text-sm text-gray-900">
                                                            ${product.price.toFixed(2)}
                                                        </div>
                                                        {product.sale_price && (
                                                            <div className="text-sm text-red-600">
                                                                Sale: ${product.sale_price.toFixed(2)}
                                                            </div>
                                                        )}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                        <Link
                                                            href={route('admin.products.edit', product.id)}
                                                            className="text-indigo-600 hover:text-indigo-900 mr-3"
                                                        >
                                                            <Edit className="h-5 w-5 inline" />
                                                        </Link>
                                                        <Link
                                                            href={route('admin.products.show', product.id)}
                                                            className="text-blue-600 hover:text-blue-900"
                                                        >
                                                            <Eye className="h-5 w-5 inline" />
                                                        </Link>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Delete Confirmation Modal */}
                {showDeleteModal && (
                    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity z-50 flex items-center justify-center">
                        <div className="relative bg-white rounded-lg shadow-xl sm:max-w-md sm:w-full p-4">
                            <div className="sm:flex sm:items-start">
                                <div className="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                                    <AlertTriangle className="h-6 w-6 text-red-600" aria-hidden="true" />
                                </div>
                                <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                                    <h3 className="text-lg font-medium leading-6 text-gray-900">Delete Category</h3>
                                    <div className="mt-2">
                                        <p className="text-sm text-gray-500">
                                            Are you sure you want to delete the category "{category.name}"? This action cannot be undone.
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
            </div>
        </AdminLayout>
    );
};

export default Show;
