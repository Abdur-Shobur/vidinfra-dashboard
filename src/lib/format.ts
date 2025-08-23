import { format, parseISO } from 'date-fns';

export const formatDate = (iso: string) => {
	try {
		const date = parseISO(iso);
		// Format as "May 11, 2025"
		return format(date, 'MMM d, yyyy');
	} catch (error) {
		console.warn('Date formatting error:', error, 'for date:', iso);
		return iso;
	}
};

export const formatTime = (iso: string) => {
	try {
		const date = parseISO(iso);
		// Format as "11:15 AM"
		return format(date, 'h:mm a');
	} catch (error) {
		console.warn('Time formatting error:', error, 'for date:', iso);
		return iso;
	}
};
