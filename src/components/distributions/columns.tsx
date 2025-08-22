'use client';

import { ColumnDef } from '@tanstack/react-table';
import type { Distribution } from '@/types/cdn';
import { Badge } from '@/components/ui/badge';
import { formatDate, formatTime } from '@/lib/format';
import { CheckCircle, XCircle, AlertCircle, Clock } from 'lucide-react';

const statusConfig: Record<
	Distribution['status'],
	{
		variant: string;
		icon: React.ComponentType<{ className?: string }>;
		label: string;
	}
> = {
	active: {
		variant: 'bg-green-100 text-green-700 border-green-200',
		icon: CheckCircle,
		label: 'Active',
	},
	inactive: {
		variant: 'bg-red-100 text-red-700 border-red-200',
		icon: XCircle,
		label: 'Inactive',
	},
	pending: {
		variant: 'bg-blue-100 text-blue-700 border-blue-200',
		icon: Clock,
		label: 'Provisioning',
	},
};

export const columns: ColumnDef<Distribution>[] = [
	{
		accessorKey: 'label',
		header: 'Label',
		cell: ({ getValue }) => (
			<span className="font-medium text-gray-900">{String(getValue())}</span>
		),
	},
	{
		accessorKey: 'cname',
		header: 'Domain',
		cell: ({ getValue }) => (
			<span className="text-gray-600 font-mono text-sm">
				{String(getValue())}
			</span>
		),
	},
	{
		accessorKey: 'status',
		header: 'Status',
		cell: ({ getValue }) => {
			const status = String(getValue()) as Distribution['status'];
			const config = statusConfig[status];
			const Icon = config.icon;

			return (
				<div className="flex items-center gap-2">
					<Icon className="h-4 w-4" />
					<Badge className={`${config.variant} border`}>{config.label}</Badge>
				</div>
			);
		},
	},
	{
		accessorKey: 'created_at',
		header: 'Date Modified',
		cell: ({ getValue }) => (
			<span className="text-gray-600">{formatDate(String(getValue()))}</span>
		),
	},
	{
		accessorKey: 'created_at',
		header: 'Time',
		cell: ({ getValue }) => (
			<span className="text-gray-600">{formatTime(String(getValue()))}</span>
		),
	},
];
