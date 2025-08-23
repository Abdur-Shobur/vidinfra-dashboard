'use client';

import { useState } from 'react';
import { Pagination } from './pagination';

// Example 1: Basic pagination
export function BasicPaginationExample() {
	const [currentPage, setCurrentPage] = useState(1);
	const [pageSize, setPageSize] = useState(10);
	const totalItems = 150;

	return (
		<div className="space-y-4">
			<h3 className="text-lg font-medium">Basic Pagination</h3>
			<Pagination
				currentPage={currentPage}
				totalItems={totalItems}
				pageSize={pageSize}
				onPageChange={setCurrentPage}
				onPageSizeChange={setPageSize}
			/>
		</div>
	);
}

// Example 2: Pagination without page size selector
export function SimplePaginationExample() {
	const [currentPage, setCurrentPage] = useState(1);
	const totalItems = 50;

	return (
		<div className="space-y-4">
			<h3 className="text-lg font-medium">Simple Pagination (No Page Size)</h3>
			<Pagination
				currentPage={currentPage}
				totalItems={totalItems}
				pageSize={20}
				onPageChange={setCurrentPage}
				showPageSizeSelector={false}
			/>
		</div>
	);
}

// Example 3: Pagination without first/last buttons
export function CompactPaginationExample() {
	const [currentPage, setCurrentPage] = useState(1);
	const [pageSize, setPageSize] = useState(15);
	const totalItems = 200;

	return (
		<div className="space-y-4">
			<h3 className="text-lg font-medium">
				Compact Pagination (No First/Last)
			</h3>
			<Pagination
				currentPage={currentPage}
				totalItems={totalItems}
				pageSize={pageSize}
				onPageChange={setCurrentPage}
				onPageSizeChange={setPageSize}
				showFirstLastButtons={false}
				pageSizeOptions={[15, 30, 60]}
			/>
		</div>
	);
}

// Example 4: Disabled pagination
export function DisabledPaginationExample() {
	const [currentPage, setCurrentPage] = useState(1);
	const [pageSize, setPageSize] = useState(10);
	const totalItems = 0; // No items

	return (
		<div className="space-y-4">
			<h3 className="text-lg font-medium">Disabled Pagination (No Items)</h3>
			<Pagination
				currentPage={currentPage}
				totalItems={totalItems}
				pageSize={pageSize}
				onPageChange={setCurrentPage}
				onPageSizeChange={setPageSize}
				disabled={true}
			/>
		</div>
	);
}

// Example 5: Custom styling
export function CustomPaginationExample() {
	const [currentPage, setCurrentPage] = useState(1);
	const [pageSize, setPageSize] = useState(25);
	const totalItems = 300;

	return (
		<div className="space-y-4">
			<h3 className="text-lg font-medium">Custom Styled Pagination</h3>
			<Pagination
				currentPage={currentPage}
				totalItems={totalItems}
				pageSize={pageSize}
				onPageChange={setCurrentPage}
				onPageSizeChange={setPageSize}
				pageSizeOptions={[25, 50, 100]}
				className="bg-gray-50 p-4 rounded-lg border"
			/>
		</div>
	);
}
