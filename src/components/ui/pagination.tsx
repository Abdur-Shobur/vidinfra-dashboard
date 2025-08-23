'use client';

import { Button } from '@/components/ui/button';
import {
	ChevronLeft,
	ChevronRight,
	ChevronsLeft,
	ChevronsRight,
} from 'lucide-react';

export interface PaginationProps {
	// current page (1-based)
	currentPage: number;
	// total number of items
	totalItems: number;
	// items per page
	pageSize: number;
	// available page sizes
	pageSizeOptions?: number[];
	// callback when page changes
	onPageChange: (page: number) => void;
	// callback when page size changes
	onPageSizeChange?: (pageSize: number) => void;
	// whether to show page size selector
	showPageSizeSelector?: boolean;
	// whether to show first/last page buttons
	showFirstLastButtons?: boolean;
	// custom className for the container
	className?: string;
	// whether the component is disabled
	disabled?: boolean;
}

export function Pagination({
	currentPage,
	totalItems,
	pageSize,
	pageSizeOptions = [10, 20, 50, 100],
	onPageChange,
	onPageSizeChange,
	showPageSizeSelector = true,
	showFirstLastButtons = true,
	className = '',
	disabled = false,
}: PaginationProps) {
	const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
	const startItem = (currentPage - 1) * pageSize + 1;
	const endItem = Math.min(currentPage * pageSize, totalItems);

	// don't render if no items
	if (totalItems === 0) {
		return null;
	}

	return (
		<div
			className={`flex items-center flex-col md:flex-row justify-between gap-4 ${className}`}
		>
			{/* results info */}
			<div className="text-sm text-gray-500 dark:text-gray-400">
				Showing {startItem} to {endItem} of {totalItems} results
			</div>

			<div className="flex items-center gap-4 flex-col sm:flex-row">
				{/* page size selector */}
				{showPageSizeSelector && onPageSizeChange && (
					<div className="flex items-center gap-2">
						<span className="text-sm text-gray-500 dark:text-gray-400">
							Rows per page
						</span>
						<select
							aria-label="Rows per page"
							className="border border-gray-200 dark:border-gray-700 rounded px-2 py-1 text-sm bg-white dark:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
							value={String(pageSize)}
							onChange={(e) => onPageSizeChange(Number(e.target.value))}
							disabled={disabled}
						>
							{pageSizeOptions.map((size) => (
								<option key={size} value={size}>
									{size}
								</option>
							))}
						</select>
					</div>
				)}

				{/* pagination buttons */}
				<div className="flex items-center gap-1">
					{/* first page button */}
					{showFirstLastButtons && (
						<Button
							variant="outline"
							size="sm"
							disabled={disabled || currentPage <= 1}
							onClick={() => onPageChange(1)}
							className="h-8 w-8 p-0"
							aria-label="Go to first page"
						>
							<ChevronsLeft className="h-4 w-4" />
						</Button>
					)}

					{/* previous page button */}
					<Button
						variant="outline"
						size="sm"
						disabled={disabled || currentPage <= 1}
						onClick={() => onPageChange(currentPage - 1)}
						className="h-8 w-8 p-0"
						aria-label="Go to previous page"
					>
						<ChevronLeft className="h-4 w-4" />
					</Button>

					{/* page info */}
					<span className="text-sm text-gray-700 dark:text-gray-300 px-2">
						Page {currentPage} of {totalPages}
					</span>

					{/* next page button */}
					<Button
						variant="outline"
						size="sm"
						disabled={disabled || currentPage >= totalPages}
						onClick={() => onPageChange(currentPage + 1)}
						className="h-8 w-8 p-0"
						aria-label="Go to next page"
					>
						<ChevronRight className="h-4 w-4" />
					</Button>

					{/* last page button */}
					{showFirstLastButtons && (
						<Button
							variant="outline"
							size="sm"
							disabled={disabled || currentPage >= totalPages}
							onClick={() => onPageChange(totalPages)}
							className="h-8 w-8 p-0"
							aria-label="Go to last page"
						>
							<ChevronsRight className="h-4 w-4" />
						</Button>
					)}
				</div>
			</div>
		</div>
	);
}
