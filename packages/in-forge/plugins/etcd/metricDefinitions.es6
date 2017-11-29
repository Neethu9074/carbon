import { zeroDecimalPlaces, bytesZeroDecimalPlaces } from 'in-services/formatters/number';

export default [
  {
    metrics: ['requests_received', 'requests_sent'],
    labels: ['Received', 'Sent'],
    min: 0,
    formatter: zeroDecimalPlaces,
    isAvailable
  },
  {
    metrics: ['bytes_per_sec_received', 'bytes_per_sec_sent'],
    labels: ['Received', 'Sent'],
    min: 0,
    formatter: bytesZeroDecimalPlaces,
    isAvailable
  },
  {
    metrics: ['storage.expire_count'],
    labels: ['Expire count'],
    min: 0,
    formatter: zeroDecimalPlaces,
    isAvailable
  },
  {
    metrics: ['storage.watchers'],
    labels: ['Watchers'],
    min: 0,
    formatter: zeroDecimalPlaces,
    isAvailable
  },
  {
    metrics: ['storage.compare_and_swap_fail', 'storage.compare_and_swap_success'],
    labels: ['Compare and swap fail', 'Compare and swap success'],
    min: 0,
    formatter: zeroDecimalPlaces,
    isAvailable
  },
  {
    metrics: ['storage.compare_and_delete_fail', 'storage.compare_and_delete_success'],
    labels: ['Compare and delete fail', 'Compare and delete success'],
    min: 0,
    formatter: zeroDecimalPlaces,
    isAvailable
  },
  {
    metrics: ['storage.create_fail', 'storage.create_success'],
    labels: ['Create fail', 'Create success'],
    min: 0,
    formatter: zeroDecimalPlaces,
    isAvailable
  },
  {
    metrics: ['storage.delete_fail', 'storage.delete_success'],
    labels: ['Delete fail', 'Delete success'],
    min: 0,
    formatter: zeroDecimalPlaces,
    isAvailable
  },
  {
    metrics: ['storage.gets_fail', 'storage.gets_success'],
    labels: ['Gets fail', 'Gets success'],
    min: 0,
    formatter: zeroDecimalPlaces,
    isAvailable
  },
  {
    metrics: ['storage.sets_fail', 'storage.sets_success'],
    labels: ['Sets fail', 'Sets success'],
    min: 0,
    formatter: zeroDecimalPlaces,
    isAvailable
  },
  {
    metrics: ['storage.update_fail', 'storage.update_success'],
    labels: ['Update fail', 'Update success'],
    min: 0,
    formatter: zeroDecimalPlaces,
    isAvailable
  }
];

function isAvailable(snapshot) {
  return snapshot.getIn(['data', 'sensorConnectionStatus'], true);
}
