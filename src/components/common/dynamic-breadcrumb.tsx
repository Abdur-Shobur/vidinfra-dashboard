import React from 'react';
import {
	Breadcrumb,
	BreadcrumbItem,
	BreadcrumbLink,
	BreadcrumbList,
	BreadcrumbPage,
	BreadcrumbSeparator,
} from '../ui/breadcrumb';

export type Crumb = {
	name: string;
	path?: string;
};

export type BreadcrumbProps = {
	items: Crumb[];
	className?: string;
};

export function DynamicBreadcrumb({ items, className }: BreadcrumbProps) {
	if (!items || items.length === 0) {
		return null;
	}

	return (
		<Breadcrumb className={className}>
			<BreadcrumbList>
				{items.map((item, index) => {
					const isLast = index === items.length - 1;

					return (
						<React.Fragment key={index}>
							<BreadcrumbItem className="hidden md:block">
								{item.path && !isLast ? (
									<BreadcrumbLink
										className="text-tertiary font-normal text-base"
										href={item.path}
									>
										{item.name}
									</BreadcrumbLink>
								) : (
									<BreadcrumbPage className="text-primary font-medium text-base">
										{item.name}
									</BreadcrumbPage>
								)}
							</BreadcrumbItem>
							{!isLast && <BreadcrumbSeparator className="hidden md:block" />}
						</React.Fragment>
					);
				})}
			</BreadcrumbList>
		</Breadcrumb>
	);
}
