/* eslint-disable max-lines */
'use client';

import { cn } from '@/lib/utils';

import {
	CalendarIcon,
	CheckIcon,
	ChevronDownIcon,
	ChevronUpIcon,
} from 'lucide-react';
import { type FC, JSX, useEffect, useRef, useState } from 'react';
import { Button } from '../ui/button';
import { Calendar } from '../ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '../ui/select';

export interface DateRangePickerProps {
	/** Click handler for applying the updates from DateRangePicker. */
	onUpdate?: (values: { range: DateRange; rangeCompare?: DateRange }) => void;
	/** Initial value for start date */
	initialDateFrom?: Date | string;
	/** Initial value for end date */
	initialDateTo?: Date | string;
	/** Initial value for start date for compare */
	initialCompareFrom?: Date | string;
	/** Initial value for end date for compare */
	initialCompareTo?: Date | string;
	/** Alignment of popover */
	align?: 'start' | 'center' | 'end';
	/** Option for locale */
	locale?: string;
	/** Option for showing compare feature */
	showCompare?: boolean;
}

const formatDate = (date: Date, locale: string = 'en-us'): string => {
	return date.toLocaleDateString(locale, {
		month: 'short',
		day: 'numeric',
		year: 'numeric',
	});
};

const getDateAdjustedForTimezone = (dateInput: Date | string): Date => {
	if (typeof dateInput === 'string') {
		// Split the date string to get year, month, and day parts
		const parts = dateInput.split('-').map((part) => parseInt(part, 10));
		// Create a new Date object using the local timezone
		// Note: Month is 0-indexed, so subtract 1 from the month part
		const date = new Date(parts[0], parts[1] - 1, parts[2]);
		return date;
	} else {
		// If dateInput is already a Date object, return it directly
		return dateInput;
	}
};

interface DateRange {
	from: Date;
	to: Date | undefined;
}

interface Preset {
	name: string;
	label: string;
}

// Define presets
const PRESETS: Preset[] = [
	{ name: 'all-time', label: 'All Time' },
	{ name: 'last-8-hours', label: 'Last 8 Hours' },
	{ name: 'last-24-hours', label: 'Last 24 Hours' },
	{ name: 'last-7-days', label: 'Last 7 Days' },
	{ name: 'last-30-days', label: 'Last 30 Days' },
	{ name: 'this-month', label: 'This Month' },
	{ name: 'custom', label: 'Custom Date Range' },
];
/** The DateRangePicker component allows a user to select a range of dates */
export const DateRangePicker: FC<DateRangePickerProps> = ({
	initialDateFrom = new Date(new Date().setHours(0, 0, 0, 0)),
	initialDateTo,
	initialCompareFrom,
	initialCompareTo,
	onUpdate,
	align = 'end',
	locale = 'en-US',
}): JSX.Element => {
	const [isOpen, setIsOpen] = useState(false);

	const [range, setRange] = useState<DateRange>({
		from: getDateAdjustedForTimezone(initialDateFrom),
		to: initialDateTo
			? getDateAdjustedForTimezone(initialDateTo)
			: getDateAdjustedForTimezone(initialDateFrom),
	});
	const [rangeCompare, setRangeCompare] = useState<DateRange | undefined>(
		initialCompareFrom
			? {
					from: new Date(new Date(initialCompareFrom).setHours(0, 0, 0, 0)),
					to: initialCompareTo
						? new Date(new Date(initialCompareTo).setHours(0, 0, 0, 0))
						: new Date(new Date(initialCompareFrom).setHours(0, 0, 0, 0)),
			  }
			: undefined
	);

	// Refs to store the values of range and rangeCompare when the date picker is opened
	const openedRangeRef = useRef<DateRange | undefined>(undefined);
	const openedRangeCompareRef = useRef<DateRange | undefined>(undefined);

	const [selectedPreset, setSelectedPreset] = useState<string | undefined>(
		undefined
	);

	const [isSmallScreen, setIsSmallScreen] = useState(
		typeof window !== 'undefined' ? window.innerWidth < 960 : false
	);

	useEffect(() => {
		const handleResize = (): void => {
			setIsSmallScreen(window.innerWidth < 960);
		};

		window.addEventListener('resize', handleResize);

		// Clean up event listener on unmount
		return () => {
			window.removeEventListener('resize', handleResize);
		};
	}, []);

	const getPresetRange = (presetName: string): DateRange => {
		const preset = PRESETS.find(({ name }) => name === presetName);
		if (!preset) throw new Error(`Unknown date range preset: ${presetName}`);
		const from = new Date();
		const to = new Date();

		switch (preset.name) {
			case 'all-time':
				// Set to a very old date for "all time"
				from.setFullYear(1970, 0, 1);
				from.setHours(0, 0, 0, 0);
				to.setHours(23, 59, 59, 999);
				break;
			case 'last-8-hours':
				from.setHours(from.getHours() - 8);
				to.setHours(23, 59, 59, 999);
				break;
			case 'last-24-hours':
				from.setDate(from.getDate() - 1);
				from.setHours(
					from.getHours(),
					from.getMinutes(),
					from.getSeconds(),
					from.getMilliseconds()
				);
				to.setHours(23, 59, 59, 999);
				break;
			case 'last-7-days':
				from.setDate(from.getDate() - 6);
				from.setHours(0, 0, 0, 0);
				to.setHours(23, 59, 59, 999);
				break;
			case 'last-30-days':
				from.setDate(from.getDate() - 29);
				from.setHours(0, 0, 0, 0);
				to.setHours(23, 59, 59, 999);
				break;
			case 'this-month':
				from.setDate(1);
				from.setHours(0, 0, 0, 0);
				to.setHours(23, 59, 59, 999);
				break;
			case 'custom':
				// For custom, return current range or default to today
				return range;
			default:
				// Default to today
				from.setHours(0, 0, 0, 0);
				to.setHours(23, 59, 59, 999);
				break;
		}

		return { from, to };
	};

	const setPreset = (preset: string): void => {
		const range = getPresetRange(preset);
		setRange(range);
		// For custom preset, don't update rangeCompare
		if (rangeCompare && preset !== 'custom') {
			const rangeCompare = {
				from: new Date(
					range.from.getFullYear() - 1,
					range.from.getMonth(),
					range.from.getDate()
				),
				to: range.to
					? new Date(
							range.to.getFullYear() - 1,
							range.to.getMonth(),
							range.to.getDate()
					  )
					: undefined,
			};
			setRangeCompare(rangeCompare);
		}
	};

	const checkPreset = (): void => {
		for (const preset of PRESETS) {
			const presetRange = getPresetRange(preset.name);

			const normalizedRangeFrom = new Date(range.from);
			normalizedRangeFrom.setHours(0, 0, 0, 0);
			const normalizedPresetFrom = new Date(
				presetRange.from.setHours(0, 0, 0, 0)
			);

			const normalizedRangeTo = new Date(range.to ?? 0);
			normalizedRangeTo.setHours(0, 0, 0, 0);
			const normalizedPresetTo = new Date(
				presetRange.to?.setHours(0, 0, 0, 0) ?? 0
			);

			if (
				normalizedRangeFrom.getTime() === normalizedPresetFrom.getTime() &&
				normalizedRangeTo.getTime() === normalizedPresetTo.getTime()
			) {
				setSelectedPreset(preset.name);
				return;
			}
		}

		setSelectedPreset(undefined);
	};

	const resetValues = (): void => {
		setRange({
			from:
				typeof initialDateFrom === 'string'
					? getDateAdjustedForTimezone(initialDateFrom)
					: initialDateFrom,
			to: initialDateTo
				? typeof initialDateTo === 'string'
					? getDateAdjustedForTimezone(initialDateTo)
					: initialDateTo
				: typeof initialDateFrom === 'string'
				? getDateAdjustedForTimezone(initialDateFrom)
				: initialDateFrom,
		});
		setRangeCompare(
			initialCompareFrom
				? {
						from:
							typeof initialCompareFrom === 'string'
								? getDateAdjustedForTimezone(initialCompareFrom)
								: initialCompareFrom,
						to: initialCompareTo
							? typeof initialCompareTo === 'string'
								? getDateAdjustedForTimezone(initialCompareTo)
								: initialCompareTo
							: typeof initialCompareFrom === 'string'
							? getDateAdjustedForTimezone(initialCompareFrom)
							: initialCompareFrom,
				  }
				: undefined
		);
	};

	useEffect(() => {
		checkPreset();
	}, [range]);

	const PresetButton = ({
		preset,
		label,
		isSelected,
	}: {
		preset: string;
		label: string;
		isSelected: boolean;
	}): JSX.Element => (
		<Button
			className={cn(
				isSelected && 'pointer-events-none',
				'justify-start',
				'w-full'
			)}
			variant="ghost"
			onClick={() => {
				setPreset(preset);
			}}
		>
			<>
				{label}
				<span
					className={cn('pr-2 opacity-0 ml-auto', isSelected && 'opacity-70')}
				>
					<CheckIcon width={18} height={18} />
				</span>
			</>
		</Button>
	);

	// Helper function to check if two date ranges are equal
	const areRangesEqual = (a?: DateRange, b?: DateRange): boolean => {
		if (!a || !b) return a === b; // If either is undefined, return true if both are undefined
		return (
			a.from.getTime() === b.from.getTime() &&
			(!a.to || !b.to || a.to.getTime() === b.to.getTime())
		);
	};

	useEffect(() => {
		if (isOpen) {
			openedRangeRef.current = range;
			openedRangeCompareRef.current = rangeCompare;
		}
	}, [isOpen]);

	return (
		<Popover
			modal={true}
			open={isOpen}
			onOpenChange={(open: boolean) => {
				if (!open) {
					resetValues();
				}
				setIsOpen(open);
			}}
		>
			<PopoverTrigger asChild>
				<Button size={'lg'} variant="outline" className="gap-2">
					<CalendarIcon className="h-4 w-4" />
					{initialDateTo ? (
						<span className="text-sm">
							{`${formatDate(range.from, locale)}${
								range.to != null ? ' - ' + formatDate(range.to, locale) : ''
							}`}
						</span>
					) : (
						<span className="font-medium">Created At</span>
					)}
					<div className="pl-1 opacity-60 -mr-2 scale-125">
						{isOpen ? (
							<ChevronUpIcon width={24} />
						) : (
							<ChevronDownIcon width={24} />
						)}
					</div>
				</Button>
			</PopoverTrigger>
			<PopoverContent align={align} className="w-auto">
				<div className="flex py-2 flex-row-reverse">
					<div className="flex">
						<div className="flex flex-col">
							{isSmallScreen && (
								<Select
									defaultValue={selectedPreset}
									onValueChange={(value) => {
										setPreset(value);
									}}
								>
									<SelectTrigger className="w-[180px] mx-auto mb-2">
										<SelectValue placeholder="Select..." />
									</SelectTrigger>
									<SelectContent>
										{PRESETS.map((preset) => (
											<SelectItem key={preset.name} value={preset.name}>
												{preset.label}
											</SelectItem>
										))}
									</SelectContent>
								</Select>
							)}
							<div>
								<Calendar
									mode="range"
									onSelect={(value: { from?: Date; to?: Date } | undefined) => {
										if (value?.from != null) {
											setRange({ from: value.from, to: value?.to });
										}
									}}
									selected={range}
									numberOfMonths={isSmallScreen ? 1 : 2}
									defaultMonth={
										new Date(
											new Date().setMonth(
												new Date().getMonth() - (isSmallScreen ? 0 : 1)
											)
										)
									}
								/>
							</div>
						</div>
					</div>
					{!isSmallScreen && (
						<div className="flex flex-col gap-1 pr-2  pb-6">
							<div className="flex w-full flex-col gap-1 pr-2  pb-6">
								{PRESETS.map((preset) => (
									<PresetButton
										key={preset.name}
										preset={preset.name}
										label={preset.label}
										isSelected={selectedPreset === preset.name}
									/>
								))}
							</div>
						</div>
					)}
				</div>
				<div className="flex justify-end gap-2 py-2 pr-4">
					<Button
						onClick={() => {
							setIsOpen(false);
							resetValues();
						}}
						variant="ghost"
					>
						Cancel
					</Button>
					<Button
						onClick={() => {
							setIsOpen(false);
							if (
								!areRangesEqual(range, openedRangeRef.current) ||
								!areRangesEqual(rangeCompare, openedRangeCompareRef.current)
							) {
								onUpdate?.({ range, rangeCompare });
							}
						}}
					>
						Update
					</Button>
				</div>
			</PopoverContent>
		</Popover>
	);
};
