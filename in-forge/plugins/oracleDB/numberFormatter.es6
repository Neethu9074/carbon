import {
  twoDecimalPlaces,
  zeroDecimalPlaces
} from 'in-services/formatters/number';


export const centiSecondsToMillisTwoDecimalPlaces = d => twoDecimalPlaces(d * 10) + 'ms';
export const centiSecondsToMillisZeroDecimalPlaces = d => zeroDecimalPlaces(d * 10) + 'ms';
export const centiSecondsToMilis = {
  compact: centiSecondsToMillisZeroDecimalPlaces,
  detailed: centiSecondsToMillisTwoDecimalPlaces
};

export const percentage100TwoDecimalPlaces = d => twoDecimalPlaces(d) + '%';
export const percentage100ZeroDecimalPlaces = d => zeroDecimalPlaces(d) + '%';
export const percentage100 = {
  compact: percentage100ZeroDecimalPlaces,
  detailed: percentage100TwoDecimalPlaces
};
