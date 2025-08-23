'use client';

import { DateRangePicker } from '@/components/date-range/date-range-picker';
import DataTable from '@/components/distributions/data-table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { SelectSearch } from '@/components/ui/searchable-select';
import { fetchDistributions } from '@/lib/distributions';
import { paramsConfig } from '@/lib/url';
import { useQuery } from '@tanstack/react-query';
import { format } from 'date-fns';
import {
	ArrowUpDown,
	CircleAlert,
	CircleCheck,
	Hourglass,
	Search,
} from 'lucide-react';
import { useQueryStates } from 'nuqs';
import { useEffect, useState } from 'react';
import { DateRange } from 'react-day-picker';
import { useDebouncedCallback } from 'use-debounce';

export default function DistributionsPage() {
	// query states hook
	const [params, setParams] = useQueryStates(paramsConfig, { shallow: false });
	const { page, limit, cname, status, created_from, created_to, sort } = params;

	// local state for filters
	const [searchTerm, setSearchTerm] = useState(cname || '');
	const [statusFilter, setStatusFilter] = useState<string[]>(
		status ? [status] : []
	);
	const [dateRange, setDateRange] = useState<DateRange | undefined>(
		created_from && created_to
			? {
					from: new Date(created_from),
					to: new Date(created_to),
			  }
			: undefined
	);

	// Debounced search
	const debouncedSearch = useDebouncedCallback((value: string) => {
		setParams((p) => ({ ...p, page: 1, cname: value }));
	}, 400);

	// Handle search input change
	const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const value = e.target.value;
		// update local state
		setSearchTerm(value);
		// debounced search
		debouncedSearch(value);
	};

	// Handle status filter change
	const handleStatusChange = (selectedValues: string[]) => {
		// update local state
		setStatusFilter(selectedValues);
		// update url params
		const statusValue =
			selectedValues.length > 0 ? selectedValues.join(',') : '';
		setParams((p) => ({ ...p, page: 1, status: statusValue }));
	};

	// Handle date range change
	const handleDateRangeChange = (range: DateRange | undefined) => {
		// update local state
		setDateRange(range);
		// update url params
		const from = range?.from ? format(range.from, 'yyyy-MM-dd') : '';
		const to = range?.to ? format(range.to, 'yyyy-MM-dd') : '';
		setParams((p) => ({ ...p, page: 1, created_from: from, created_to: to }));
	};

	// Handle sort change
	const handleSortChange = () => {
		// update url params
		const currentSort = sort || '-created_at';
		const newSort = currentSort.startsWith('-')
			? currentSort.slice(1)
			: `-${currentSort}`;
		setParams((p) => ({ ...p, sort: newSort }));
	};

	// Handle reset filters
	const handleResetFilters = () => {
		setParams((p) => ({
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
	};

	// Check if any filters are active
	const hasActiveFilters =
		cname ||
		status ||
		created_from ||
		created_to ||
		params.name ||
		params.domain ||
		params.domain_type ||
		params.cache_strategy ||
		params.enable_ssl ||
		params.is_http2 ||
		params.is_http3 ||
		sort;

	// Count active filters
	const getActiveFilterCount = () => {
		let count = 0;
		if (cname) count++;
		if (status) count++;
		if (created_from || created_to) count++;
		if (params.name) count++;
		if (params.domain) count++;
		if (params.domain_type) count++;
		if (params.cache_strategy) count++;
		if (params.enable_ssl) count++;
		if (params.is_http2) count++;
		if (params.is_http3) count++;
		if (sort) count++;
		return count;
	};

	/** API CALL
	 * query for fetching distributions
	 */
	const query = useQuery({
		queryKey: [
			'distributions',
			page,
			limit,
			cname,
			status,
			created_from,
			created_to,
			sort,
		],
		queryFn: () =>
			fetchDistributions({
				page,
				limit,
				cname,
				status,
				created_from,
				created_to,
				sort,
			}),
		staleTime: 30_000,
	});

	// sync local state with URL params
	useEffect(() => {
		setSearchTerm(cname || '');
		setStatusFilter(status ? status.split(',') : []);
		setDateRange(
			created_from && created_to
				? {
						from: new Date(created_from),
						to: new Date(created_to),
				  }
				: undefined
		);
	}, [cname, status, created_from, created_to]);

	// data
	const { data, isLoading, error } = query;
	// data for the table
	const distributions = data?.data || [];
	// total number of distributions
	const total = data?.meta?.pagination?.total || 0;

	return (
		<div className="space-y-6">
			{/* Filters */}
			<div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
				<div className="flex flex-wrap flex-row gap-4 items-start sm:items-center">
					{/* Search */}
					<div className="relative max-w-[300px]">
						<Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
						<Input
							className={`h-8 pl-10`}
							placeholder="Search by name or CNAME..."
							value={searchTerm}
							onChange={handleSearchChange}
						/>
					</div>

					{/* Status Filter */}
					<div className="max-w-[200px]">
						<SelectSearch
							label="Status"
							options={[
								{
									label: 'All Statuses',
									value: '',
									icon: <CircleCheck className="size-3 text-gray-400" />,
								},
								{
									label: 'provisioning',
									value: 'provisioning',
									icon: <Hourglass className="size-3 text-success-300" />,
								},
								{
									label: 'Active',
									value: 'active',
									icon: <CircleCheck className="size-3 text-green-500" />,
								},

								{
									label: 'Suspended',
									value: 'disabled',
									icon: <CircleAlert className="size-3 text-yellow-500" />,
								},
							]}
							placeholder="Filter by status..."
							value={statusFilter}
							onSelectorClick={handleStatusChange}
							multiple={true}
						/>
					</div>

					{/* Date Range */}
					<div>
						<DateRangePicker
							align="start"
							initialDateFrom={dateRange?.from}
							initialDateTo={dateRange?.to}
							onUpdate={({ range }) => handleDateRangeChange(range)}
						/>
					</div>

					{/* Reset Filters Button - only show when filters are active */}
					{hasActiveFilters && (
						<Button
							variant="outline"
							className="gap-2 bg-white border-red-200 hover:bg-red-50 text-red-600 hover:text-red-700"
							onClick={handleResetFilters}
						>
							Reset Filters ({getActiveFilterCount()})
						</Button>
					)}
				</div>

				{/* Sort Button */}
				<div>
					<Button
						variant="outline"
						className="gap-2 bg-white border-gray-200 hover:bg-gray-50"
						onClick={handleSortChange}
					>
						<ArrowUpDown className="size-4" />
						Sort {sort?.startsWith('-') ? 'Newest' : 'Oldest'} First
					</Button>
				</div>
			</div>

			{/* Data Table */}
			<DataTable
				loading={isLoading}
				error={error?.message || ''}
				data={distributions}
				page={page}
				limit={limit}
				total={total}
				params={params}
				setParams={setParams}
			/>
		</div>
	);
}
