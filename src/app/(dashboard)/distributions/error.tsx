'use client';

export default function Error({
	error,
	reset,
}: {
	error: Error;
	reset: () => void;
}) {
	return (
		<div className="p-6">
			<h2 className="text-lg font-semibold">Something went wrong</h2>
			<p className="text-sm text-muted-foreground">{error.message}</p>
			<button
				className="mt-4 px-3 py-2 rounded bg-primary text-primary-foreground"
				onClick={reset}
			>
				Try again
			</button>
		</div>
	);
}
