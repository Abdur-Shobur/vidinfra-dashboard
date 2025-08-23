import { parseAsInteger, parseAsString } from 'nuqs';

export const pageParam = parseAsInteger
	.withDefault(1)
	.withOptions({ shallow: false });
export const limitParam = parseAsInteger.withDefault(15);
export const cnameParam = parseAsString.withDefault('');
export const statusParam = parseAsString.withDefault('');
export const createdFromParam = parseAsString.withDefault(''); // YYYY-MM-DD
export const createdToParam = parseAsString.withDefault(''); // YYYY-MM-DD
export const sortParam = parseAsString.withDefault('-created_at');

// Additional filter parameters
export const nameParam = parseAsString.withDefault('');
export const domainParam = parseAsString.withDefault('');
export const domainTypeParam = parseAsString.withDefault('');
export const cacheStrategyParam = parseAsString.withDefault('');
export const enableSslParam = parseAsString.withDefault('');
export const isHttp2Param = parseAsString.withDefault('');
export const isHttp3Param = parseAsString.withDefault('');

export const paramsConfig = {
	page: pageParam,
	limit: limitParam,
	cname: cnameParam,
	status: statusParam,
	created_from: createdFromParam,
	created_to: createdToParam,
	sort: sortParam,
	// Additional filters
	name: nameParam,
	domain: domainParam,
	domain_type: domainTypeParam,
	cache_strategy: cacheStrategyParam,
	enable_ssl: enableSslParam,
	is_http2: isHttp2Param,
	is_http3: isHttp3Param,
};
