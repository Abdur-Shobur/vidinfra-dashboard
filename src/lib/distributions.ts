import type { DistributionsResponse } from '@/types/cdn';
import { api } from './axios';

export async function fetchDistributions(params: {
	page: number;
	limit: number;
	cname?: string;
	status?: string;
	created_from?: string;
	created_to?: string;
	sort?: string;
	name?: string;
	domain?: string;
	domain_type?: string;
	cache_strategy?: string;
	enable_ssl?: string;
	is_http2?: string;
	is_http3?: string;
}): Promise<DistributionsResponse> {
	const search = new URLSearchParams();
	search.set('page', String(params.page));
	search.set('limit', String(params.limit));

	// Add filters
	if (params.cname) search.set('filter[cname][like]', params.cname);
	if (params.name) search.set('filter[name][like]', params.name);
	if (params.domain) search.set('filter[domain][like]', params.domain);
	if (params.status) search.set('filter[status][in]', params.status);
	if (params.domain_type)
		search.set('filter[domain_type][eq]', params.domain_type);
	if (params.cache_strategy)
		search.set('filter[cache_strategy][eq]', params.cache_strategy);
	if (params.enable_ssl)
		search.set('filter[enable_ssl][eq]', params.enable_ssl);
	if (params.is_http2) search.set('filter[is_http2][eq]', params.is_http2);
	if (params.is_http3) search.set('filter[is_http3][eq]', params.is_http3);

	if (params.created_from || params.created_to) {
		const from = params.created_from ?? '';
		const to = params.created_to ?? '';
		search.set('filter[created_at][between]', `${from},${to}`);
	}
	if (params.sort) search.set('sort', params.sort);

	const { data } = await api.get<DistributionsResponse>(
		`/distributions?${search.toString()}`
	);
	return data;
}
