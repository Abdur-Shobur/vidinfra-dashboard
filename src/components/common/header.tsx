import { Separator } from '../ui/separator';
import { SidebarTrigger } from '../ui/sidebar';
import { DynamicBreadcrumb, type Crumb } from './dynamic-breadcrumb';

export type HeaderProps = {
	breadcrumbItems?: Crumb[];
	children?: React.ReactNode;
};

export function Header({ breadcrumbItems, children }: HeaderProps) {
	return (
		<header className="flex shrink-0  pt-3 pb-5 gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-auto justify-between px-5">
			<div>
				<div className="flex items-center gap-2">
					<SidebarTrigger className="-ml-1.5" />
					<Separator
						orientation="vertical"
						className="mr-2 data-[orientation=vertical]:h-4"
					/>
					{breadcrumbItems && <DynamicBreadcrumb items={breadcrumbItems} />}
				</div>
			</div>
			{children && <div>{children}</div>}
		</header>
	);
}
