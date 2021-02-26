/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import { t } from 'in-i18n';

import { number, millis } from 'in-services/formatters/number';

export default [
  {
    metric: 'provisioned_read',
    label: t('in-forge:plugins.awsDynamoDbMetricLabel.provisionedReadCapacity'),
    min: 0,
    formatter: number.detailed
  },
  {
    metric: 'consumed_read',
    label: t('in-forge:plugins.awsDynamoDbMetricLabel.consumedReadCapacity'),
    min: 0,
    formatter: number.detailed
  },
  {
    metric: 'throttled_get',
    label: t('in-forge:plugins.awsDynamoDbMetricLabel.throttledReadRequestsGet'),
    min: 0,
    formatter: number.compact
  },
  {
    metric: 'throttled_scan',
    label: t('in-forge:plugins.awsDynamoDbMetricLabel.throttledReadRequestsScan'),
    min: 0,
    formatter: number.compact
  },
  {
    metric: 'throttled_query',
    label: t('in-forge:plugins.awsDynamoDbMetricLabel.throttledReadRequestsQuery'),
    min: 0,
    formatter: number.compact
  },
  {
    metric: 'throttled_batch_get',
    label: t('in-forge:plugins.awsDynamoDbMetricLabel.throttledReadRequestsBatchGet'),
    min: 0,
    formatter: number.compact
  },
  {
    metric: 'provisioned_write',
    label: t('in-forge:plugins.awsDynamoDbMetricLabel.provisionedWriteCapacity'),
    min: 0,
    formatter: number.detailed
  },
  {
    metric: 'consumed_write',
    label: t('in-forge:plugins.awsDynamoDbMetricLabel.consumedWriteCapacity'),
    min: 0,
    formatter: number.detailed
  },
  {
    metric: 'throttled_put',
    label: t('in-forge:plugins.awsDynamoDbMetricLabel.throttledWriteRequestsPut'),
    min: 0,
    formatter: number.compact
  },
  {
    metric: 'throttled_update',
    label: t('in-forge:plugins.awsDynamoDbMetricLabel.throttledWriteRequestsUpdate'),
    min: 0,
    formatter: number.compact
  },
  {
    metric: 'throttled_delete',
    label: t('in-forge:plugins.awsDynamoDbMetricLabel.throttledWriteRequestsDelete'),
    min: 0,
    formatter: number.compact
  },
  {
    metric: 'throttled_batch_write',
    label: t('in-forge:plugins.awsDynamoDbMetricLabel.throttledWriteRequestsBatchWrite'),
    min: 0,
    formatter: number.compact
  },
  {
    metric: 'lat_get_max',
    label: t('in-forge:plugins.awsDynamoDbMetricLabel.getLatencyMax'),
    min: 0,
    formatter: millis.detailed
  },
  {
    metric: 'lat_get_min',
    label: t('in-forge:plugins.awsDynamoDbMetricLabel.getLatencyMin'),
    min: 0,
    formatter: millis.detailed
  },
  {
    metric: 'lat_get_avg',
    label: t('in-forge:plugins.awsDynamoDbMetricLabel.getLatencyAvg'),
    min: 0,
    formatter: millis.detailed
  },
  {
    metric: 'lat_get_sum',
    label: t('in-forge:plugins.awsDynamoDbMetricLabel.getLatencySum'),
    min: 0,
    formatter: millis.detailed
  },
  {
    metric: 'lat_get_sc',
    label: t('in-forge:plugins.awsDynamoDbMetricLabel.getLatencyRequestCount'),
    min: 0,
    formatter: number.compact
  },
  {
    metric: 'lat_put_max',
    label: t('in-forge:plugins.awsDynamoDbMetricLabel.putLatencyMax'),
    min: 0,
    formatter: millis.detailed
  },
  {
    metric: 'lat_put_min',
    label: t('in-forge:plugins.awsDynamoDbMetricLabel.putLatencyMin'),
    min: 0,
    formatter: millis.detailed
  },
  {
    metric: 'lat_put_avg',
    label: t('in-forge:plugins.awsDynamoDbMetricLabel.putLatencyAvg'),
    min: 0,
    formatter: millis.detailed
  },
  {
    metric: 'lat_put_sum',
    label: t('in-forge:plugins.awsDynamoDbMetricLabel.putLatencySum'),
    min: 0,
    formatter: millis.detailed
  },
  {
    metric: 'lat_put_sc',
    label: t('in-forge:plugins.awsDynamoDbMetricLabel.putLatencyRequestCount'),
    min: 0,
    formatter: number.compact
  },
  {
    metric: 'lat_query_max',
    label: t('in-forge:plugins.awsDynamoDbMetricLabel.queryLatencyMax'),
    min: 0,
    formatter: millis.detailed
  },
  {
    metric: 'lat_query_min',
    label: t('in-forge:plugins.awsDynamoDbMetricLabel.queryLatencyMin'),
    min: 0,
    formatter: millis.detailed
  },
  {
    metric: 'lat_query_avg',
    label: t('in-forge:plugins.awsDynamoDbMetricLabel.queryLatencyAvg'),
    min: 0,
    formatter: millis.detailed
  },
  {
    metric: 'lat_query_sum',
    label: t('in-forge:plugins.awsDynamoDbMetricLabel.queryLatencySum'),
    min: 0,
    formatter: millis.detailed
  },
  {
    metric: 'lat_query_sc',
    label: t('in-forge:plugins.awsDynamoDbMetricLabel.queryLatencyRequestCount'),
    min: 0,
    formatter: number.compact
  },
  {
    metric: 'lat_scan_max',
    label: t('in-forge:plugins.awsDynamoDbMetricLabel.scanLatencyMax'),
    min: 0,
    formatter: millis.detailed
  },
  {
    metric: 'lat_scan_min',
    label: t('in-forge:plugins.awsDynamoDbMetricLabel.scanLatencyMin'),
    min: 0,
    formatter: millis.detailed
  },
  {
    metric: 'lat_scan_avg',
    label: t('in-forge:plugins.awsDynamoDbMetricLabel.scanLatencyAvg'),
    min: 0,
    formatter: millis.detailed
  },
  {
    metric: 'lat_scan_sum',
    label: t('in-forge:plugins.awsDynamoDbMetricLabel.scanLatencySum'),
    min: 0,
    formatter: millis.detailed
  },
  {
    metric: 'lat_scan_sc',
    label: t('in-forge:plugins.awsDynamoDbMetricLabel.ScanLatencyRequestCount'),
    min: 0,
    formatter: number.compact
  },
  {
    metric: 'lat_up_max',
    label: t('in-forge:plugins.awsDynamoDbMetricLabel.updateLatencyMax'),
    min: 0,
    formatter: millis.detailed
  },
  {
    metric: 'lat_up_min',
    label: t('in-forge:plugins.awsDynamoDbMetricLabel.updateLatencyMin'),
    min: 0,
    formatter: millis.detailed
  },
  {
    metric: 'lat_up_avg',
    label: t('in-forge:plugins.awsDynamoDbMetricLabel.updateLatencyAvg'),
    min: 0,
    formatter: millis.detailed
  },
  {
    metric: 'lat_up_sum',
    label: t('in-forge:plugins.awsDynamoDbMetricLabel.updateLatencySum'),
    min: 0,
    formatter: millis.detailed
  },
  {
    metric: 'lat_up_sc',
    label: t('in-forge:plugins.awsDynamoDbMetricLabel.updateLatencyRequestCount'),
    min: 0,
    formatter: number.compact
  },
  {
    metric: 'lat_del_max',
    label: t('in-forge:plugins.awsDynamoDbMetricLabel.deleteLatencyMax'),
    min: 0,
    formatter: millis.detailed
  },
  {
    metric: 'lat_del_min',
    label: t('in-forge:plugins.awsDynamoDbMetricLabel.deleteLatencyMin'),
    min: 0,
    formatter: millis.detailed
  },
  {
    metric: 'lat_del_avg',
    label: t('in-forge:plugins.awsDynamoDbMetricLabel.deleteLatencyAvg'),
    min: 0,
    formatter: millis.detailed
  },
  {
    metric: 'lat_del_sum',
    label: t('in-forge:plugins.awsDynamoDbMetricLabel.deleteLatencySum'),
    min: 0,
    formatter: millis.detailed
  },
  {
    metric: 'lat_del_sc',
    label: t('in-forge:plugins.awsDynamoDbMetricLabel.deleteLatencySum'),
    min: 0,
    formatter: number.compact
  },
  {
    metric: 'lat_batch_get_max',
    label: t('in-forge:plugins.awsDynamoDbMetricLabel.batchGetLatencyMax'),
    min: 0,
    formatter: millis.detailed
  },
  {
    metric: 'lat_batch_get_min',
    label: t('in-forge:plugins.awsDynamoDbMetricLabel.batchGetLatencyMin'),
    min: 0,
    formatter: millis.detailed
  },
  {
    metric: 'lat_batch_get_avg',
    label: t('in-forge:plugins.awsDynamoDbMetricLabel.batchGetLatencyAvg'),
    min: 0,
    formatter: millis.detailed
  },
  {
    metric: 'lat_batch_get_sum',
    label: t('in-forge:plugins.awsDynamoDbMetricLabel.batchGetLatencySum'),
    min: 0,
    formatter: millis.detailed
  },
  {
    metric: 'lat_batch_get_sc',
    label: t('in-forge:plugins.awsDynamoDbMetricLabel.batchGetLatencyRequestCount'),
    min: 0,
    formatter: number.compact
  },
  {
    metric: 'lat_batch_write_max',
    label: t('in-forge:plugins.awsDynamoDbMetricLabel.batchWriteLatencyMax'),
    min: 0,
    formatter: millis.detailed
  },
  {
    metric: 'lat_batch_write_min',
    label: t('in-forge:plugins.awsDynamoDbMetricLabel.batchWriteLatencyMin'),
    min: 0,
    formatter: millis.detailed
  },
  {
    metric: 'lat_batch_write_avg',
    label: t('in-forge:plugins.awsDynamoDbMetricLabel.batchWriteLatencyAvg'),
    min: 0,
    formatter: millis.detailed
  },
  {
    metric: 'lat_batch_write_sum',
    label: t('in-forge:plugins.awsDynamoDbMetricLabel.batchWriteLatencySum'),
    min: 0,
    formatter: millis.detailed
  },
  {
    metric: 'lat_batch_write_sc',
    label: t('in-forge:plugins.awsDynamoDbMetricLabel.batchWriteLatencyRequestCount'),
    min: 0,
    formatter: number.compact
  },
  {
    metric: 'scan_ret_item_max',
    label: t('in-forge:plugins.awsDynamoDbMetricLabel.returnedScanItemCountMax'),
    min: 0,
    formatter: number.compact
  },
  {
    metric: 'scan_ret_item_min',
    label: t('in-forge:plugins.awsDynamoDbMetricLabel.returnedScanItemCountMin'),
    min: 0,
    formatter: number.compact
  },
  {
    metric: 'scan_ret_item_avg',
    label: t('in-forge:plugins.awsDynamoDbMetricLabel.returnedScanItemCountAvg'),
    min: 0,
    formatter: number.compact
  },
  {
    metric: 'scan_ret_item_sum',
    label: t('in-forge:plugins.awsDynamoDbMetricLabel.returnedScanItemCountSum'),
    min: 0,
    formatter: number.compact
  },
  {
    metric: 'query_ret_item_max',
    label: t('in-forge:plugins.awsDynamoDbMetricLabel.returnedQueryItemCountMax'),
    min: 0,
    formatter: number.compact
  },
  {
    metric: 'query_ret_item_min',
    label: t('in-forge:plugins.awsDynamoDbMetricLabel.returnedQueryItemCountMin'),
    min: 0,
    formatter: number.compact
  },
  {
    metric: 'query_ret_item_avg',
    label: t('in-forge:plugins.awsDynamoDbMetricLabel.returnedQueryItemCountAvg'),
    min: 0,
    formatter: number.compact
  },
  {
    metric: 'query_ret_item_sum',
    label: t('in-forge:plugins.awsDynamoDbMetricLabel.returnedQueryItemCountSum'),
    min: 0,
    formatter: number.compact
  },
  {
    metric: 'con_check_fail',
    label: t('in-forge:plugins.awsDynamoDbMetricLabel.conCheckFailed'),
    min: 0,
    formatter: number.compact
  },
  {
    metric: 'user_err',
    label: t('in-forge:plugins.awsDynamoDbMetricLabel.userError'),
    min: 0,
    formatter: number.compact
  },
  {
    metric: 'sys_err_get',
    label: t('in-forge:plugins.awsDynamoDbMetricLabel.systemErrorsReadGet'),
    min: 0,
    formatter: number.compact
  },
  {
    metric: 'sys_err_scan',
    label: t('in-forge:plugins.awsDynamoDbMetricLabel.systemErrorsReadScan'),
    min: 0,
    formatter: number.compact
  },
  {
    metric: 'sys_err_query',
    label: t('in-forge:plugins.awsDynamoDbMetricLabel.systemErrorsReadQuery'),
    min: 0,
    formatter: number.compact
  },
  {
    metric: 'sys_err_batch_get',
    label: t('in-forge:plugins.awsDynamoDbMetricLabel.systemErrorsReadBatchGet'),
    min: 0,
    formatter: number.compact
  },
  {
    metric: 'sys_err_put',
    label: t('in-forge:plugins.awsDynamoDbMetricLabel.systemErrorsWritePut'),
    min: 0,
    formatter: number.compact
  },
  {
    metric: 'sys_err_update',
    label: t('in-forge:plugins.awsDynamoDbMetricLabel.systemErrorsWriteUpdate'),
    min: 0,
    formatter: number.compact
  },
  {
    metric: 'sys_err_delete',
    label: t('in-forge:plugins.awsDynamoDbMetricLabel.systemErrorsWriteDelete'),
    min: 0,
    formatter: number.compact
  },
  {
    metric: 'sys_err_batch_write',
    label: t('in-forge:plugins.awsDynamoDbMetricLabel.systemErrorsWriteBatchWrite'),
    min: 0,
    formatter: number.compact
  },
  {
    metric: 'ttl',
    label: t('in-forge:plugins.awsDynamoDbMetricLabel.ttlDeletedItems'),
    min: 0,
    formatter: number.compact
  }
];
