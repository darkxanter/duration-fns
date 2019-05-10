import { TimeInput, DateInput } from './types';
import { parse } from './parse';
import { UNITS, UNITS_MAP } from './lib/units';
import { parseDate } from './lib/parseDate';
import { apply } from './apply';

/**
 * Convert the input value to milliseconds represented by a `Time` object.
 * If a number is passed this is returned verbatim as the number
 * of milliseconds.
 *
 * @example toMilliseconds({ days: 1 }) // 86400000
 */
export const toMilliseconds = (
	time: TimeInput,
	referenceDate?: DateInput,
): number => {
	if (referenceDate !== undefined) {
		return apply(referenceDate, time).getTime() - parseDate(referenceDate).getTime();
	}

	const parsedTime = parse(time);

	return UNITS.reduce((total, { unit, milliseconds }) => {
		return total + (parsedTime[unit] * milliseconds);
	}, 0);
};

const createTimeConverter = (unit: keyof typeof UNITS_MAP) =>
	(time: TimeInput, referenceDate?: DateInput): number =>
		toMilliseconds(time, referenceDate) / UNITS_MAP[unit].milliseconds;

/**
 * Convert the input value to seconds.
 * @example toSeconds({ minutes: 2 }) // 120
 */
export const toSeconds = createTimeConverter('seconds');

/**
 * Convert the input value to minutes.
 * @example toMinutes({ hours: 1, minutes: 10 }) // 70
 */
export const toMinutes = createTimeConverter('minutes');

/**
 * Convert the input value to hours.
 * @example toHours({ days: 1 }) // 24
 */
export const toHours = createTimeConverter('hours');

/**
 * Convert the input value to days.
 * @example toDays({ hours: 12 }) // 0.5
 */
export const toDays = createTimeConverter('days');

/**
 * Convert the input value to weeks.
 * @example toWeeks({ days: 14 }) // 2
 */
export const toWeeks = createTimeConverter('weeks');

/**
 * Convert the input value to months.
 * Note, this is a rough approximation as the length of a month is variable.
 *
 * @example toMonths({ months: 10, days: 365 }) // 11
 */
export const toMonths = createTimeConverter('months');

/**
 * Convert the input value to years.
 * Note, this is a rough approximation as the length of a year is variable.
 *
 * @example toYears({ years: 10, days: 365 }) // 11
 */
export const toYears = createTimeConverter('years');