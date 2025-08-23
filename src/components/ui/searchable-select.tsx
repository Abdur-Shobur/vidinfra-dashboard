'use client';

/* Use
	<SelectSearch
		value={value}
		options={options}
		placeholder="Select..."
		onSelectorClick={handleSelectorClick}
		multiple={true}
	/>		
*/

import { Button } from '@/components/ui/button';
import {
	Command,
	CommandEmpty,
	CommandGroup,
	CommandInput,
	CommandItem,
	CommandList,
} from '@/components/ui/command';
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { Check, CirclePlus } from 'lucide-react';

type Option = {
	label: string;
	value: string;
	icon?: React.ReactNode;
};

interface SelectSearchProps {
	options: Option[];
	placeholder?: string;
	onSelectorClick?: (value: any) => void;
	value?: string | string[];
	multiple?: boolean;
	label?: string;
}

export const SelectSearch = ({
	options,
	onSelectorClick,
	value,
	multiple = false,
	label,
}: SelectSearchProps) => {
	const selectedValues = multiple
		? Array.isArray(value)
			? value
			: []
		: [value];
	const selectedOptions = options.filter((opt) =>
		selectedValues.includes(opt.value)
	);

	const handleSelect = (option: Option) => {
		if (multiple) {
			const currentValues = Array.isArray(value) ? value : [];
			const newValues = currentValues.includes(option.value)
				? currentValues.filter((v) => v !== option.value)
				: [...currentValues, option.value];
			onSelectorClick && onSelectorClick(newValues);
		} else {
			onSelectorClick && onSelectorClick(option);
		}
	};

	const handleRemove = (optionValue: string) => {
		if (multiple && Array.isArray(value)) {
			const newValues = value.filter((v) => v !== optionValue);
			onSelectorClick && onSelectorClick(newValues);
		}
	};

	const getDisplayText = () => {
		if (multiple) {
			if (selectedOptions.length === 0) {
				return 'Select...';
			}
			if (selectedOptions.length === 1) {
				return selectedOptions[0].label;
			}
			return `${selectedOptions.length} items selected`;
		}
		return selectedOptions[0]?.label || 'Select...';
	};

	return (
		<Popover>
			<PopoverTrigger asChild>
				<Button
					variant="outline"
					role="combobox"
					size="sm"
					className={cn(
						'w-full min-h-8 h-auto border-dashed',
						!value && 'text-primary'
					)}
				>
					<CirclePlus className="h-4 w-4 text-primary" />
					{label || 'Select...'}
				</Button>
			</PopoverTrigger>
			<PopoverContent className="w-full p-0" align="start">
				<Command className="rounded-xl">
					<CommandInput placeholder="Search..." className="h-9" />
					<CommandList>
						<CommandEmpty>No result found.</CommandEmpty>
						<CommandGroup>
							{options.map((opt, i) => (
								<CommandItem
									value={opt.label}
									key={i}
									onSelect={() => handleSelect(opt)}
								>
									{selectedValues.includes(opt.value) ? (
										<span className="h-4 w-4 flex items-center justify-center shadow-[0_1.5px_2px_0_rgba(23,37,56,0.16),_0_0_0_1px_var(--bg-tertiary,_#F5F5F5)]  rounded-sm bg-brand-300 outline  outline-brand-100 dark:shadow-none dark:outline-brand-300">
											<Check className={cn('size-3 text-white')} />
										</span>
									) : (
										<span className="h-4 w-4 shadow-[0_1.5px_2px_0_rgba(23,37,56,0.16),_0_0_0_1px_var(--bg-tertiary,_#F5F5F5)]  rounded-sm "></span>
									)}

									{opt.icon}
									{opt.label}
								</CommandItem>
							))}
						</CommandGroup>
					</CommandList>
				</Command>
			</PopoverContent>
		</Popover>
	);
};
