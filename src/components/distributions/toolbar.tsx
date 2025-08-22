'use client';

import * as React from 'react';
import { useDebouncedCallback } from 'use-debounce';
import { format } from 'date-fns';
import { Calendar } from '@/components/ui/calendar';
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from '@/components/ui/popover';
import { Input } from '@/components/ui/input';
import {
	Select,
	SelectTrigger,
	SelectContent,
	SelectItem,
	SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Search, Plus, ChevronDown, ArrowUpDown } from 'lucide-react';

export default function Toolbar({
	params,
	setParams,
}: {
	params: Record<string, any>;
	setParams: (updater: any) => void;
}) {
	const debounced = useDebouncedCallback((v: string) => {
		setParams((p: any) => ({ ...p, page: 1, cname: v }));
	}, 400);

	const onStatus = (v: string) =>
		setParams((p: any) => ({ ...p, page: 1, status: v === 'all' ? '' : v }));

	return (
		<div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
			{/* Search Bar */}
			<div className="relative flex-1 max-w-md">
				<Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
				<Input
					defaultValue={params.cname ?? ''}
					placeholder="Search titles..."
					onChange={(e) => debounced(e.target.value)}
					aria-label="Search distributions"
					className="pl-10 bg-white border-gray-200 focus:border-gray-300 focus:ring-gray-300"
				/>
			</div>

			{/* Filter Buttons */}
			<div className="flex items-center gap-2">
				<Popover>
					<PopoverTrigger asChild>
						<Button
							variant="outline"
							className="gap-2 bg-white border-gray-200 hover:bg-gray-50"
						>
							<Plus className="h-4 w-4" />
							Status
							<ChevronDown className="h-4 w-4" />
						</Button>
					</PopoverTrigger>
					<PopoverContent className="w-48 p-2" align="end">
						<Select
							onValueChange={onStatus}
							defaultValue={params.status || 'all'}
						>
							<SelectTrigger className="w-full">
								<SelectValue placeholder="Select status" />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="all">All Status</SelectItem>
								<SelectItem value="active">Active</SelectItem>
								<SelectItem value="inactive">Inactive</SelectItem>
								<SelectItem value="pending">Pending</SelectItem>
							</SelectContent>
						</Select>
					</PopoverContent>
				</Popover>

				<Popover>
					<PopoverTrigger asChild>
						<Button
							variant="outline"
							className="gap-2 bg-white border-gray-200 hover:bg-gray-50"
						>
							<Plus className="h-4 w-4" />
							Created At
							<ChevronDown className="h-4 w-4" />
						</Button>
					</PopoverTrigger>
					<PopoverContent className="p-2" align="end">
						<Calendar
							mode="range"
							selected={{
								from: params.created_from
									? new Date(params.created_from)
									: undefined,
								to: params.created_to ? new Date(params.created_to) : undefined,
							}}
							onSelect={(range) => {
								const from = range?.from
									? format(range.from, 'yyyy-MM-dd')
									: '';
								const to = range?.to ? format(range.to, 'yyyy-MM-dd') : '';
								setParams((p: any) => ({
									...p,
									page: 1,
									created_from: from,
									created_to: to,
								}));
							}}
							numberOfMonths={2}
							initialFocus
						/>
					</PopoverContent>
				</Popover>

				<Button
					variant="outline"
					className="gap-2 bg-white border-gray-200 hover:bg-gray-50"
				>
					<Plus className="h-4 w-4" />
					Priority
					<ChevronDown className="h-4 w-4" />
				</Button>

				<Button
					variant="outline"
					className="gap-2 bg-white border-gray-200 hover:bg-gray-50"
				>
					<ArrowUpDown className="h-4 w-4" />
					Sort
				</Button>
			</div>
		</div>
	);
}
