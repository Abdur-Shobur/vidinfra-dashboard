import { Card, CardContent } from '../ui/card';

export function PageWrap({
	children,
	header,
}: {
	children: React.ReactNode;
	header?: React.ReactNode;
}) {
	return (
		<Card className="rounded-xl md:m-5 mt-0 pb-0.5 bg-secondary gap-0 pt-4">
			{/* if card header is provided  */}
			{header && header}

			{/* if children is provided  */}
			{children && (
				<CardContent className="p-0.5">
					<Card className="py-6">
						<CardContent className="px-2 md:px-5">{children}</CardContent>
					</Card>
				</CardContent>
			)}
		</Card>
	);
}
