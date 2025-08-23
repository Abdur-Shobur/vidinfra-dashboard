'use client';

import { Button } from '@/components/ui/button';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Pagination } from '@/components/ui/pagination';
import type { Distribution } from '@/types/cdn';
import {
	flexRender,
	getCoreRowModel,
	getSortedRowModel,
	SortingState,
	useReactTable,
} from '@tanstack/react-table';
import {
	BarChart3,
	ChevronDown,
	ChevronUp,
	EllipsisVertical,
	MoreHorizontal,
	RotateCcw,
	Settings,
	Shield,
	Trash2,
} from 'lucide-react';
import * as React from 'react';
import { columns } from './columns';

export default function DataTable(props: {
	loading: boolean;
	error: string;
	data: Distribution[];
	page: number;
	limit: number;
	total: number;
	params: Record<string, any>;
	setParams: (updater: any) => void;
}) {
	// props
	const { loading, error, data, page, limit, total, params, setParams } = props;

	// local state for sorting
	const [sorting, setSorting] = React.useState<SortingState>([]);

	// effect for sorting
	// map sorting to API sort param
	React.useEffect(() => {
		if (!sorting.length) return;
		const s = sorting[0];
		const dir = s.desc ? '-' : '';
		setParams((p: any) => ({ ...p, sort: `${dir}${String(s.id)}` }));
	}, [sorting, setParams]);

	// table
	const table = useReactTable({
		data,
		columns,
		state: { sorting },
		onSortingChange: setSorting,
		getCoreRowModel: getCoreRowModel(),
		getSortedRowModel: getSortedRowModel(),
	});

	// current page
	const currentPage = page;
	// total items
	const totalItems = total;

	return (
		<div className="space-y-4">
			{/* error */}
			{error && (
				<div
					role="alert"
					className="text-sm text-red-600 bg-red-50 p-3 rounded-lg"
				>
					Error: {error}
				</div>
			)}

			{/* table */}
			<div className="bg-card rounded-lg border border-gray-200 dark:border-gray-700 overflow-x-auto">
				<table className="w-full text-sm ">
					<thead className="bg-card border-b border-gray-200 dark:border-gray-700">
						{table.getHeaderGroups().map((hg) => (
							<tr key={hg.id}>
								{/* headers */}
								{hg.headers.map((h) => (
									<th
										key={h.id}
										className="px-2 md:px-6 whitespace-nowrap py-2 md:py-4 text-left font-medium text-gray-700 dark:text-gray-300 cursor-pointer select-none hover:bg-gray-100 dark:hover:bg-stone-800 transition-colors"
										// sort handler
										onClick={h.column.getToggleSortingHandler()}
										// aria-sort
										aria-sort={
											h.column.getIsSorted()
												? h.column.getIsSorted() === 'desc'
													? 'descending'
													: 'ascending'
												: 'none'
										}
									>
										<div className="flex items-center gap-2">
											{/* header content */}
											{h.isPlaceholder
												? null
												: (h.column.columnDef.header as any)}
											{/* sort handler */}
											{h.column.getCanSort() && (
												<div className="flex flex-col">
													{/* sort icon */}
													{h.column.getIsSorted() === 'asc' ? (
														<ChevronUp className="h-3 w-3" />
													) : h.column.getIsSorted() === 'desc' ? (
														<ChevronDown className="h-3 w-3" />
													) : (
														<div className="flex flex-col">
															<ChevronUp className="h-3 w-3 text-gray-300" />
															<ChevronDown className="h-3 w-3 text-gray-300" />
														</div>
													)}
												</div>
											)}
										</div>
									</th>
								))}
								<th></th>
							</tr>
						))}
					</thead>
					<tbody className="divide-y divide-gray-200 dark:divide-gray-700">
						{/* loading */}
						{loading ? (
							// loading skeleton
							Array.from({ length: 10 }).map((_, i) => (
								<tr
									key={i}
									className="hover:bg-gray-50 dark:hover:bg-stone-800"
								>
									<td
										className="px-6 py-4"
										// colSpan for the table
										// +1 for the action column
										colSpan={table.getAllColumns().length + 1}
									>
										<div className="h-6 w-full animate-pulse bg-gray-200 dark:bg-gray-700 rounded" />
									</td>
								</tr>
							))
						) : data.length === 0 ? (
							// no data
							<tr>
								<td
									className="px-6 py-12 text-center text-gray-500 dark:text-gray-400"
									// colSpan for the table
									// +1 for the action column
									colSpan={table.getAllColumns().length + 1}
								>
									<div className="flex flex-col items-center gap-2">
										<div className="w-12 h-12 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center">
											<MoreHorizontal className="h-6 w-6 text-gray-400 dark:text-gray-300" />
										</div>
										<p className="text-sm font-medium">
											No distributions found
										</p>
										<p className="text-xs text-gray-400 dark:text-gray-300">
											Try adjusting your filters
											{/* reset filters button */}
											<Button
												variant="link"
												size="sm"
												className="text-blue-500 dark:text-blue-400"
												onClick={() => {
													setParams((p: any) => ({
														...p,
														page: 1,
														cname: '',
														status: '',
														created_from: '',
														created_to: '',
														name: '',
														domain: '',
														domain_type: '',
														cache_strategy: '',
														enable_ssl: '',
														is_http2: '',
														is_http3: '',
														sort: '',
													}));
													setSorting([]);
												}}
											>
												Reset Filters
											</Button>
										</p>
									</div>
								</td>
							</tr>
						) : (
							// data rows
							table.getRowModel().rows.map((r) => (
								<tr
									key={r.id}
									className="hover:bg-gray-50 dark:hover:bg-stone-800 transition-colors"
								>
									{/* cells */}
									{r.getVisibleCells().map((c) => (
										<td
											key={c.id}
											className="px-2 md:px-6 py-2 md:py-4 whitespace-nowrap text-gray-700 dark:text-gray-300	"
										>
											{flexRender(c.column.columnDef.cell, c.getContext())}
										</td>
									))}
									{/* action column */}
									<td className="px-2 md:px-6 py-2 md:py-4">
										<DropdownMenu>
											{/* dropdown menu trigger */}
											<DropdownMenuTrigger asChild>
												<Button
													variant="ghost"
													size="sm"
													className="h-8 w-8 p-0"
												>
													<EllipsisVertical className="h-4 w-4" />
												</Button>
											</DropdownMenuTrigger>
											{/* dropdown menu content */}
											<DropdownMenuContent align="end" className="w-48">
												<DropdownMenuItem className="flex items-center gap-2">
													<BarChart3 className="h-4 w-4" />
													View Analytics
												</DropdownMenuItem>
												<DropdownMenuItem className="flex items-center gap-2">
													<Shield className="h-4 w-4" />
													Purge
												</DropdownMenuItem>
												<DropdownMenuItem className="flex items-center gap-2">
													<Settings className="h-4 w-4" />
													Manage
												</DropdownMenuItem>
												<DropdownMenuItem className="flex items-center gap-2">
													<RotateCcw className="h-4 w-4" />
													Disable
												</DropdownMenuItem>
												<DropdownMenuItem className="flex items-center gap-2 text-red-600">
													<Trash2 className="h-4 w-4" />
													Delete
												</DropdownMenuItem>
											</DropdownMenuContent>
										</DropdownMenu>
									</td>
								</tr>
							))
						)}
					</tbody>
				</table>
			</div>

			{/* Pagination */}
			<Pagination
				currentPage={currentPage}
				totalItems={totalItems}
				pageSize={limit}
				pageSizeOptions={[10, 20, 50]}
				onPageChange={(page) => setParams((p: any) => ({ ...p, page }))}
				onPageSizeChange={(pageSize) =>
					setParams((p: any) => ({ ...p, page: 1, limit: pageSize }))
				}
				disabled={loading}
			/>
		</div>
	);
}
