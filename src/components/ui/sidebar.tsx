'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
	ArrowLeft,
	BarChart3,
	Clock,
	FileText,
	Headphones,
	MessageCircle,
	Network,
	Shield,
	Square,
} from 'lucide-react';

interface SidebarItem {
	href: string;
	label: string;
	icon: React.ComponentType<{ className?: string }>;
}

const sidebarItems: SidebarItem[] = [
	{
		href: '/distributions',
		label: 'Distributions',
		icon: Network,
	},
	{
		href: '/statistics',
		label: 'Statistics',
		icon: BarChart3,
	},
	{
		href: '/prefetch',
		label: 'Prefetch',
		icon: Clock,
	},
	{
		href: '/purge',
		label: 'Purge',
		icon: Shield,
	},
	{
		href: '/certificate',
		label: 'Certificate',
		icon: FileText,
	},
];

const supportItems: SidebarItem[] = [
	{
		href: '/support',
		label: 'Support',
		icon: Headphones,
	},
	{
		href: '/feedback',
		label: 'Feedback',
		icon: MessageCircle,
	},
];

export function Sidebar() {
	const pathname = usePathname();

	return (
		<div className="flex h-full w-64 flex-col bg-gray-50 border-r">
			{/* Header */}
			<div className="flex items-center gap-2 p-4 border-b">
				<Button variant="ghost" size="sm" className="p-1">
					<ArrowLeft className="h-4 w-4" />
				</Button>
				<span className="font-medium">CDN</span>
			</div>

			{/* Logo */}
			<div className="p-4">
				<div className="flex items-center gap-2">
					<div className="w-8 h-8 bg-red-500 rounded flex items-center justify-center">
						<Square className="h-4 w-4 text-white" />
					</div>
					<span className="font-semibold text-lg">Vidinfra</span>
				</div>
			</div>

			{/* Navigation */}
			<div className="flex-1 px-4">
				<div className="space-y-1">
					<h3 className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-3">
						General
					</h3>
					{sidebarItems.map((item) => {
						const isActive = pathname === item.href;
						return (
							<Link key={item.href} href={item.href}>
								<Button
									variant="ghost"
									className={cn(
										'w-full justify-start gap-3 h-10',
										isActive
											? 'bg-gray-200 text-gray-900'
											: 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
									)}
								>
									<item.icon className="h-4 w-4" />
									{item.label}
								</Button>
							</Link>
						);
					})}
				</div>

				{/* Support Section */}
				<div className="mt-8 space-y-1">
					{supportItems.map((item) => {
						const isActive = pathname === item.href;
						return (
							<Link key={item.href} href={item.href}>
								<Button
									variant="ghost"
									className={cn(
										'w-full justify-start gap-3 h-10',
										isActive
											? 'bg-gray-200 text-gray-900'
											: 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
									)}
								>
									<item.icon className="h-4 w-4" />
									{item.label}
								</Button>
							</Link>
						);
					})}
				</div>
			</div>
		</div>
	);
}
