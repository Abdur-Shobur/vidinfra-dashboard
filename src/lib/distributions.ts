import { api } from './axios';
import type { DistributionsResponse, Distribution } from '@/types/cdn';

// Mock data for testing
const mockDistributions: Distribution[] = [
	{
		id: '1',
		label: 'Global Video Delivery',
		cname: '6hjt3m4k.tbcdn.net',
		origin: 'cdn.example.com',
		status: 'active',
		created_at: '2025-05-11T11:15:00Z',
	},
	{
		id: '2',
		label: 'Edge-Optimized Streaming',
		cname: '5mtsn47q8v.tbcdn.net',
		origin: 'stream.example.com',
		status: 'pending',
		created_at: '2025-05-14T14:00:00Z',
	},
	{
		id: '3',
		label: 'Multi-Region Distribution',
		cname: '9k2p8m3n.tbcdn.net',
		origin: 'multi.example.com',
		status: 'active',
		created_at: '2025-05-10T09:30:00Z',
	},
	{
		id: '4',
		label: 'Adaptive Media Routing',
		cname: '7x4v2q1w.tbcdn.net',
		origin: 'adaptive.example.com',
		status: 'inactive',
		created_at: '2025-05-12T16:45:00Z',
	},
	{
		id: '5',
		label: 'High-Speed CDN Nodes',
		cname: '3r5t8y9u.tbcdn.net',
		origin: 'speed.example.com',
		status: 'active',
		created_at: '2025-05-13T10:20:00Z',
	},
	{
		id: '6',
		label: 'Custom Cache Rules',
		cname: '1a4s7d0f.tbcdn.net',
		origin: 'cache.example.com',
		status: 'pending',
		created_at: '2025-05-15T13:10:00Z',
	},
	{
		id: '7',
		label: 'Latency-Based Routing',
		cname: '8g2h5j6k.tbcdn.net',
		origin: 'latency.example.com',
		status: 'active',
		created_at: '2025-05-09T08:15:00Z',
	},
	{
		id: '8',
		label: 'Real-Time Content Sync',
		cname: '4l7z9x2c.tbcdn.net',
		origin: 'realtime.example.com',
		status: 'inactive',
		created_at: '2025-05-16T11:30:00Z',
	},
	{
		id: '9',
		label: 'Origin Shield Protection',
		cname: '6v3b8n1m.tbcdn.net',
		origin: 'shield.example.com',
		status: 'active',
		created_at: '2025-05-08T15:45:00Z',
	},
	{
		id: '10',
		label: 'Geo-Based Access Control',
		cname: '2q5w8e4r.tbcdn.net',
		origin: 'geo.example.com',
		status: 'pending',
		created_at: '2025-05-17T12:00:00Z',
	},
];

export async function fetchDistributions(params: {
	page: number;
	limit: number;
	cname?: string;
	status?: string;
	created_from?: string;
	created_to?: string;
	sort?: string; // e.g., "-created_at" or "created_at"
}) {
	// Use mock data if API is not available
	if (!process.env.NEXT_PUBLIC_API_BASE_URL) {
		return getMockDistributions(params);
	}

	const search = new URLSearchParams();
	search.set('page', String(params.page));
	search.set('limit', String(params.limit));

	if (params.cname) search.set('filter[cname][like]', params.cname);
	if (params.status) search.set('filter[status][eq]', params.status);
	if (params.created_from || params.created_to) {
		const from = params.created_from ?? '';
		const to = params.created_to ?? '';
		search.set('filter[created_at][between]', `${from},${to}`);
	}
	if (params.sort) search.set('sort', params.sort);

	try {
		const { data } = await api.get<DistributionsResponse>(
			`/v1/distributions?${search.toString()}`
		);
		// Ensure meta defaults if API omits:
		const meta = data.meta ?? {
			page: params.page,
			limit: params.limit,
			total: data.data.length,
		};
		return { ...data, meta };
	} catch (error) {
		console.warn('API call failed, using mock data:', error);
		return getMockDistributions(params);
	}
}

function getMockDistributions(params: {
	page: number;
	limit: number;
	cname?: string;
	status?: string;
	created_from?: string;
	created_to?: string;
	sort?: string;
}): DistributionsResponse {
	let filteredData = [...mockDistributions];

	// Apply filters
	if (params.cname) {
		filteredData = filteredData.filter(
			(d) =>
				d.cname.toLowerCase().includes(params.cname!.toLowerCase()) ||
				d.label.toLowerCase().includes(params.cname!.toLowerCase())
		);
	}

	if (params.status) {
		filteredData = filteredData.filter((d) => d.status === params.status);
	}

	// Apply date range filter
	if (params.created_from || params.created_to) {
		filteredData = filteredData.filter((d) => {
			const createdDate = new Date(d.created_at);
			const fromDate = params.created_from
				? new Date(params.created_from)
				: null;
			const toDate = params.created_to ? new Date(params.created_to) : null;

			if (fromDate && createdDate < fromDate) return false;
			if (toDate && createdDate > toDate) return false;
			return true;
		});
	}

	// Apply sorting
	if (params.sort) {
		const [field, direction] = params.sort.startsWith('-')
			? [params.sort.slice(1), 'desc']
			: [params.sort, 'asc'];

		filteredData.sort((a, b) => {
			let aVal: any = a[field as keyof Distribution];
			let bVal: any = b[field as keyof Distribution];

			if (field === 'created_at') {
				aVal = new Date(aVal);
				bVal = new Date(bVal);
			}

			if (direction === 'desc') {
				return bVal > aVal ? 1 : -1;
			}
			return aVal > bVal ? 1 : -1;
		});
	}

	// Apply pagination
	const total = filteredData.length;
	const startIndex = (params.page - 1) * params.limit;
	const endIndex = startIndex + params.limit;
	const paginatedData = filteredData.slice(startIndex, endIndex);

	return {
		data: paginatedData,
		meta: {
			page: params.page,
			limit: params.limit,
			total,
		},
	};
}
