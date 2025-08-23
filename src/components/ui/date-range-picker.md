# Date Range Picker Component

A comprehensive date range picker component that provides both predefined date ranges and custom date/time selection.

## Features

- **Predefined Ranges**: Quick selection of common date ranges (All Time, Last 8 Hours, Last 24 Hours, etc.)
- **Custom Date Selection**: Multi-month calendar interface for selecting custom start and end dates
- **Time Selection**: Time picker inputs for precise time selection
- **Current Time Button**: Quick way to set end time to current time
- **Popover Interface**: Clean, modern popover design
- **Responsive Design**: Works well on different screen sizes

## Usage

```tsx
import { DateRangePicker } from '@/components/ui/date-range-picker';
import { DateRange } from 'react-day-picker';

function MyComponent() {
	const [dateRange, setDateRange] = useState<DateRange | undefined>();

	return (
		<DateRangePicker
			dateRange={dateRange}
			onDateRangeChange={setDateRange}
			placeholder="Select date range..."
		/>
	);
}
```

## Props

| Prop                | Type                                          | Default               | Description                             |
| ------------------- | --------------------------------------------- | --------------------- | --------------------------------------- |
| `dateRange`         | `DateRange \| undefined`                      | `undefined`           | The selected date range                 |
| `onDateRangeChange` | `(dateRange: DateRange \| undefined) => void` | -                     | Callback when date range changes        |
| `placeholder`       | `string`                                      | `'Pick a date range'` | Placeholder text for the trigger button |
| `className`         | `string`                                      | -                     | Additional CSS classes                  |

## Predefined Ranges

- **All Time**: From January 1, 2020 to current time
- **Last 8 Hours**: Last 8 hours from current time
- **Last 24 Hours**: Last 24 hours from current time
- **Last 7 Days**: Last 7 days from current time
- **Last 30 Days**: Last 30 days from current time
- **This Month**: Current month (start to end)
- **Custom Date Range**: Manual date selection

## Custom Hook

The component also provides a custom hook for managing date range state:

```tsx
import { useDateRange } from '@/hooks/use-date-range';

function MyComponent() {
	const {
		dateRange,
		selectedPredefinedRange,
		setDateRange,
		setPredefinedRange,
		clearDateRange,
	} = useDateRange();

	// Use the hook methods to manage date range state
}
```

## Demo

Visit `/date-range-demo` to see the component in action.

## Dependencies

- `date-fns` - Date manipulation utilities
- `react-day-picker` - Calendar component
- `@radix-ui/react-popover` - Popover component
- `lucide-react` - Icons
