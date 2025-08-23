export type DistributionStatus = 'active' | 'inactive' | 'pending';

export interface Distribution {
	created_at: string;
	description: string;
	updated_at: string;
	domain_type: string;
	name: string;
	cname: string;
	acme_challenge_cname: string;
	acme_challenge_domain: string;
	domain: string;
	status: string;
	cache_strategy: string;
	organization_id: string;
	id: string;
	is_acme_challenge_valid: boolean;
	enable_ssl: boolean;
	le_issue: boolean;
	is_redirect_http_to_https: boolean;
	is_http2: boolean;
	is_cname_valid: boolean;
	is_http3: boolean;
}

export interface DistributionsResponse {
	data: Distribution[];
	meta: {
		links: {
			self: string;
			first: string;
			next: string;
			last: string;
		};
		pagination: {
			page: number;
			page_size: number;
			total: number;
			total_pages: number;
		};
	};
	success: boolean;
	message: string;
}
