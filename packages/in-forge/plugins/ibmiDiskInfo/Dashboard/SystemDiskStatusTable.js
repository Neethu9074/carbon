/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React from 'react';

import { bytes, number, percentage, withSiMultiplyPrefixThreeDecimalPlaces } from 'in-services/formatters/number';
import TimeOfLastUpdateCardTitle from 'in-sdk/components/dashboard/TimeOfLastUpdateCardTitle';
import Chart from 'in-infrastructure/components/InfrastructureMetricChartBehavior';
import PluginDashboardsMarkerLanes from 'in-forge/PluginDashboardsMarkerLanes';
import { getRawPayloadWithTimestamp } from 'in-stores/snapshot';
import Columize from 'in-sdk/components/dashboard/Columize';
import Table from 'in-sdk/components/dashboard/Table';
import connectTo from 'in-hoc/connectTo';
import { t } from 'in-i18n';

const cols = [
  {
    title: t('in-forge:plugins.ibmiDiskInfo.dashboard.tables.systemDiskStatus.resourceName'),
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.systemDiskStatusRawData.get('resourceName');
      }
    }
  },
  {
    title: t('in-forge:plugins.ibmiDiskInfo.dashboard.tables.systemDiskStatus.diskType'),
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.systemDiskStatusRawData.get('diskType');
      }
    }
  },
  {
    title: t('in-forge:plugins.ibmiDiskInfo.dashboard.tables.systemDiskStatus.aspNumber'),
    type: 'number',
    typeArgs: {
      getValue(row) {
        return row.systemDiskStatusRawData.get('aspNumber');
      },
      getContent: number.compact
    }
  },
  {
    title: t('in-forge:plugins.ibmiDiskInfo.dashboard.tables.systemDiskStatus.unitNumber'),
    type: 'number',
    typeArgs: {
      getValue(row) {
        return row.systemDiskStatusRawData.get('unitNumber');
      },
      getContent: number.compact
    }
  },
  {
    title: t('in-forge:plugins.ibmiDiskInfo.dashboard.tables.systemDiskStatus.percentUsed'),
    type: 'metric',
    typeArgs: {
      getSnapshotId(row) {
        return row.snapshotId;
      },
      getMetricName(row) {
        return `systemDiskStatusMetrics.${row.key}.percentUsed`;
      },
      getContent: percentage.compact,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  },
  {
    title: t('in-forge:plugins.ibmiDiskInfo.dashboard.tables.systemDiskStatus.typeOfDiskUnit'),
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.systemDiskStatusRawData.get('typeOfDiskUnit');
      }
    }
  }
];

export default connectTo(
  props => {
    const { snapshotId } = props;
    return {
      data: getRawPayloadWithTimestamp(snapshotId, 'systemDiskStatusRawPayload')
    };
  },
  function SystemDiskStatusTable({ data, snapshotId, timeConfig }) {
    if (!data || !data.get('raw_payload')) {
      return null;
    }
    const systemDiskStatusRawPayload = data.get('raw_payload');
    if (systemDiskStatusRawPayload.size === 0) {
      return null;
    }

    const rows = systemDiskStatusRawPayload
      .map((systemDiskStatusRawData, key) => {
        return {
          key,
          systemDiskStatusRawData,
          timeConfig,
          snapshotId
        };
      })
      .valueSeq()
      .toArray();

    return (
      <Table
        withoutPadding
        cardTitle={
          <TimeOfLastUpdateCardTitle
            title={t('in-forge:plugins.ibmiDiskInfo.dashboard.tables.systemDiskStatus.name')}
            timestamp={data.get('timestamp')}
          />
        }
        cols={cols}
        rows={rows}
        initialSortColumn={4}
        initialSortDirection="desc"
        getRowDetails={getRowDetails}
      />
    );
  }
);

function getRowDetails(row) {
  const snapshotId = row.snapshotId;
  const timeConfig = row.timeConfig;

  return (
    <div>
      <Chart
        snapshotId={snapshotId}
        timeConfig={timeConfig}
        y1={{
          formatter: percentage.compact,
          metrics: ['systemDiskStatusMetrics.' + row.key + '.elapsedPercentBusy'],
          labels: [t('in-forge:plugins.ibmiDiskInfo.dashboard.elapsedPercentBusy')],
          min: 0,
          type: 'line'
        }}
        renderPostChartContent={PluginDashboardsMarkerLanes}
      />
      <div style={{ paddingTop: '1.5rem' }}>
        <Columize>
          <Chart
            snapshotId={snapshotId}
            timeConfig={timeConfig}
            y1={{
              formatter: withSiMultiplyPrefixThreeDecimalPlaces,
              tooltipFormatter: withSiMultiplyPrefixThreeDecimalPlaces,
              metrics: [
                'systemDiskStatusMetrics.' + row.key + '.elapsedReadRequests',
                'systemDiskStatusMetrics.' + row.key + '.elapsedWriteRequests'
              ],
              labels: [
                t('in-forge:plugins.ibmiDiskInfo.dashboard.elapsedReadRequests'),
                t('in-forge:plugins.ibmiDiskInfo.dashboard.elapsedWriteRequests')
              ],
              min: 0,
              type: 'line'
            }}
            renderPostChartContent={PluginDashboardsMarkerLanes}
          />
          <Chart
            snapshotId={snapshotId}
            timeConfig={timeConfig}
            y1={{
              formatter: bytes.perSecond.detailed,
              tooltipFormatter: bytes.perSecond.detailed,
              metrics: [
                'systemDiskStatusMetrics.' + row.key + '.elapsedDataRead',
                'systemDiskStatusMetrics.' + row.key + '.elapsedDataWritten'
              ],
              labels: [
                t('in-forge:plugins.ibmiDiskInfo.dashboard.elapsedDataRead'),
                t('in-forge:plugins.ibmiDiskInfo.dashboard.elapsedDataWritten')
              ],
              min: 0,
              type: 'line'
            }}
            renderPostChartContent={PluginDashboardsMarkerLanes}
          />
        </Columize>
      </div>
    </div>
  );
}
