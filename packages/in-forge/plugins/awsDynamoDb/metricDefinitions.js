/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import { number, millis } from 'in-services/formatters/number';

export default [
  {
    metric: 'provisioned_read',
    label: 'Provisioned read capacity',
    min: 0,
    formatter: number.detailed
  },
  {
    metric: 'consumed_read',
    label: 'Consumed read capacity',
    min: 0,
    formatter: number.detailed
  },
  {
    metric: 'throttled_get',
    label: 'Throttled read requests (Get)',
    min: 0,
    formatter: number.compact
  },
  {
    metric: 'throttled_scan',
    label: 'Throttled read requests (Scan)',
    min: 0,
    formatter: number.compact
  },
  {
    metric: 'throttled_query',
    label: 'Throttled read requests (Query)',
    min: 0,
    formatter: number.compact
  },
  {
    metric: 'throttled_batch_get',
    label: 'Throttled read requests (Batch Get)',
    min: 0,
    formatter: number.compact
  },
  {
    metric: 'provisioned_write',
    label: 'Provisioned write capacity',
    min: 0,
    formatter: number.detailed
  },
  {
    metric: 'consumed_write',
    label: 'Consumed write capacity',
    min: 0,
    formatter: number.detailed
  },
  {
    metric: 'throttled_put',
    label: 'Throttled write requests (Put)',
    min: 0,
    formatter: number.compact
  },
  {
    metric: 'throttled_update',
    label: 'Throttled write requests (Update)',
    min: 0,
    formatter: number.compact
  },
  {
    metric: 'throttled_delete',
    label: 'Throttled write requests (Delete)',
    min: 0,
    formatter: number.compact
  },
  {
    metric: 'throttled_batch_write',
    label: 'Throttled write requests (Batch Write)',
    min: 0,
    formatter: number.compact
  },
  {
    metric: 'lat_get_max',
    label: 'Get latency (Maximum)',
    min: 0,
    formatter: millis.detailed
  },
  {
    metric: 'lat_get_min',
    label: 'Get latency (Minimum)',
    min: 0,
    formatter: millis.detailed
  },
  {
    metric: 'lat_get_avg',
    label: 'Get latency (Average)',
    min: 0,
    formatter: millis.detailed
  },
  {
    metric: 'lat_get_sum',
    label: 'Get latency (Sum)',
    min: 0,
    formatter: millis.detailed
  },
  {
    metric: 'lat_get_sc',
    label: 'Get latency (Request count)',
    min: 0,
    formatter: number.compact
  },
  {
    metric: 'lat_put_max',
    label: 'Put latency (Maximum)',
    min: 0,
    formatter: millis.detailed
  },
  {
    metric: 'lat_put_min',
    label: 'Put latency (Minimum)',
    min: 0,
    formatter: millis.detailed
  },
  {
    metric: 'lat_put_avg',
    label: 'Put latency (Average)',
    min: 0,
    formatter: millis.detailed
  },
  {
    metric: 'lat_put_sum',
    label: 'Put latency (Sum)',
    min: 0,
    formatter: millis.detailed
  },
  {
    metric: 'lat_put_sc',
    label: 'Put latency (Request count)',
    min: 0,
    formatter: number.compact
  },
  {
    metric: 'lat_query_max',
    label: 'Query latency (Maximum)',
    min: 0,
    formatter: millis.detailed
  },
  {
    metric: 'lat_query_min',
    label: 'Query latency (Minimum)',
    min: 0,
    formatter: millis.detailed
  },
  {
    metric: 'lat_query_avg',
    label: 'Query latency (Average)',
    min: 0,
    formatter: millis.detailed
  },
  {
    metric: 'lat_query_sum',
    label: 'Query latency (Sum)',
    min: 0,
    formatter: millis.detailed
  },
  {
    metric: 'lat_query_sc',
    label: 'Query latency (Request count)',
    min: 0,
    formatter: number.compact
  },
  {
    metric: 'lat_scan_max',
    label: 'Scan latency (Maximum)',
    min: 0,
    formatter: millis.detailed
  },
  {
    metric: 'lat_scan_min',
    label: 'Scan latency (Minimum)',
    min: 0,
    formatter: millis.detailed
  },
  {
    metric: 'lat_scan_avg',
    label: 'Scan latency (Average)',
    min: 0,
    formatter: millis.detailed
  },
  {
    metric: 'lat_scan_sum',
    label: 'Scan latency (Sum)',
    min: 0,
    formatter: millis.detailed
  },
  {
    metric: 'lat_scan_sc',
    label: 'Scan latency (Request count)',
    min: 0,
    formatter: number.compact
  },
  {
    metric: 'lat_up_max',
    label: 'Update latency (Maximum)',
    min: 0,
    formatter: millis.detailed
  },
  {
    metric: 'lat_up_min',
    label: 'Update latency (Minimum)',
    min: 0,
    formatter: millis.detailed
  },
  {
    metric: 'lat_up_avg',
    label: 'Update latency (Average)',
    min: 0,
    formatter: millis.detailed
  },
  {
    metric: 'lat_up_sum',
    label: 'Update latency (Sum)',
    min: 0,
    formatter: millis.detailed
  },
  {
    metric: 'lat_up_sc',
    label: 'Update latency (Request count)',
    min: 0,
    formatter: number.compact
  },
  {
    metric: 'lat_del_max',
    label: 'Delete latency (Maximum)',
    min: 0,
    formatter: millis.detailed
  },
  {
    metric: 'lat_del_min',
    label: 'Delete latency (Minimum)',
    min: 0,
    formatter: millis.detailed
  },
  {
    metric: 'lat_del_avg',
    label: 'Delete latency (Average)',
    min: 0,
    formatter: millis.detailed
  },
  {
    metric: 'lat_del_sum',
    label: 'Delete latency (Sum)',
    min: 0,
    formatter: millis.detailed
  },
  {
    metric: 'lat_del_sc',
    label: 'Delete latency (Request count)',
    min: 0,
    formatter: number.compact
  },
  {
    metric: 'lat_batch_get_max',
    label: 'Batch get latency (Maximum)',
    min: 0,
    formatter: millis.detailed
  },
  {
    metric: 'lat_batch_get_min',
    label: 'Batch get latency (Minimum)',
    min: 0,
    formatter: millis.detailed
  },
  {
    metric: 'lat_batch_get_avg',
    label: 'Batch get latency (Average)',
    min: 0,
    formatter: millis.detailed
  },
  {
    metric: 'lat_batch_get_sum',
    label: 'Batch get latency (Sum)',
    min: 0,
    formatter: millis.detailed
  },
  {
    metric: 'lat_batch_get_sc',
    label: 'Batch get latency (Request count)',
    min: 0,
    formatter: number.compact
  },
  {
    metric: 'lat_batch_write_max',
    label: 'Batch write latency (Maximum)',
    min: 0,
    formatter: millis.detailed
  },
  {
    metric: 'lat_batch_write_min',
    label: 'Batch write latency (Minimum)',
    min: 0,
    formatter: millis.detailed
  },
  {
    metric: 'lat_batch_write_avg',
    label: 'Batch write latency (Average)',
    min: 0,
    formatter: millis.detailed
  },
  {
    metric: 'lat_batch_write_sum',
    label: 'Batch write latency (Sum)',
    min: 0,
    formatter: millis.detailed
  },
  {
    metric: 'lat_batch_write_sc',
    label: 'Batch write latency (Request count)',
    min: 0,
    formatter: number.compact
  },
  {
    metric: 'scan_ret_item_max',
    label: 'Returned scan item count (Maximum)',
    min: 0,
    formatter: number.compact
  },
  {
    metric: 'scan_ret_item_min',
    label: 'Returned scan item count (Minimum)',
    min: 0,
    formatter: number.compact
  },
  {
    metric: 'scan_ret_item_avg',
    label: 'Returned scan item count (Average)',
    min: 0,
    formatter: number.compact
  },
  {
    metric: 'scan_ret_item_sum',
    label: 'Returned scan item count (Sum)',
    min: 0,
    formatter: number.compact
  },
  {
    metric: 'query_ret_item_max',
    label: 'Returned query item count (Maximum)',
    min: 0,
    formatter: number.compact
  },
  {
    metric: 'query_ret_item_min',
    label: 'Returned query item count (Minimum)',
    min: 0,
    formatter: number.compact
  },
  {
    metric: 'query_ret_item_avg',
    label: 'Returned query item count (Average)',
    min: 0,
    formatter: number.compact
  },
  {
    metric: 'query_ret_item_sum',
    label: 'Returned query item count (Sum)',
    min: 0,
    formatter: number.compact
  },
  {
    metric: 'con_check_fail',
    label: 'Conditional check failed',
    min: 0,
    formatter: number.compact
  },
  {
    metric: 'user_err',
    label: 'User error',
    min: 0,
    formatter: number.compact
  },
  {
    metric: 'sys_err_get',
    label: 'System errors read (Get)',
    min: 0,
    formatter: number.compact
  },
  {
    metric: 'sys_err_scan',
    label: 'System errors read (Scan)',
    min: 0,
    formatter: number.compact
  },
  {
    metric: 'sys_err_query',
    label: 'System errors read (Query)',
    min: 0,
    formatter: number.compact
  },
  {
    metric: 'sys_err_batch_get',
    label: 'System errors read (Batch get)',
    min: 0,
    formatter: number.compact
  },
  {
    metric: 'sys_err_put',
    label: 'System errors write (Put)',
    min: 0,
    formatter: number.compact
  },
  {
    metric: 'sys_err_update',
    label: 'System errors write (Update)',
    min: 0,
    formatter: number.compact
  },
  {
    metric: 'sys_err_delete',
    label: 'System errors write (Delete)',
    min: 0,
    formatter: number.compact
  },
  {
    metric: 'sys_err_batch_write',
    label: 'System errors write (Batch write)',
    min: 0,
    formatter: number.compact
  },
  {
    metric: 'ttl',
    label: 'TTL Deleted Items',
    min: 0,
    formatter: number.compact
  }
];
