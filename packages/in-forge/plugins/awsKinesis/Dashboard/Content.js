/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import GetMetricStatisticsInUse from 'in-forge/plugins/awsDynamoDb/GetMetricStatisticsInUse';
import PluginDashboardsMarkerLanes from 'in-forge/PluginDashboardsMarkerLanes';
import DashboardSection from 'in-sdk/components/dashboard/DashboardSection';
import Chart from 'in-components/Chart/InfrastructureMetricChartBehavior';
import { number, bytes, millis } from 'in-services/formatters/number';
import { t } from 'in-i18n';

export default function AwsKinesisDashboard({ snapshot, timeConfig }) {
  const snapshotId = snapshot.get('id');

  return (
    <div>
      <GetMetricStatisticsInUse snapshot={snapshot} />
      <DashboardSection title={t('in-forge:plugins.awsKinesis.titleGetRecords')}>
        <Chart
          snapshotId={snapshotId}
          timeConfig={timeConfig}
          y1={{
            min: 0,
            metrics: ['get_records_records', 'get_records_success'],
            labels: [
              t('in-forge:plugins.awsKinesis.labelGetRecordsRecords'),
              t('in-forge:plugins.awsKinesis.labelGetRecordsSuccess')
            ],
            type: 'line',
            formatter: number.compact
          }}
          renderPostChartContent={PluginDashboardsMarkerLanes}
        />
      </DashboardSection>
      <DashboardSection title={t('in-forge:plugins.awsKinesis.titlePutRecords')}>
        <Chart
          snapshotId={snapshotId}
          timeConfig={timeConfig}
          y1={{
            min: 0,
            metrics: ['put_records_records', 'put_records_success'],
            labels: [
              t('in-forge:plugins.awsKinesis.labelPutRecordsRecords'),
              t('in-forge:plugins.awsKinesis.labelPutRecordsSuccess')
            ],
            type: 'line',
            formatter: number.compact
          }}
          renderPostChartContent={PluginDashboardsMarkerLanes}
        />
      </DashboardSection>
      <DashboardSection title={t('in-forge:plugins.awsKinesis.titleGetRecordsPerformance')}>
        <Chart
          snapshotId={snapshotId}
          timeConfig={timeConfig}
          y1={{
            min: 0,
            metrics: ['get_records_age_ms'],
            labels: [t('in-forge:plugins.awsKinesis.labelGetRecordsAge')],
            type: 'line',
            formatter: millis.detailed
          }}
          y2={{
            min: 0,
            metrics: ['get_records_latency'],
            labels: [t('in-forge:plugins.awsKinesis.labelGetRecordsLatency')],
            type: 'line',
            formatter: millis.detailed
          }}
          renderPostChartContent={PluginDashboardsMarkerLanes}
        />
      </DashboardSection>
      <DashboardSection title={t('in-forge:plugins.awsKinesis.titleGetRecordsTraffic')}>
        <Chart
          snapshotId={snapshotId}
          timeConfig={timeConfig}
          y1={{
            min: 0,
            metrics: ['get_records_bytes'],
            labels: [t('in-forge:plugins.awsKinesis.labelGetRecordsTraffic')],
            type: 'line',
            formatter: bytes.compact
          }}
          renderPostChartContent={PluginDashboardsMarkerLanes}
        />
      </DashboardSection>
      <DashboardSection title={t('in-forge:plugins.awsKinesis.titlePutRecordPerformance')}>
        <Chart
          snapshotId={snapshotId}
          timeConfig={timeConfig}
          y1={{
            min: 0,
            metrics: ['put_record_latency'],
            labels: [t('in-forge:plugins.awsKinesis.labelPutRecordLatency')],
            type: 'line',
            formatter: millis.detailed
          }}
          y2={{
            min: 0,
            metrics: ['put_record_success'],
            labels: [t('in-forge:plugins.awsKinesis.labelPutRecordTraffic')],
            type: 'line',
            formatter: number.compact
          }}
          renderPostChartContent={PluginDashboardsMarkerLanes}
        />
      </DashboardSection>
      <DashboardSection title={t('in-forge:plugins.awsKinesis.titlePutRecordTraffic')}>
        <Chart
          snapshotId={snapshotId}
          timeConfig={timeConfig}
          y1={{
            min: 0,
            metrics: ['put_record_bytes'],
            labels: [t('in-forge:plugins.awsKinesis.labelPutRecordTraffic')],
            type: 'line',
            formatter: bytes.compact
          }}
          renderPostChartContent={PluginDashboardsMarkerLanes}
        />
      </DashboardSection>
      <DashboardSection title={t('in-forge:plugins.awsKinesis.titleIncomingRecords')}>
        <Chart
          snapshotId={snapshotId}
          timeConfig={timeConfig}
          y1={{
            min: 0,
            metrics: ['incoming_records'],
            labels: [t('in-forge:plugins.awsKinesis.labelIncomingRecords')],
            type: 'line',
            formatter: number.compact
          }}
          y2={{
            min: 0,
            metrics: ['incoming_bytes'],
            labels: [t('in-forge:plugins.awsKinesis.labelIncomingTraffic')],
            type: 'line',
            formatter: bytes.compact
          }}
          renderPostChartContent={PluginDashboardsMarkerLanes}
        />
      </DashboardSection>
      <DashboardSection title={t('in-forge:plugins.awsKinesis.titlePutRecordsPerformance')}>
        <Chart
          snapshotId={snapshotId}
          timeConfig={timeConfig}
          y1={{
            min: 0,
            metrics: ['put_records_latency'],
            labels: [t('in-forge:plugins.awsKinesis.labelPutRecordsLatency')],
            type: 'line',
            formatter: millis.detailed
          }}
          y2={{
            min: 0,
            metrics: ['put_records_bytes'],
            labels: [t('in-forge:plugins.awsKinesis.labelPutRecordsTraffic')],
            type: 'line',
            formatter: bytes.compact
          }}
          renderPostChartContent={PluginDashboardsMarkerLanes}
        />
      </DashboardSection>
      <DashboardSection title={t('in-forge:plugins.awsKinesis.titleProvisionedThroughputExceeded')}>
        <Chart
          snapshotId={snapshotId}
          timeConfig={timeConfig}
          y1={{
            min: 0,
            metrics: ['read_provisioned_throughput_exceeded', 'write_provisioned_throughput_exceeded'],
            labels: [
              t('in-forge:plugins.awsKinesis.labelReadProvisionedThroughputExceeded'),
              t('in-forge:plugins.awsKinesis.labelWriteProvisionedThroughputExceeded')
            ],
            type: 'line',
            formatter: number.compact
          }}
          renderPostChartContent={PluginDashboardsMarkerLanes}
        />
      </DashboardSection>
    </div>
  );
}
