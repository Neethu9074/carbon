import { number, bytesZeroDecimalPlaces } from 'in-services/formatters/number';

export default [
  {
    label: 'Requests',
    metric: 'api.request_count',
    formatter: number
  },
  {
    label: 'Objects Count',
    metric: 'storage.object_count',
    formatter: number
  },
  {
    label: 'Objects Size',
    metric: 'storage.total_bytes',
    formatter: bytesZeroDecimalPlaces
  }
];
