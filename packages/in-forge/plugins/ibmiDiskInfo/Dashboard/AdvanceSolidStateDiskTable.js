/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React from 'react';

import { number, percentage, bytes, withSiMultiplyPrefixThreeDecimalPlaces } from 'in-services/formatters/number';
import Chart from 'in-infrastructure/components/InfrastructureMetricChartBehavior';
import PluginDashboardsMarkerLanes from 'in-forge/PluginDashboardsMarkerLanes';
import { getRawPayloadWithTimestamp } from 'in-stores/snapshot';
import Columize from 'in-sdk/components/dashboard/Columize';
import Table from 'in-sdk/components/dashboard/Table';
import connectTo from 'in-hoc/connectTo';
import { t } from 'in-i18n';

const cols = [
  {
    title: t('in-forge:plugins.ibmiDiskInfo.dashboard.tables.solidStateDisk.resourceName'),
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.solidStateDiskRawData.get('resourceName');
      }
    }
  },
  {
    title: t('in-forge:plugins.ibmiDiskInfo.dashboard.tables.solidStateDisk.unitNumber'),
    type: 'metric',
    typeArgs: {
      getSnapshotId(row) {
        return row.snapshotId;
      },
      getMetricName(row) {
        return `advanceSolidStateDiskMetrics.${row.key}.unitNumber`;
      },
      getContent: number.compact,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  },
  {
    title: t('in-forge:plugins.ibmiDiskInfo.dashboard.tables.solidStateDisk.aspNumber'),
    type: 'metric',
    typeArgs: {
      getSnapshotId(row) {
        return row.snapshotId;
      },
      getMetricName(row) {
        return `advanceSolidStateDiskMetrics.${row.key}.aspNumber`;
      },
      getContent: number.compact,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  },

  {
    title: t('in-forge:plugins.ibmiDiskInfo.dashboard.tables.solidStateDisk.serialNumber'),
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.solidStateDiskRawData.get('serialNumber');
      }
    }
  },
  {
    title: t('in-forge:plugins.ibmiDiskInfo.dashboard.tables.solidStateDisk.ssdPFAWarning'),
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.solidStateDiskRawData.get('ssdPFAWarning');
      }
    }
  },
  {
    title: t('in-forge:plugins.ibmiDiskInfo.dashboard.tables.solidStateDisk.ssdReadWriteProtected'),
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.solidStateDiskRawData.get('ssdReadWriteProtected');
      }
    }
  },
  {
    title: t('in-forge:plugins.ibmiDiskInfo.dashboard.tables.solidStateDisk.ssdPowerOnDays'),
    type: 'metric',
    typeArgs: {
      getSnapshotId(row) {
        return row.snapshotId;
      },
      getMetricName(row) {
        return `advanceSolidStateDiskMetrics.${row.key}.ssdPowerOnDays`;
      },
      getContent: number.compact,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  }
];

export default connectTo(
  props => {
    const { snapshotId } = props;
    return {
      data: getRawPayloadWithTimestamp(snapshotId, 'advanceSolidStateDiskRawPayload')
    };
  },
  function AdvancedSolidStateDiskTable({ data, snapshotId, timeConfig }) {
    if (!data || !data.get('raw_payload')) {
      return null;
    }
    const advanceSolidStateDiskRawPayload = data.get('raw_payload');
    if (advanceSolidStateDiskRawPayload.size === 0) {
      return null;
    }

    const rows = advanceSolidStateDiskRawPayload
      .map((solidStateDiskRawData, key) => {
        return {
          key,
          solidStateDiskRawData,
          timeConfig,
          snapshotId
        };
      })
      .valueSeq()
      .toArray();

    return (
      <Table
        withoutPadding
        cardTitle={t('in-forge:plugins.ibmiDiskInfo.dashboard.tables.solidStateDisk.name')}
        cols={cols}
        rows={rows}
        initialSortColumn={0}
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
      <Columize>
        <Chart
          snapshotId={snapshotId}
          timeConfig={timeConfig}
          y1={{
            formatter: percentage.detailed,
            metrics: [
              'advanceSolidStateDiskMetrics.' + row.key + '.ssdLifeRemaining',
              'advanceSolidStateDiskMetrics.' + row.key + '.percentUsed'
            ],
            labels: [
              t('in-forge:plugins.ibmiDiskInfo.dashboard.tables.solidStateDisk.ssdLifeRemaining'),
              [t('in-forge:plugins.ibmiDiskInfo.dashboard.tables.solidStateDisk.percentUsed')]
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
            formatter: bytes.detailed,
            metrics: [
              'advanceSolidStateDiskMetrics.' + row.key + '.ssdSupportedBytesWritten',
              'advanceSolidStateDiskMetrics.' + row.key + '.ssdBytesWritten'
            ],
            labels: [
              t('in-forge:plugins.ibmiDiskInfo.dashboard.tables.solidStateDisk.ssdSupportedBytesWritten'),
              [t('in-forge:plugins.ibmiDiskInfo.dashboard.tables.solidStateDisk.ssdBytesWritten')]
            ],
            min: 0,
            type: 'line'
          }}
          renderPostChartContent={PluginDashboardsMarkerLanes}
        />
      </Columize>
      <div style={{ paddingTop: '1.5rem' }}>
        <Columize>
          <Chart
            snapshotId={snapshotId}
            timeConfig={timeConfig}
            y1={{
              formatter: withSiMultiplyPrefixThreeDecimalPlaces,
              tooltipFormatter: withSiMultiplyPrefixThreeDecimalPlaces,
              metrics: [
                'advanceSolidStateDiskMetrics.' + row.key + '.elapsedReadRequests',
                'advanceSolidStateDiskMetrics.' + row.key + '.elapsedWriteRequests'
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
                'advanceSolidStateDiskMetrics.' + row.key + '.elapsedDataRead',
                'advanceSolidStateDiskMetrics.' + row.key + '.elapsedDataWritten'
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
