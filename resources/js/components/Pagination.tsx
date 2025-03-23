import React from 'react';
import { Link } from '@inertiajs/react';

interface PaginationLink {
    url: string | null;
    label: string;
    active: boolean;
}

interface PaginationProps {
    links: PaginationLink[];
}

const Pagination: React.FC<PaginationProps> = ({ links }) => {

    if (!links || !Array.isArray(links) || links.length <= 3) {
        return null;
    }

    return (
        <div className="flex items-center justify-center">
            <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                {links.map((link, index) => {
                    // Strip HTML from label
                    const label = link.label.replace(/(&laquo;|&raquo;)/g, '');

                    // Determine if it's a previous or next link
                    const isPrevious = index === 0;
                    const isNext = index === links.length - 1;

                    // Skip rendering the current page label "..."
                    if (link.label.includes('...')) {
                        return (
                            <span
                                key={index}
                                className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700"
                            >
                                ...
                            </span>
                        );
                    }

                    if (link.url === null) {
                        return (
                            <span
                                key={index}
                                className={`relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium ${isPrevious || isNext ? 'text-gray-300' : 'text-gray-700'
                                    }`}
                            >
                                {isPrevious && (
                                    <span className="sr-only">Previous</span>
                                )}
                                {isNext && (
                                    <span className="sr-only">Next</span>
                                )}
                                {isPrevious ? (
                                    <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                                        <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                                    </svg>
                                ) : isNext ? (
                                    <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                                        <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                                    </svg>
                                ) : (
                                    label
                                )}
                            </span>
                        );
                    }

                    return (
                        <Link
                            key={index}
                            href={link.url}
                            className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${link.active
                                ? 'z-10 bg-emerald-50 border-emerald-500 text-emerald-600'
                                : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                                }`}
                            aria-current={link.active ? 'page' : undefined}
                        >
                            {isPrevious && (
                                <span className="sr-only">Previous</span>
                            )}
                            {isNext && (
                                <span className="sr-only">Next</span>
                            )}
                            {isPrevious ? (
                                <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                                    <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                                </svg>
                            ) : isNext ? (
                                <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                                    <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                                </svg>
                            ) : (
                                label
                            )}
                        </Link>
                    );
                })}
            </nav>
        </div>
    );
};

export default Pagination;
