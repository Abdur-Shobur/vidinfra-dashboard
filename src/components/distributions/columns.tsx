'use client';

import { Badge } from '@/components/ui/badge';
import { formatDate, formatTime } from '@/lib/format';
import { cn } from '@/lib/utils';
import type { Distribution } from '@/types/cdn';
import { ColumnDef } from '@tanstack/react-table';
import { CircleAlert, CircleCheck, CircleX, Hourglass } from 'lucide-react';

const statusConfig: Record<
	string,
	{
		icon: React.ComponentType<{ className?: string }>;
		label: string;
		className?: string;
	}
> = {
	provisioning: {
		icon: Hourglass,
		label: 'Provisioning',
		className: 'text-success-300',
	},
	active: {
		icon: CircleCheck,
		label: 'Active',
		className: 'text-success-300',
	},
	inactive: {
		icon: CircleAlert,
		label: 'Inactive',
		className: 'text-warning-300',
	},

	disabled: {
		icon: CircleX,
		label: 'Suspended',
		className: 'text-error-300',
	},
};

export const columns: ColumnDef<Distribution>[] = [
	{
		accessorKey: 'name',
		header: 'Label',
		cell: ({ getValue }) => (
			<span className="font-medium text-gray-900 dark:text-gray-300">
				{String(getValue())}
			</span>
		),
	},
	{
		accessorKey: 'cname',
		header: 'CNAME',
		cell: ({ getValue }) => (
			<span className="text-gray-600 dark:text-gray-300 font-mono text-sm">
				{String(getValue())}
			</span>
		),
	},
	{
		accessorKey: 'domain',
		header: 'Domain',
		cell: ({ getValue }) => (
			<span className="text-gray-600 dark:text-gray-300 font-mono text-sm">
				{String(getValue())}
			</span>
		),
	},
	{
		accessorKey: 'status',
		header: 'Status',
		cell: ({ getValue }) => {
			const status = String(getValue());
			const config = statusConfig[status] || statusConfig.inactive;
			const Icon = config.icon;

			return (
				<div className="flex items-center gap-2">
					<Badge variant="outline" className={'capitalize'}>
						<Icon className={cn('h-4 w-4', config.className)} />
						{config.label}
					</Badge>
				</div>
			);
		},
	},
	{
		accessorKey: 'created_at',
		id: 'date_modified',
		header: 'Date Modified',
		cell: ({ getValue }) => {
			const dateValue = String(getValue());
			const formattedDate = formatDate(dateValue);
			return (
				<span className="text-gray-600 dark:text-gray-300">
					{formattedDate}
				</span>
			);
		},
	},
	{
		accessorKey: 'created_at',
		id: 'time',
		header: 'Time',
		cell: ({ getValue }) => {
			const dateValue = String(getValue());
			const formattedTime = formatTime(dateValue);
			return (
				<span className="text-gray-600 dark:text-gray-300">
					{formattedTime}
				</span>
			);
		},
	},
];
