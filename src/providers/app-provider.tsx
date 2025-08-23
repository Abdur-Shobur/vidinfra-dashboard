import { NuqsAdapter } from 'nuqs/adapters/next/app';
import { ReactQueryProvider } from './react-query-provider';
import { ThemeProvider } from './theme-provider';

export function AppProvider({ children }: { children: React.ReactNode }) {
	return (
		<ThemeProvider defaultTheme="system" storageKey="vidinfra-theme">
			<ReactQueryProvider>
				<NuqsAdapter>{children}</NuqsAdapter>
			</ReactQueryProvider>
		</ThemeProvider>
	);
}
