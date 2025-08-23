'use client';

import { Frame, Map, PieChart } from 'lucide-react';
import * as React from 'react';

import { NavProjects } from '@/components/nav-projects';
import { ThemeToggle } from '@/components/theme-toggle';
import {
	Sidebar,
	SidebarContent,
	SidebarFooter,
	SidebarHeader,
} from '@/components/ui/sidebar';

// This is sample data.
const data = {
	projects: [
		{
			name: 'Distributions',
			url: '#',
			icon: Frame,
		},
		{
			name: 'Statistics',
			url: '#',
			icon: PieChart,
		},
		{
			name: 'Prefetch',
			url: '#',
			icon: Map,
		},
		{
			name: 'Purge',
			url: '#',
			icon: Map,
		},
		{
			name: 'Certificate',
			url: '#',
			icon: Map,
		},
	],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
	return (
		<Sidebar collapsible="icon" {...props}>
			<SidebarHeader>Logo</SidebarHeader>
			<SidebarContent>
				<NavProjects projects={data.projects} />
			</SidebarContent>
			<SidebarFooter className="border-t">
				<div className="flex items-center justify-center p-2">
					<ThemeToggle />
				</div>
			</SidebarFooter>
		</Sidebar>
	);
}
