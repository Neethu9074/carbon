import { number, bytes, millis } from 'in-services/formatters/number';

export default [
  {
    metric: 'returned_item_count',
    label: 'Returned Items',
    category: ['Records'],
    formatter: number
  },
  {
    metric: 'returned_records_count',
    label: 'Returned Records',
    category: ['Records'],
    formatter: number
  },
  {
    metric: 'returned_bytes',
    label: 'Returned Bytes',
    category: ['Network'],
    formatter: bytes
  },
  {
    metric: 'read_throttle_events',
    label: 'Read Throttle Events',
    category: ['Events'],
    formatter: number
  },
  {
    metric: 'write_throttle_events',
    label: 'Write Throttle Events',
    category: ['Events'],
    formatter: number
  },
  {
    metric: 'consumed_read_capacity_units',
    label: 'Consumed read capacity units',
    category: [],
    formatter: number
  },
  {
    metric: 'consumed_write_capacity_units',
    label: 'Consumed write capacity units',
    category: [],
    formatter: number
  },
  {
    metric: 'throttled_requests',
    label: 'Throttled requests',
    category: ['Requests'],
    formatter: number
  },
  {
    metric: 'cond_check_failed_requests',
    label: 'Conditional Check Failed Requests',
    category: ['Requests'],
    formatter: number
  },
  {
    metric: 'successful_request_latency',
    label: 'Successful Request Latency',
    category: ['Requests'],
    formatter: millis
  },
  {
    metric: 'system_errors',
    label: 'System Errors',
    category: ['Errors'],
    formatter: number
  },
  {
    metric: 'user_errors',
    label: 'User Errors',
    category: ['Errors'],
    formatter: number
  },
  {
    metric: 'time_to_live_deleted_item_count',
    label: 'TTL Deleted Items',
    category: ['Requests'],
    formatter: number
  }
];
