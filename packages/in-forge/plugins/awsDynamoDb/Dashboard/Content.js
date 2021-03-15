/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import GetMetricStatisticsInUse from 'in-forge/plugins/awsDynamoDb/GetMetricStatisticsInUse';
import PluginDashboardsMarkerLanes from 'in-forge/PluginDashboardsMarkerLanes';
import DashboardSection from 'in-sdk/components/dashboard/DashboardSection';
import Chart from 'in-components/Chart/InfrastructureMetricChartBehavior';
import { number, millis } from 'in-services/formatters/number';
import Columize from 'in-sdk/components/dashboard/Columize';
import { t } from 'in-i18n';

export default function AwsDynamoDbDashboard({ snapshot, timeConfig }) {
  const snapshotId = snapshot.get('id');
  return (
    <div>
      <GetMetricStatisticsInUse snapshot={snapshot} />
      <Columize>
        <DashboardSection title={t('in-forge:plugins.awsDynamoDb.titleReadCapacity')}>
          <Chart
            snapshotId={snapshotId}
            timeConfig={timeConfig}
            y1={{
              min: 0,
              metrics: ['provisioned_read', 'consumed_read'],
              labels: [
                t('in-forge:plugins.awsDynamoDb.labelProvisioned'),
                t('in-forge:plugins.awsDynamoDb.labelConsumed')
              ],
              type: 'line',
              formatter: number.detailed
            }}
            renderPostChartContent={PluginDashboardsMarkerLanes}
          />
        </DashboardSection>
        <DashboardSection title={t('in-forge:plugins.awsDynamoDb.titleThrottledReadRequests')}>
          <Chart
            snapshotId={snapshotId}
            timeConfig={timeConfig}
            y1={{
              min: 0,
              metrics: ['throttled_get', 'throttled_scan', 'throttled_query', 'throttled_batch_get'],
              labels: [
                t('in-forge:plugins.labelGet'),
                t('in-forge:plugins.labelScan'),
                t('in-forge:plugins.labelQuery'),
                t('in-forge:plugins.labelBatchGet')
              ],
              type: 'line',
              formatter: number.compact
            }}
            renderPostChartContent={PluginDashboardsMarkerLanes}
          />
        </DashboardSection>
      </Columize>
      <Columize>
        <DashboardSection title={t('in-forge:plugins.awsDynamoDb.titleWriteCapacity')}>
          <Chart
            snapshotId={snapshotId}
            timeConfig={timeConfig}
            y1={{
              min: 0,
              metrics: ['provisioned_write', 'consumed_write'],
              labels: [
                t('in-forge:plugins.awsDynamoDb.labelProvisioned'),
                t('in-forge:plugins.awsDynamoDb.labelConsumed')
              ],
              type: 'line',
              formatter: number.detailed
            }}
            renderPostChartContent={PluginDashboardsMarkerLanes}
          />
        </DashboardSection>
        <DashboardSection title={t('in-forge:plugins.awsDynamoDb.titleThrottledWriteRequests')}>
          <Chart
            snapshotId={snapshotId}
            timeConfig={timeConfig}
            y1={{
              min: 0,
              metrics: ['throttled_put', 'throttled_update', 'throttled_delete', 'throttled_batch_write'],
              labels: [
                t('in-forge:plugins.labelPut'),
                t('in-forge:plugins.labelUpdate'),
                t('in-forge:plugins.labelDelete'),
                t('in-forge:plugins.labelBatchWrite')
              ],
              type: 'line',
              formatter: number.compact
            }}
            renderPostChartContent={PluginDashboardsMarkerLanes}
          />
        </DashboardSection>
      </Columize>

      <DashboardSection title={t('in-forge:plugins.awsDynamoDb.titleGetLatency')}>
        <Chart
          snapshotId={snapshotId}
          timeConfig={timeConfig}
          y1={{
            min: 0,
            metrics: ['lat_get_max', 'lat_get_min', 'lat_get_avg', 'lat_get_sum'],
            labels: [
              t('in-forge:plugins.labelMaximum'),
              t('in-forge:plugins.labelMinimum'),
              t('in-forge:plugins.labelAverage'),
              t('in-forge:plugins.labelSum')
            ],
            type: 'line',
            formatter: millis.detailed
          }}
          y2={{
            min: 0,
            metrics: ['lat_get_sc'],
            labels: [t('in-forge:plugins.awsDynamoDb.labelRequestCount')],
            type: 'line',
            formatter: number.compact
          }}
          renderPostChartContent={PluginDashboardsMarkerLanes}
        />
      </DashboardSection>
      <DashboardSection title={t('in-forge:plugins.awsDynamoDb.titlePutLatency')}>
        <Chart
          snapshotId={snapshotId}
          timeConfig={timeConfig}
          y1={{
            min: 0,
            metrics: ['lat_put_max', 'lat_put_min', 'lat_put_avg', 'lat_put_sum'],
            labels: [
              t('in-forge:plugins.labelMaximum'),
              t('in-forge:plugins.labelMinimum'),
              t('in-forge:plugins.labelAverage'),
              t('in-forge:plugins.labelSum')
            ],
            type: 'line',
            formatter: millis.detailed
          }}
          y2={{
            min: 0,
            metrics: ['lat_put_sc'],
            labels: [t('in-forge:plugins.awsDynamoDb.labelRequestCount')],
            type: 'line',
            formatter: number.compact
          }}
          renderPostChartContent={PluginDashboardsMarkerLanes}
        />
      </DashboardSection>
      <DashboardSection title={t('in-forge:plugins.awsDynamoDb.titleQueryLatency')}>
        <Chart
          snapshotId={snapshotId}
          timeConfig={timeConfig}
          y1={{
            min: 0,
            metrics: ['lat_query_max', 'lat_query_min', 'lat_query_avg', 'lat_query_sum'],
            labels: [
              t('in-forge:plugins.labelMaximum'),
              t('in-forge:plugins.labelMinimum'),
              t('in-forge:plugins.labelAverage'),
              t('in-forge:plugins.labelSum')
            ],
            type: 'line',
            formatter: millis.detailed
          }}
          y2={{
            min: 0,
            metrics: ['lat_query_sc'],
            labels: [t('in-forge:plugins.awsDynamoDb.labelRequestCount')],
            type: 'line',
            formatter: number.compact
          }}
          renderPostChartContent={PluginDashboardsMarkerLanes}
        />
      </DashboardSection>
      <DashboardSection title={t('in-forge:plugins.awsDynamoDb.titleScanLatency')}>
        <Chart
          snapshotId={snapshotId}
          timeConfig={timeConfig}
          y1={{
            min: 0,
            metrics: ['lat_scan_max', 'lat_scan_min', 'lat_scan_avg', 'lat_scan_sum'],
            labels: [
              t('in-forge:plugins.labelMaximum'),
              t('in-forge:plugins.labelMinimum'),
              t('in-forge:plugins.labelAverage'),
              t('in-forge:plugins.labelSum')
            ],
            type: 'line',
            formatter: millis.detailed
          }}
          y2={{
            min: 0,
            metrics: ['lat_scan_sc'],
            labels: [t('in-forge:plugins.awsDynamoDb.labelRequestCount')],
            type: 'line',
            formatter: number.compact
          }}
          renderPostChartContent={PluginDashboardsMarkerLanes}
        />
      </DashboardSection>
      <DashboardSection title={t('in-forge:plugins.awsDynamoDb.titleUpdateLatency')}>
        <Chart
          snapshotId={snapshotId}
          timeConfig={timeConfig}
          y1={{
            min: 0,
            metrics: ['lat_up_max', 'lat_up_min', 'lat_up_avg', 'lat_up_sum'],
            labels: [
              t('in-forge:plugins.labelMaximum'),
              t('in-forge:plugins.labelMinimum'),
              t('in-forge:plugins.labelAverage'),
              t('in-forge:plugins.labelSum')
            ],
            type: 'line',
            formatter: millis.detailed
          }}
          y2={{
            min: 0,
            metrics: ['lat_up_sc'],
            labels: [t('in-forge:plugins.awsDynamoDb.labelRequestCount')],
            type: 'line',
            formatter: number.compact
          }}
          renderPostChartContent={PluginDashboardsMarkerLanes}
        />
      </DashboardSection>
      <DashboardSection title={t('in-forge:plugins.awsDynamoDb.titleDeleteLatency')}>
        <Chart
          snapshotId={snapshotId}
          timeConfig={timeConfig}
          y1={{
            min: 0,
            metrics: ['lat_del_max', 'lat_del_min', 'lat_del_avg', 'lat_del_sum'],
            labels: [
              t('in-forge:plugins.labelMaximum'),
              t('in-forge:plugins.labelMinimum'),
              t('in-forge:plugins.labelAverage'),
              t('in-forge:plugins.labelSum')
            ],
            type: 'line',
            formatter: millis.detailed
          }}
          y2={{
            min: 0,
            metrics: ['lat_del_sc'],
            labels: [t('in-forge:plugins.awsDynamoDb.labelRequestCount')],
            type: 'line',
            formatter: number.compact
          }}
          renderPostChartContent={PluginDashboardsMarkerLanes}
        />
      </DashboardSection>
      <DashboardSection title={t('in-forge:plugins.awsDynamoDb.titleBatchGetLatency')}>
        <Chart
          snapshotId={snapshotId}
          timeConfig={timeConfig}
          y1={{
            min: 0,
            metrics: ['lat_batch_get_max', 'lat_batch_get_min', 'lat_batch_get_avg', 'lat_batch_get_sum'],
            labels: [
              t('in-forge:plugins.labelMaximum'),
              t('in-forge:plugins.labelMinimum'),
              t('in-forge:plugins.labelAverage'),
              t('in-forge:plugins.labelSum')
            ],
            type: 'line',
            formatter: millis.detailed
          }}
          y2={{
            min: 0,
            metrics: ['lat_batch_get_sc'],
            labels: [t('in-forge:plugins.awsDynamoDb.labelRequestCount')],
            type: 'line',
            formatter: number.compact
          }}
          renderPostChartContent={PluginDashboardsMarkerLanes}
        />
      </DashboardSection>
      <DashboardSection title={t('in-forge:plugins.awsDynamoDb.titleBatchWriteLatency')}>
        <Chart
          snapshotId={snapshotId}
          timeConfig={timeConfig}
          y1={{
            min: 0,
            metrics: ['lat_batch_write_max', 'lat_batch_write_min', 'lat_batch_write_avg', 'lat_batch_write_sum'],
            labels: [
              t('in-forge:plugins.labelMaximum'),
              t('in-forge:plugins.labelMinimum'),
              t('in-forge:plugins.labelAverage'),
              t('in-forge:plugins.labelSum')
            ],
            type: 'line',
            formatter: millis.detailed
          }}
          y2={{
            min: 0,
            metrics: ['lat_batch_write_sc'],
            labels: [t('in-forge:plugins.awsDynamoDb.labelRequestCount')],
            type: 'line',
            formatter: number.compact
          }}
          renderPostChartContent={PluginDashboardsMarkerLanes}
        />
      </DashboardSection>

      <Columize>
        <DashboardSection title={t('in-forge:plugins.awsDynamoDb.titleReturnedScanItemCount')}>
          <Chart
            snapshotId={snapshotId}
            timeConfig={timeConfig}
            y1={{
              min: 0,
              metrics: ['scan_ret_item_max', 'scan_ret_item_min', 'scan_ret_item_avg', 'scan_ret_item_sum'],
              labels: [
                t('in-forge:plugins.labelMaximum'),
                t('in-forge:plugins.labelMinimum'),
                t('in-forge:plugins.labelAverage'),
                t('in-forge:plugins.labelSum')
              ],
              type: 'line',
              formatter: number.compact
            }}
            renderPostChartContent={PluginDashboardsMarkerLanes}
          />
        </DashboardSection>
        <DashboardSection title={t('in-forge:plugins.awsDynamoDb.titleReturnedQueryItemCount')}>
          <Chart
            snapshotId={snapshotId}
            timeConfig={timeConfig}
            y1={{
              min: 0,
              metrics: ['query_ret_item_max', 'query_ret_item_min', 'query_ret_item_avg', 'query_ret_item_sum'],
              labels: [
                t('in-forge:plugins.labelMaximum'),
                t('in-forge:plugins.labelMinimum'),
                t('in-forge:plugins.labelAverage'),
                t('in-forge:plugins.labelSum')
              ],
              type: 'line',
              formatter: number.compact
            }}
            renderPostChartContent={PluginDashboardsMarkerLanes}
          />
        </DashboardSection>
      </Columize>

      <Columize>
        <DashboardSection title={t('in-forge:plugins.awsDynamoDb.titleConditionalCheckFailed')}>
          <Chart
            snapshotId={snapshotId}
            timeConfig={timeConfig}
            y1={{
              min: 0,
              metrics: ['con_check_fail'],
              labels: [t('in-forge:plugins.labelCount')],
              type: 'line',
              formatter: number.compact
            }}
            renderPostChartContent={PluginDashboardsMarkerLanes}
          />
        </DashboardSection>
        <DashboardSection title={t('in-forge:plugins.awsDynamoDb.titleUserError')}>
          <Chart
            snapshotId={snapshotId}
            timeConfig={timeConfig}
            y1={{
              min: 0,
              metrics: ['user_err'],
              labels: [t('in-forge:plugins.labelCount')],
              type: 'line',
              formatter: number.compact
            }}
            renderPostChartContent={PluginDashboardsMarkerLanes}
          />
        </DashboardSection>
      </Columize>
      <Columize>
        <DashboardSection title={t('in-forge:plugins.awsDynamoDb.titleSystemErrorsWrite')}>
          <Chart
            snapshotId={snapshotId}
            timeConfig={timeConfig}
            y1={{
              min: 0,
              metrics: ['sys_err_put', 'sys_err_update', 'sys_err_delete', 'sys_err_batch_write'],
              labels: [
                t('in-forge:plugins.labelPut'),
                t('in-forge:plugins.labelUpdate'),
                t('in-forge:plugins.labelDelete'),
                t('in-forge:plugins.labelBatchWrite')
              ],
              type: 'line',
              formatter: number.compact
            }}
            renderPostChartContent={PluginDashboardsMarkerLanes}
          />
        </DashboardSection>
        <DashboardSection title={t('in-forge:plugins.awsDynamoDb.titleSystemErrorsRead')}>
          <Chart
            snapshotId={snapshotId}
            timeConfig={timeConfig}
            y1={{
              min: 0,
              metrics: ['sys_err_get', 'sys_err_scan', 'sys_err_query', 'sys_err_batch_get'],
              labels: [
                t('in-forge:plugins.labelGet'),
                t('in-forge:plugins.labelScan'),
                t('in-forge:plugins.labelQuery'),
                t('in-forge:plugins.labelBatchGet')
              ],
              type: 'line',
              formatter: number.compact
            }}
            renderPostChartContent={PluginDashboardsMarkerLanes}
          />
        </DashboardSection>
      </Columize>
      <DashboardSection title={t('in-forge:plugins.awsDynamoDb.titleTTLDeletedItem')}>
        <Chart
          snapshotId={snapshotId}
          timeConfig={timeConfig}
          y1={{
            min: 0,
            metrics: ['ttl'],
            labels: [t('in-forge:plugins.labelCount')],
            type: 'line',
            formatter: number.compact
          }}
          renderPostChartContent={PluginDashboardsMarkerLanes}
        />
      </DashboardSection>
    </div>
  );
}
