'use client';

import { format } from 'date-fns';
import { CalendarIcon } from 'lucide-react';
import * as React from 'react';
import { DateRange } from 'react-day-picker';

import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from '@/components/ui/popover';
import { PredefinedRange, useDateRange } from '@/hooks/use-date-range';
import { cn } from '@/lib/utils';

interface DateRangePickerProps {
	dateRange?: DateRange;
	onDateRangeChange?: (dateRange: DateRange | undefined) => void;
	placeholder?: string;
	className?: string;
}

const predefinedRanges = [
	{ label: 'All Time', value: 'all-time' as PredefinedRange },
	{ label: 'Last 8 Hours', value: 'last-8-hours' as PredefinedRange },
	{ label: 'Last 24 Hours', value: 'last-24-hours' as PredefinedRange },
	{ label: 'Last 7 Days', value: 'last-7-days' as PredefinedRange },
	{ label: 'Last 30 Days', value: 'last-30-days' as PredefinedRange },
	{ label: 'This Month', value: 'this-month' as PredefinedRange },
	{ label: 'Custom Date Range', value: 'custom' as PredefinedRange },
];

export function DateRangePicker({
	dateRange,
	onDateRangeChange,
	placeholder = 'Pick a date range',
	className,
}: DateRangePickerProps) {
	const [isOpen, setIsOpen] = React.useState(false);
	const [startTime, setStartTime] = React.useState('00:00');
	const [endTime, setEndTime] = React.useState('00:00');

	const {
		dateRange: internalDateRange,
		selectedPredefinedRange,
		setDateRange: setInternalDateRange,
		setPredefinedRange,
	} = useDateRange(dateRange);

	// Sync external dateRange with internal state
	React.useEffect(() => {
		if (dateRange !== internalDateRange) {
			setInternalDateRange(dateRange);
		}
	}, [dateRange, internalDateRange, setInternalDateRange]);

	const handlePredefinedRangeSelect = (rangeValue: PredefinedRange) => {
		setPredefinedRange(rangeValue);

		if (rangeValue === 'custom') {
			return;
		}

		// The hook will handle the date range calculation
		// We need to notify the parent component
		const now = new Date();
		let newDateRange: DateRange | undefined;

		switch (rangeValue) {
			case 'all-time':
				newDateRange = {
					from: new Date(2020, 0, 1),
					to: now,
				};
				break;
			case 'last-8-hours':
				newDateRange = {
					from: new Date(now.getTime() - 8 * 60 * 60 * 1000),
					to: now,
				};
				break;
			case 'last-24-hours':
				newDateRange = {
					from: new Date(now.getTime() - 24 * 60 * 60 * 1000),
					to: now,
				};
				break;
			case 'last-7-days':
				newDateRange = {
					from: new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000),
					to: now,
				};
				break;
			case 'last-30-days':
				newDateRange = {
					from: new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000),
					to: now,
				};
				break;
			case 'this-month':
				const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
				const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);
				newDateRange = {
					from: startOfMonth,
					to: endOfMonth,
				};
				break;
		}

		if (newDateRange) {
			onDateRangeChange?.(newDateRange);
		}
	};

	const handleApplyFilter = () => {
		if (internalDateRange?.from && internalDateRange?.to) {
			// Apply time to the date range
			const fromDate = new Date(internalDateRange.from);
			const toDate = new Date(internalDateRange.to);

			const [startHour, startMinute] = startTime.split(':').map(Number);
			const [endHour, endMinute] = endTime.split(':').map(Number);

			fromDate.setHours(startHour, startMinute, 0, 0);
			toDate.setHours(endHour, endMinute, 0, 0);

			onDateRangeChange?.({
				from: fromDate,
				to: toDate,
			});
		}
		setIsOpen(false);
	};

	const handleCurrentTime = () => {
		const now = new Date();
		const currentTime = format(now, 'HH:mm');
		setEndTime(currentTime);
	};

	const formatDisplayText = () => {
		if (!internalDateRange?.from) return placeholder;

		const fromDate = format(internalDateRange.from, 'MMM dd, yyyy');
		const toDate = internalDateRange.to
			? format(internalDateRange.to, 'MMM dd, yyyy')
			: '';

		if (!toDate) return fromDate;
		return `${fromDate} - ${toDate}`;
	};

	return (
		<Popover open={isOpen} onOpenChange={setIsOpen}>
			<PopoverTrigger asChild>
				<Button
					variant="outline"
					className={cn(
						'w-full justify-start text-left font-normal',
						!dateRange && 'text-muted-foreground',
						className
					)}
				>
					<CalendarIcon className="mr-2 h-4 w-4" />
					{formatDisplayText()}
				</Button>
			</PopoverTrigger>
			<PopoverContent
				className="w-auto p-0"
				align="start"
				style={{ minWidth: '600px' }}
			>
				<div className="flex">
					{/* Left sidebar with predefined ranges */}
					<div className="w-48 border-r bg-muted/30 p-3">
						<div className="space-y-1">
							{predefinedRanges.map((range) => (
								<button
									key={range.value}
									onClick={() => handlePredefinedRangeSelect(range.value)}
									className={cn(
										'w-full text-left px-3 py-2 text-sm rounded-md transition-colors',
										selectedPredefinedRange === range.value
											? 'bg-accent text-accent-foreground'
											: 'hover:bg-accent/50'
									)}
								>
									{range.label}
								</button>
							))}
						</div>
					</div>

					{/* Right content area with calendars and time selection */}
					<div className="p-4">
						<div className="space-y-2">
							<Label className="text-sm font-medium">Select Date Range</Label>
							<Calendar
								mode="range"
								selected={internalDateRange}
								onSelect={(range) => {
									setInternalDateRange(range);
									onDateRangeChange?.(range);
								}}
								numberOfMonths={2}
								defaultMonth={internalDateRange?.from}
								className="rounded-md border"
								showOutsideDays={false}
							/>
						</div>

						{/* Time Selection */}
						<div className="flex gap-4 mt-4">
							<div className="space-y-2">
								<Label className="text-sm font-medium">Start Time</Label>
								<div className="flex items-center gap-2">
									<Input
										type="time"
										value={startTime}
										onChange={(e) => setStartTime(e.target.value)}
										className="w-32"
									/>
								</div>
							</div>
							<div className="space-y-2">
								<Label className="text-sm font-medium">End Time</Label>
								<div className="flex items-center gap-2">
									<Input
										type="time"
										value={endTime}
										onChange={(e) => setEndTime(e.target.value)}
										className="w-32"
									/>
									<button
										onClick={handleCurrentTime}
										className="text-sm text-primary hover:underline"
									>
										Current Time
									</button>
								</div>
							</div>
						</div>

						{/* Action Buttons */}
						<div className="flex justify-end gap-2 mt-6">
							<Button variant="outline" onClick={() => setIsOpen(false)}>
								Cancel
							</Button>
							<Button
								onClick={handleApplyFilter}
								className="bg-primary text-primary-foreground hover:bg-primary/90"
							>
								Apply Filter
							</Button>
						</div>
					</div>
				</div>
			</PopoverContent>
		</Popover>
	);
}
