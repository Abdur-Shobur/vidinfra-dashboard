'use client';

import { format } from 'date-fns';
import * as React from 'react';
import { DateRange } from 'react-day-picker';

import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from './card';
import { DateRangePicker } from './date-range-picker';

export function DateRangePickerExample() {
	const [dateRange, setDateRange] = React.useState<DateRange | undefined>();

	return (
		<div className="p-6 space-y-6">
			<div className="space-y-2">
				<h2 className="text-2xl font-bold">Date Range Picker Example</h2>
				<p className="text-muted-foreground">
					Select a date range using predefined options or custom selection
				</p>
			</div>

			<Card>
				<CardHeader>
					<CardTitle>Date Range Selection</CardTitle>
					<CardDescription>
						Choose from predefined ranges or select custom dates and times
					</CardDescription>
				</CardHeader>
				<CardContent className="space-y-4">
					<DateRangePicker
						dateRange={dateRange}
						onDateRangeChange={setDateRange}
						placeholder="Select date range..."
					/>

					{dateRange && (
						<div className="mt-4 p-4 bg-muted rounded-lg">
							<h3 className="font-medium mb-2">Selected Range:</h3>
							<div className="text-sm space-y-1">
								<p>
									<strong>From:</strong>{' '}
									{dateRange.from
										? format(dateRange.from, 'PPP p')
										: 'Not selected'}
								</p>
								<p>
									<strong>To:</strong>{' '}
									{dateRange.to
										? format(dateRange.to, 'PPP p')
										: 'Not selected'}
								</p>
							</div>
						</div>
					)}
				</CardContent>
			</Card>
		</div>
	);
}
