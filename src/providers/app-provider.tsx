import { NuqsAdapter } from 'nuqs/adapters/next/app';
import { ReactQueryProvider } from './react-query-provider';

export function AppProvider({ children }: { children: React.ReactNode }) {
	return (
		<ReactQueryProvider>
			<NuqsAdapter>{children}</NuqsAdapter>
		</ReactQueryProvider>
	);
}
