import { addDays, addHours, endOfMonth, startOfMonth } from 'date-fns';
import { useCallback, useState } from 'react';
import { DateRange } from 'react-day-picker';

export type PredefinedRange =
	| 'all-time'
	| 'last-8-hours'
	| 'last-24-hours'
	| 'last-7-days'
	| 'last-30-days'
	| 'this-month'
	| 'custom';

export function useDateRange(initialRange?: DateRange) {
	const [dateRange, setDateRange] = useState<DateRange | undefined>(
		initialRange
	);
	const [selectedPredefinedRange, setSelectedPredefinedRange] =
		useState<PredefinedRange>('custom');

	const setPredefinedRange = useCallback((range: PredefinedRange) => {
		setSelectedPredefinedRange(range);

		if (range === 'custom') {
			return;
		}

		const now = new Date();
		let newDateRange: DateRange | undefined;

		switch (range) {
			case 'all-time':
				newDateRange = {
					from: new Date(2020, 0, 1),
					to: now,
				};
				break;
			case 'last-8-hours':
				newDateRange = {
					from: addHours(now, -8),
					to: now,
				};
				break;
			case 'last-24-hours':
				newDateRange = {
					from: addDays(now, -1),
					to: now,
				};
				break;
			case 'last-7-days':
				newDateRange = {
					from: addDays(now, -7),
					to: now,
				};
				break;
			case 'last-30-days':
				newDateRange = {
					from: addDays(now, -30),
					to: now,
				};
				break;
			case 'this-month':
				newDateRange = {
					from: startOfMonth(now),
					to: endOfMonth(now),
				};
				break;
		}

		if (newDateRange) {
			setDateRange(newDateRange);
		}
	}, []);

	const updateDateRange = useCallback((range: DateRange | undefined) => {
		setDateRange(range);
		setSelectedPredefinedRange('custom');
	}, []);

	const clearDateRange = useCallback(() => {
		setDateRange(undefined);
		setSelectedPredefinedRange('custom');
	}, []);

	return {
		dateRange,
		selectedPredefinedRange,
		setDateRange: updateDateRange,
		setPredefinedRange,
		clearDateRange,
	};
}
