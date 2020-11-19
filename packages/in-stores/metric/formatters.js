import { number, percentage, bytes, millis, siPrefix } from 'in-services/formatters/number';

export const defaultFormatter = {
  id: 'number.detailed',
  label: `Number, e.g. ${number.detailed(42.15)}`,
  formatter: number.detailed
};

export const formatters = [
  {
    id: 'number.compact',
    label: `Number, e.g. ${number.compact(42.15)}`,
    formatter: number.compact
  },
  defaultFormatter,
  {
    id: 'percentage.compact',
    label: `Percentage, e.g. ${percentage.compact(0.4215)}`,
    formatter: percentage.compact
  },
  {
    id: 'percentage.detailed',
    label: `Percentage, e.g. ${percentage.detailed(0.4215)}`,
    formatter: percentage.detailed
  },
  {
    id: 'bytes.compact',
    label: `Bytes, e.g. ${bytes.compact(3146340)}`,
    formatter: bytes.compact
  },
  {
    id: 'bytes.detailed',
    label: `Bytes, e.g. ${bytes.detailed(3146340)}`,
    formatter: bytes.detailed
  },
  {
    id: 'millis.compact',
    label: `Milliseconds, e.g. ${millis.compact(42.15)}`,
    formatter: millis.compact
  },
  {
    id: 'millis.detailed',
    label: `Milliseconds, e.g. ${millis.detailed(42.15)}`,
    formatter: millis.detailed
  },
  {
    id: 'siPrefix.compact',
    label: `SI Prefix, e.g. ${siPrefix.compact(3146340)}`,
    formatter: siPrefix.compact
  },
  {
    id: 'siPrefix.detailed',
    label: `SI Prefix, e.g. ${siPrefix.detailed(3146340)}`,
    formatter: siPrefix.detailed
  }
];

export const allFormatterIds = Object.values(formatters).map(c => c.id);

export function getFormatter(formatterId)  {
  return (formatters.find(({ id }) => id === formatterId) || defaultFormatter).formatter;
}
