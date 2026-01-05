import type { DistributionsResponse, Distribution } from '@/types/cdn';

// Generate dummy distributions data
function generateDummyDistributions(): Distribution[] {
	const statuses = ['active', 'provisioning', 'disabled'];
	const domainTypes = ['cname', 'apex', 'subdomain'];
	const cacheStrategies = ['aggressive', 'balanced', 'conservative'];
	const organizations = ['org-001', 'org-002', 'org-003', 'org-004', 'org-005'];
	
	const distributions: Distribution[] = [];
	const baseDate = new Date('2024-01-01');
	
	// Generate 150+ dummy distributions
	for (let i = 1; i <= 150; i++) {
		const randomDays = Math.floor(Math.random() * 365);
		const createdAt = new Date(baseDate);
		createdAt.setDate(createdAt.getDate() + randomDays);
		const updatedAt = new Date(createdAt);
		updatedAt.setDate(updatedAt.getDate() + Math.floor(Math.random() * 30));
		
		const status = statuses[Math.floor(Math.random() * statuses.length)];
		const domainType = domainTypes[Math.floor(Math.random() * domainTypes.length)];
		const cacheStrategy = cacheStrategies[Math.floor(Math.random() * cacheStrategies.length)];
		const orgId = organizations[Math.floor(Math.random() * organizations.length)];
		
		const name = `distribution-${i.toString().padStart(3, '0')}`;
		const cname = `cdn-${i}.example.com`;
		const domain = `example${i % 10}.com`;
		
		distributions.push({
			id: `dist-${i.toString().padStart(6, '0')}`,
			name,
			cname,
			domain,
			acme_challenge_cname: `_acme-challenge.${cname}`,
			acme_challenge_domain: `_acme-challenge.${domain}`,
			description: `CDN distribution for ${name} - ${i % 3 === 0 ? 'Production' : i % 3 === 1 ? 'Staging' : 'Development'} environment`,
			status,
			domain_type: domainType,
			cache_strategy: cacheStrategy,
			organization_id: orgId,
			created_at: createdAt.toISOString(),
			updated_at: updatedAt.toISOString(),
			is_acme_challenge_valid: Math.random() > 0.3,
			enable_ssl: Math.random() > 0.2,
			le_issue: Math.random() > 0.8,
			is_redirect_http_to_https: Math.random() > 0.3,
			is_http2: Math.random() > 0.1,
			is_http3: Math.random() > 0.4,
			is_cname_valid: Math.random() > 0.2,
		});
	}
	
	return distributions;
}

// Store generated data
let allDummyData: Distribution[] = generateDummyDistributions();

// Dummy fetch function that mimics the API
export async function fetchDistributionsDummy(params: {
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
	// Simulate API delay
	await new Promise((resolve) => setTimeout(resolve, 300));
	
	let filtered = [...allDummyData];
	
	// Apply filters
	if (params.cname) {
		const searchTerm = params.cname.toLowerCase();
		filtered = filtered.filter((d) =>
			d.cname.toLowerCase().includes(searchTerm)
		);
	}
	
	if (params.name) {
		const searchTerm = params.name.toLowerCase();
		filtered = filtered.filter((d) =>
			d.name.toLowerCase().includes(searchTerm)
		);
	}
	
	if (params.domain) {
		const searchTerm = params.domain.toLowerCase();
		filtered = filtered.filter((d) =>
			d.domain.toLowerCase().includes(searchTerm)
		);
	}
	
	if (params.status) {
		const statuses = params.status.split(',');
		filtered = filtered.filter((d) => statuses.includes(d.status));
	}
	
	if (params.domain_type) {
		filtered = filtered.filter((d) => d.domain_type === params.domain_type);
	}
	
	if (params.cache_strategy) {
		filtered = filtered.filter(
			(d) => d.cache_strategy === params.cache_strategy
		);
	}
	
	if (params.enable_ssl !== undefined && params.enable_ssl !== '') {
		const enableSsl = params.enable_ssl === 'true';
		filtered = filtered.filter((d) => d.enable_ssl === enableSsl);
	}
	
	if (params.is_http2 !== undefined && params.is_http2 !== '') {
		const isHttp2 = params.is_http2 === 'true';
		filtered = filtered.filter((d) => d.is_http2 === isHttp2);
	}
	
	if (params.is_http3 !== undefined && params.is_http3 !== '') {
		const isHttp3 = params.is_http3 === 'true';
		filtered = filtered.filter((d) => d.is_http3 === isHttp3);
	}
	
	// Date range filter
	if (params.created_from || params.created_to) {
		filtered = filtered.filter((d) => {
			const createdDate = new Date(d.created_at);
			if (params.created_from) {
				const fromDate = new Date(params.created_from);
				if (createdDate < fromDate) return false;
			}
			if (params.created_to) {
				const toDate = new Date(params.created_to);
				toDate.setHours(23, 59, 59, 999); // Include the entire day
				if (createdDate > toDate) return false;
			}
			return true;
		});
	}
	
	// Apply sorting
	if (params.sort) {
		const sortField = params.sort.startsWith('-')
			? params.sort.slice(1)
			: params.sort;
		const isDesc = params.sort.startsWith('-');
		
		filtered.sort((a, b) => {
			let aVal: any = a[sortField as keyof Distribution];
			let bVal: any = b[sortField as keyof Distribution];
			
			// Handle date fields
			if (sortField === 'created_at' || sortField === 'updated_at') {
				aVal = new Date(aVal).getTime();
				bVal = new Date(bVal).getTime();
			}
			
			// Handle string comparison
			if (typeof aVal === 'string' && typeof bVal === 'string') {
				aVal = aVal.toLowerCase();
				bVal = bVal.toLowerCase();
			}
			
			if (aVal < bVal) return isDesc ? 1 : -1;
			if (aVal > bVal) return isDesc ? -1 : 1;
			return 0;
		});
	} else {
		// Default sort by created_at descending
		filtered.sort((a, b) => {
			const aDate = new Date(a.created_at).getTime();
			const bDate = new Date(b.created_at).getTime();
			return bDate - aDate;
		});
	}
	
	// Apply pagination
	const page = params.page || 1;
	const limit = params.limit || 10;
	const startIndex = (page - 1) * limit;
	const endIndex = startIndex + limit;
	const paginated = filtered.slice(startIndex, endIndex);
	
	const total = filtered.length;
	const totalPages = Math.ceil(total / limit);
	
	return {
		data: paginated,
		meta: {
			links: {
				self: `/distributions?page=${page}&limit=${limit}`,
				first: `/distributions?page=1&limit=${limit}`,
				next:
					page < totalPages
						? `/distributions?page=${page + 1}&limit=${limit}`
						: `/distributions?page=${totalPages}&limit=${limit}`,
				last: `/distributions?page=${totalPages}&limit=${limit}`,
			},
			pagination: {
				page,
				page_size: limit,
				total,
				total_pages: totalPages,
			},
		},
		success: true,
		message: 'Distributions fetched successfully',
	};
}
