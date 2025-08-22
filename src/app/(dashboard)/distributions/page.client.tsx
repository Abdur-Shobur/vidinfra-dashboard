'use client';

import { useQuery } from '@tanstack/react-query';
import { useQueryStates } from 'nuqs';
import { paramsConfig } from '@/lib/url';
import { fetchDistributions } from '@/lib/distributions';
import DataTable from '@/components/distributions/data-table';
import Toolbar from '@/components/distributions/toolbar';
import { Button } from '@/components/ui/button';
import { Plus, ChevronRight } from 'lucide-react';

export default function DistributionsPage(props: {
	initialSearchParams: Record<string, any>;
}) {
	const [params, setParams] = useQueryStates(paramsConfig, { shallow: false });
	const { page, limit, cname, status, created_from, created_to, sort } = params;

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

	return (
		<div className="h-full flex flex-col">
			{/* Header */}
			<div className="border-b bg-white px-6 py-4">
				{/* Breadcrumbs */}
				<div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
					<span>Products</span>
					<ChevronRight className="h-4 w-4" />
					<span>CDN</span>
					<ChevronRight className="h-4 w-4" />
					<span className="text-gray-900">Distributions</span>
				</div>

				{/* Title and Action Button */}
				<div className="flex items-center justify-between">
					<div>
						<h1 className="text-2xl font-semibold text-gray-900">
							Distributions
						</h1>
						<p className="text-sm text-gray-500 mt-1">
							Recently created CDN distribution from this organization.
						</p>
					</div>
					<Button className="bg-green-600 hover:bg-green-700">
						<Plus className="h-4 w-4 mr-2" />
						Create Distribution
					</Button>
				</div>
			</div>

			{/* Content */}
			<div className="flex-1 p-6 space-y-6">
				<Toolbar params={params} setParams={setParams} />
				<DataTable
					loading={query.isLoading}
					error={query.isError ? (query.error as Error).message : ''}
					data={query.data?.data ?? []}
					page={query.data?.meta.page ?? page}
					limit={query.data?.meta.limit ?? limit}
					total={query.data?.meta.total ?? 0}
					params={params}
					setParams={setParams}
				/>
			</div>
		</div>
	);
}
