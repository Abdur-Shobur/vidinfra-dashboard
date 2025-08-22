'use client';

import * as React from 'react';
import {
	useReactTable,
	getCoreRowModel,
	getSortedRowModel,
	SortingState,
} from '@tanstack/react-table';
import { columns } from './columns';
import type { Distribution } from '@/types/cdn';
import { Button } from '@/components/ui/button';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
	ChevronUp,
	ChevronDown,
	MoreHorizontal,
	ChevronsLeft,
	ChevronLeft,
	ChevronRight,
	ChevronsRight,
	BarChart3,
	Shield,
	Settings,
	RotateCcw,
	Trash2,
} from 'lucide-react';

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
	const { loading, error, data, page, limit, total, params, setParams } = props;
	const [sorting, setSorting] = React.useState<SortingState>([]);

	// map sorting to API sort param
	React.useEffect(() => {
		if (!sorting.length) return;
		const s = sorting[0];
		const dir = s.desc ? '-' : '';
		setParams((p: any) => ({ ...p, sort: `${dir}${String(s.id)}` }));
	}, [sorting, setParams]);

	const table = useReactTable({
		data,
		columns,
		state: { sorting },
		onSortingChange: setSorting,
		getCoreRowModel: getCoreRowModel(),
		getSortedRowModel: getSortedRowModel(),
	});

	const pageCount = Math.max(1, Math.ceil(total / limit));

	return (
		<div className="space-y-4">
			{error && (
				<div
					role="alert"
					className="text-sm text-red-600 bg-red-50 p-3 rounded-lg"
				>
					Error: {error}
				</div>
			)}

			<div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
				<table className="w-full text-sm">
					<thead className="bg-gray-50 border-b border-gray-200">
						{table.getHeaderGroups().map((hg) => (
							<tr key={hg.id}>
								{hg.headers.map((h) => (
									<th
										key={h.id}
										className="px-6 py-4 text-left font-medium text-gray-700 cursor-pointer select-none hover:bg-gray-100 transition-colors"
										onClick={h.column.getToggleSortingHandler()}
										aria-sort={
											h.column.getIsSorted()
												? h.column.getIsSorted() === 'desc'
													? 'descending'
													: 'ascending'
												: 'none'
										}
									>
										<div className="flex items-center gap-2">
											{h.isPlaceholder
												? null
												: (h.column.columnDef.header as any)}
											{h.column.getCanSort() && (
												<div className="flex flex-col">
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
								<th className="px-6 py-4 text-left font-medium text-gray-700">
									Actions
								</th>
							</tr>
						))}
					</thead>
					<tbody className="divide-y divide-gray-200">
						{loading ? (
							Array.from({ length: 6 }).map((_, i) => (
								<tr key={i} className="hover:bg-gray-50">
									<td className="px-6 py-4" colSpan={6}>
										<div className="h-6 w-full animate-pulse bg-gray-200 rounded" />
									</td>
								</tr>
							))
						) : data.length === 0 ? (
							<tr>
								<td
									className="px-6 py-12 text-center text-gray-500"
									colSpan={6}
								>
									<div className="flex flex-col items-center gap-2">
										<div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
											<MoreHorizontal className="h-6 w-6 text-gray-400" />
										</div>
										<p className="text-sm font-medium">
											No distributions found
										</p>
										<p className="text-xs text-gray-400">
											Try adjusting your filters
										</p>
									</div>
								</td>
							</tr>
						) : (
							table.getRowModel().rows.map((r) => (
								<tr key={r.id} className="hover:bg-gray-50 transition-colors">
									{r.getVisibleCells().map((c) => (
										<td key={c.id} className="px-6 py-4">
											{c.getValue() as React.ReactNode}
										</td>
									))}
									<td className="px-6 py-4">
										<DropdownMenu>
											<DropdownMenuTrigger asChild>
												<Button
													variant="ghost"
													size="sm"
													className="h-8 w-8 p-0"
												>
													<MoreHorizontal className="h-4 w-4" />
												</Button>
											</DropdownMenuTrigger>
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
			<div className="flex items-center justify-between">
				<div className="text-sm text-gray-500">
					0 of {total} row(s) selected.
				</div>
				<div className="flex items-center gap-4">
					<div className="flex items-center gap-2">
						<span className="text-sm text-gray-500">Rows per page</span>
						<select
							aria-label="Rows per page"
							className="border border-gray-200 rounded px-2 py-1 text-sm bg-white"
							value={String(limit)}
							onChange={(e) =>
								props.setParams((p: any) => ({
									...p,
									page: 1,
									limit: Number(e.target.value),
								}))
							}
						>
							{[10, 20, 50].map((n) => (
								<option key={n} value={n}>
									{n}
								</option>
							))}
						</select>
					</div>
					<div className="flex items-center gap-1">
						<Button
							variant="outline"
							size="sm"
							disabled={page <= 1}
							onClick={() => setParams((p: any) => ({ ...p, page: 1 }))}
							className="h-8 w-8 p-0"
						>
							<ChevronsLeft className="h-4 w-4" />
						</Button>
						<Button
							variant="outline"
							size="sm"
							disabled={page <= 1}
							onClick={() =>
								setParams((p: any) => ({ ...p, page: p.page - 1 }))
							}
							className="h-8 w-8 p-0"
						>
							<ChevronLeft className="h-4 w-4" />
						</Button>
						<span className="text-sm text-gray-700 px-2">
							Page {page} of {pageCount}
						</span>
						<Button
							variant="outline"
							size="sm"
							disabled={page >= pageCount}
							onClick={() =>
								setParams((p: any) => ({ ...p, page: p.page + 1 }))
							}
							className="h-8 w-8 p-0"
						>
							<ChevronRight className="h-4 w-4" />
						</Button>
						<Button
							variant="outline"
							size="sm"
							disabled={page >= pageCount}
							onClick={() => setParams((p: any) => ({ ...p, page: pageCount }))}
							className="h-8 w-8 p-0"
						>
							<ChevronsRight className="h-4 w-4" />
						</Button>
					</div>
				</div>
			</div>
		</div>
	);
}
