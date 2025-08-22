export default function Loading() {
	return (
		<div className="p-6 space-y-3">
			<div className="h-8 w-40 bg-muted animate-pulse rounded" />
			<div className="h-10 w-full bg-muted animate-pulse rounded" />
			<div className="h-64 w-full bg-muted animate-pulse rounded" />
		</div>
	);
}
