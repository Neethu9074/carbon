import { number, bytesZeroDecimalPlaces } from 'in-services/formatters/number';

export default [
  {
    metrics: ['api.request_count', 'storage.object_count'],
    labels: ['Request count', 'Objects count'],
    min: 0,
    formatter: number
  },
  {
    metrics: ['storage.total_bytes', 'network.sent_bytes_count', 'network.received_bytes_count'],
    labels: ['Objects size', 'Sent bytes', 'Received bytes'],
    min: 0,
    formatter: bytesZeroDecimalPlaces
  }
];
