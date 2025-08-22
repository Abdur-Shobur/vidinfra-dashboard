export type DistributionStatus = 'active' | 'inactive' | 'pending';

export interface Distribution {
	id: string;
	label: string;
	cname: string;
	origin: string;
	status: DistributionStatus;
	created_at: string; // ISO date
}

export interface DistributionsResponse {
	data: Distribution[];
	meta?: {
		page: number;
		limit: number;
		total: number;
	};
}
