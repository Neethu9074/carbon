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

export default function AwsDynamoDbDashboard({ snapshot, timeConfig }) {
  const snapshotId = snapshot.get('id');
  return (
    <div>
      <GetMetricStatisticsInUse snapshot={snapshot} />
      <Columize>
        <DashboardSection title="Read capacity">
          <Chart
            snapshotId={snapshotId}
            timeConfig={timeConfig}
            y1={{
              min: 0,
              metrics: ['provisioned_read', 'consumed_read'],
              labels: ['Provisioned', 'Consumed'],
              type: 'line',
              formatter: number.detailed
            }}
            renderPostChartContent={PluginDashboardsMarkerLanes}
          />
        </DashboardSection>
        <DashboardSection title="Throttled read requests">
          <Chart
            snapshotId={snapshotId}
            timeConfig={timeConfig}
            y1={{
              min: 0,
              metrics: ['throttled_get', 'throttled_scan', 'throttled_query', 'throttled_batch_get'],
              labels: ['Get', 'Scan', 'Query', 'Batch get'],
              type: 'line',
              formatter: number.compact
            }}
            renderPostChartContent={PluginDashboardsMarkerLanes}
          />
        </DashboardSection>
      </Columize>
      <Columize>
        <DashboardSection title="Write capacity">
          <Chart
            snapshotId={snapshotId}
            timeConfig={timeConfig}
            y1={{
              min: 0,
              metrics: ['provisioned_write', 'consumed_write'],
              labels: ['Provisioned', 'Consumed'],
              type: 'line',
              formatter: number.detailed
            }}
            renderPostChartContent={PluginDashboardsMarkerLanes}
          />
        </DashboardSection>
        <DashboardSection title="Throttled write requests">
          <Chart
            snapshotId={snapshotId}
            timeConfig={timeConfig}
            y1={{
              min: 0,
              metrics: ['throttled_put', 'throttled_update', 'throttled_delete', 'throttled_batch_write'],
              labels: ['Put', 'Update', 'Delete', 'Batch write'],
              type: 'line',
              formatter: number.compact
            }}
            renderPostChartContent={PluginDashboardsMarkerLanes}
          />
        </DashboardSection>
      </Columize>

      <DashboardSection title="Get latency">
        <Chart
          snapshotId={snapshotId}
          timeConfig={timeConfig}
          y1={{
            min: 0,
            metrics: ['lat_get_max', 'lat_get_min', 'lat_get_avg', 'lat_get_sum'],
            labels: ['Maximum', 'Minimum', 'Average', 'Sum'],
            type: 'line',
            formatter: millis.detailed
          }}
          y2={{
            min: 0,
            metrics: ['lat_get_sc'],
            labels: ['Request count'],
            type: 'line',
            formatter: number.compact
          }}
          renderPostChartContent={PluginDashboardsMarkerLanes}
        />
      </DashboardSection>
      <DashboardSection title="Put latency">
        <Chart
          snapshotId={snapshotId}
          timeConfig={timeConfig}
          y1={{
            min: 0,
            metrics: ['lat_put_max', 'lat_put_min', 'lat_put_avg', 'lat_put_sum'],
            labels: ['Maximum', 'Minimum', 'Average', 'Sum'],
            type: 'line',
            formatter: millis.detailed
          }}
          y2={{
            min: 0,
            metrics: ['lat_put_sc'],
            labels: ['Request count'],
            type: 'line',
            formatter: number.compact
          }}
          renderPostChartContent={PluginDashboardsMarkerLanes}
        />
      </DashboardSection>
      <DashboardSection title="Query latency">
        <Chart
          snapshotId={snapshotId}
          timeConfig={timeConfig}
          y1={{
            min: 0,
            metrics: ['lat_query_max', 'lat_query_min', 'lat_query_avg', 'lat_query_sum'],
            labels: ['Maximum', 'Minimum', 'Average', 'Sum'],
            type: 'line',
            formatter: millis.detailed
          }}
          y2={{
            min: 0,
            metrics: ['lat_query_sc'],
            labels: ['Request count'],
            type: 'line',
            formatter: number.compact
          }}
          renderPostChartContent={PluginDashboardsMarkerLanes}
        />
      </DashboardSection>
      <DashboardSection title="Scan latency">
        <Chart
          snapshotId={snapshotId}
          timeConfig={timeConfig}
          y1={{
            min: 0,
            metrics: ['lat_scan_max', 'lat_scan_min', 'lat_scan_avg', 'lat_scan_sum'],
            labels: ['Maximum', 'Minimum', 'Average', 'Sum'],
            type: 'line',
            formatter: millis.detailed
          }}
          y2={{
            min: 0,
            metrics: ['lat_scan_sc'],
            labels: ['Request count'],
            type: 'line',
            formatter: number.compact
          }}
          renderPostChartContent={PluginDashboardsMarkerLanes}
        />
      </DashboardSection>
      <DashboardSection title="Update latency">
        <Chart
          snapshotId={snapshotId}
          timeConfig={timeConfig}
          y1={{
            min: 0,
            metrics: ['lat_up_max', 'lat_up_min', 'lat_up_avg', 'lat_up_sum'],
            labels: ['Maximum', 'Minimum', 'Average', 'Sum'],
            type: 'line',
            formatter: millis.detailed
          }}
          y2={{
            min: 0,
            metrics: ['lat_up_sc'],
            labels: ['Request count'],
            type: 'line',
            formatter: number.compact
          }}
          renderPostChartContent={PluginDashboardsMarkerLanes}
        />
      </DashboardSection>
      <DashboardSection title="Delete latency">
        <Chart
          snapshotId={snapshotId}
          timeConfig={timeConfig}
          y1={{
            min: 0,
            metrics: ['lat_del_max', 'lat_del_min', 'lat_del_avg', 'lat_del_sum'],
            labels: ['Maximum', 'Minimum', 'Average', 'Sum'],
            type: 'line',
            formatter: millis.detailed
          }}
          y2={{
            min: 0,
            metrics: ['lat_del_sc'],
            labels: ['Request count'],
            type: 'line',
            formatter: number.compact
          }}
          renderPostChartContent={PluginDashboardsMarkerLanes}
        />
      </DashboardSection>
      <DashboardSection title="Batch get latency">
        <Chart
          snapshotId={snapshotId}
          timeConfig={timeConfig}
          y1={{
            min: 0,
            metrics: ['lat_batch_get_max', 'lat_batch_get_min', 'lat_batch_get_avg', 'lat_batch_get_sum'],
            labels: ['Maximum', 'Minimum', 'Average', 'Sum'],
            type: 'line',
            formatter: millis.detailed
          }}
          y2={{
            min: 0,
            metrics: ['lat_batch_get_sc'],
            labels: ['Request count'],
            type: 'line',
            formatter: number.compact
          }}
          renderPostChartContent={PluginDashboardsMarkerLanes}
        />
      </DashboardSection>
      <DashboardSection title="Batch write latency">
        <Chart
          snapshotId={snapshotId}
          timeConfig={timeConfig}
          y1={{
            min: 0,
            metrics: ['lat_batch_write_max', 'lat_batch_write_min', 'lat_batch_write_avg', 'lat_batch_write_sum'],
            labels: ['Maximum', 'Minimum', 'Average', 'Sum'],
            type: 'line',
            formatter: millis.detailed
          }}
          y2={{
            min: 0,
            metrics: ['lat_batch_write_sc'],
            labels: ['Request count'],
            type: 'line',
            formatter: number.compact
          }}
          renderPostChartContent={PluginDashboardsMarkerLanes}
        />
      </DashboardSection>

      <Columize>
        <DashboardSection title="Returned scan item count">
          <Chart
            snapshotId={snapshotId}
            timeConfig={timeConfig}
            y1={{
              min: 0,
              metrics: ['scan_ret_item_max', 'scan_ret_item_min', 'scan_ret_item_avg', 'scan_ret_item_sum'],
              labels: ['Maximum', 'Minimum', 'Average', 'Sum'],
              type: 'line',
              formatter: number.compact
            }}
            renderPostChartContent={PluginDashboardsMarkerLanes}
          />
        </DashboardSection>
        <DashboardSection title="Returned query item count">
          <Chart
            snapshotId={snapshotId}
            timeConfig={timeConfig}
            y1={{
              min: 0,
              metrics: ['query_ret_item_max', 'query_ret_item_min', 'query_ret_item_avg', 'query_ret_item_sum'],
              labels: ['Maximum', 'Minimum', 'Average', 'Sum'],
              type: 'line',
              formatter: number.compact
            }}
            renderPostChartContent={PluginDashboardsMarkerLanes}
          />
        </DashboardSection>
      </Columize>

      <Columize>
        <DashboardSection title="Conditional check failed">
          <Chart
            snapshotId={snapshotId}
            timeConfig={timeConfig}
            y1={{
              min: 0,
              metrics: ['con_check_fail'],
              labels: ['Count'],
              type: 'line',
              formatter: number.compact
            }}
            renderPostChartContent={PluginDashboardsMarkerLanes}
          />
        </DashboardSection>
        <DashboardSection title="User error">
          <Chart
            snapshotId={snapshotId}
            timeConfig={timeConfig}
            y1={{
              min: 0,
              metrics: ['user_err'],
              labels: ['Count'],
              type: 'line',
              formatter: number.compact
            }}
            renderPostChartContent={PluginDashboardsMarkerLanes}
          />
        </DashboardSection>
      </Columize>
      <Columize>
        <DashboardSection title="System errors write">
          <Chart
            snapshotId={snapshotId}
            timeConfig={timeConfig}
            y1={{
              min: 0,
              metrics: ['sys_err_put', 'sys_err_update', 'sys_err_delete', 'sys_err_batch_write'],
              labels: ['Put', 'Update', 'Delete', 'Batch write'],
              type: 'line',
              formatter: number.compact
            }}
            renderPostChartContent={PluginDashboardsMarkerLanes}
          />
        </DashboardSection>
        <DashboardSection title="System errors read">
          <Chart
            snapshotId={snapshotId}
            timeConfig={timeConfig}
            y1={{
              min: 0,
              metrics: ['sys_err_get', 'sys_err_scan', 'sys_err_query', 'sys_err_batch_get'],
              labels: ['Get', 'Scan', 'Query', 'Batch get'],
              type: 'line',
              formatter: number.compact
            }}
            renderPostChartContent={PluginDashboardsMarkerLanes}
          />
        </DashboardSection>
      </Columize>
      <DashboardSection title="TTL Deleted Item">
        <Chart
          snapshotId={snapshotId}
          timeConfig={timeConfig}
          y1={{
            min: 0,
            metrics: ['ttl'],
            labels: ['Count'],
            type: 'line',
            formatter: number.compact
          }}
          renderPostChartContent={PluginDashboardsMarkerLanes}
        />
      </DashboardSection>
    </div>
  );
}
