import DistributionsPage from './page.client';

export default function Page({
	searchParams,
}: {
	searchParams: Record<string, string | string[] | undefined>;
}) {
	// Pass-through: the client component (CSR) will bind to URL with nuqs
	return <DistributionsPage initialSearchParams={searchParams} />;
}
