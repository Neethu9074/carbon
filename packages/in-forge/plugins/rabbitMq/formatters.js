import { zeroDecimalPlaces } from 'in-services/formatters/number';

export const greaterThanZeroFormatter = value => (value < 0 ? '—' : zeroDecimalPlaces(value));
