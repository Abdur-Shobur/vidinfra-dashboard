import { format, parseISO } from 'date-fns';

export const formatDate = (iso: string) => {
	try {
		return format(parseISO(iso), 'PP');
	} catch {
		return iso;
	}
};

export const formatTime = (iso: string) => {
	try {
		return format(parseISO(iso), 'h:mm a');
	} catch {
		return iso;
	}
};
