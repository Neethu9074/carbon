/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React from 'react';

import Chart from 'in-infrastructure/components/InfrastructureMetricChartBehavior';
import PluginDashboardsMarkerLanes from 'in-forge/PluginDashboardsMarkerLanes';
import { getRawPayloadWithTimestamp } from 'in-stores/snapshot';
import { bytes } from 'in-services/formatters/number';
import Table from 'in-sdk/components/dashboard/Table';
import connectTo from 'in-hoc/connectTo';
import { t } from 'in-i18n';

let snapshotMap = {};

const cols = [
  {
    title: t('in-sap:dashboards.entryID'),
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.memoryStats.get('entryID');
      }
    }
  },
  {
    title: t('in-sap:dashboards.totalMemory'),
    type: 'number',
    typeArgs: {
      getSnapshotId(row) {
        return row.snapshotId;
      },
      getValue(row) {
        return row.memoryStats.get('memSum');
      },
      getContent: bytes.compact,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  },
  {
    title: t('in-sap:dashboards.heapMemory'),
    type: 'number',
    typeArgs: {
      getSnapshotId(row) {
        return row.snapshotId;
      },
      getValue(row) {
        return row.memoryStats.get('privsum');
      },
      getContent: bytes.compact,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  },
  {
    title: t('in-sap:dashboards.usedBytes'),
    type: 'number',
    typeArgs: {
      getSnapshotId(row) {
        return row.snapshotId;
      },
      getValue(row) {
        return row.memoryStats.get('usedBytes');
      },
      getContent: bytes.compact,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  },
  {
    title: t('in-sap:dashboards.maxBytes'),
    type: 'number',
    typeArgs: {
      getSnapshotId(row) {
        return row.snapshotId;
      },
      getValue(row) {
        return row.memoryStats.get('maxBytes');
      },
      getContent: bytes.compact,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  }
];

export default connectTo(
  props => {
    snapshotMap = props;
    return {
      data: getRawPayloadWithTimestamp(props.snapshotId, 'memoryStats')
    };
  },
  function TotalMemory({ data }) {
    if (!data) {
      return null;
    }

    const { snapshotId, timeConfig } = snapshotMap;
    const memoryStat = data.get('raw_payload', []);
    const rows = memoryStat
      .keySeq()
      .toArray()
      .map(key => {
        const memoryStats = memoryStat.get(key);
        return {
          key: String(key),
          snapshotId,
          timeConfig,
          memoryStats
        };
      });

    const getDetails = row => {
      if (!snapshotMap?.timeConfig) {
        return;
      }
      return (
        <div>
          <Chart
            snapshotId={row.snapshotId}
            timeConfig={row.timeConfig}
            y1={{
              min: 0,
              formatter: bytes.compact,
              metrics: [
                'memoryStats.' + row.key + '.memSum',
                'memoryStats.' + row.key + '.privsum',
                'memoryStats.' + row.key + '.usedBytes',
                'memoryStats.' + row.key + '.maxBytes'
              ],
              labels: [
                t('in-sap:dashboards.totalMemory'),
                t('in-sap:dashboards.heapMemory'),
                t('in-sap:dashboards.usedBytes'),
                t('in-sap:dashboards.maxBytes')
              ],
              type: 'line'
            }}
            renderPostChartContent={PluginDashboardsMarkerLanes}
          />
        </div>
      );
    };
    return (
      <Table
        withoutPadding
        cardTitle={t('in-sap:dashboards.memoryStats')}
        cols={cols}
        rows={rows}
        initialSortColumn={0}
        initialSortDirection="asc"
        getRowDetails={getDetails}
      />
    );
  }
);
