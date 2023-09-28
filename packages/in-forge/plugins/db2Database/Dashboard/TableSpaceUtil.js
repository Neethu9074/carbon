/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import Chart from 'in-infrastructure/components/InfrastructureMetricChartBehavior';
import PluginDashboardsMarkerLanes from 'in-forge/PluginDashboardsMarkerLanes';
import { percentage, kiloBytes, number } from 'in-services/formatters/number';
import { getRawPayloadWithTimestamp } from 'in-stores/snapshot';
import Table from 'in-sdk/components/dashboard/Table';
import connectTo from 'in-hoc/connectTo';
import { t } from 'in-i18n';

let snapshotMap = {};

const cols = [
  {
    title: t('in-forge:plugins.db2Database.tableSpaceName'),
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.key;
      }
    }
  },
  {
    title: t('in-forge:plugins.db2Database.autoResize'),
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.tableSpaceNames.get('autoResize');
      }
    }
  },
  {
    title: t('in-forge:plugins.db2Database.totalSize'),
    type: 'metric',
    typeArgs: {
      getSnapshotId(row) {
        return row.snapshotId;
      },
      getMetricName(row) {
        return `tablespaceutil.${row.key}.totalSize`;
      },
      getContent: kiloBytes.detailed,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  },
  {
    title: t('in-forge:plugins.db2Database.usedSpace'),
    type: 'metric',
    typeArgs: {
      getSnapshotId(row) {
        return row.snapshotId;
      },
      getMetricName(row) {
        return `tablespaceutil.${row.key}.usedSpace`;
      },
      getContent: kiloBytes.detailed,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  },
  {
    title: t('in-forge:plugins.db2Database.freeSpace'),
    type: 'metric',
    typeArgs: {
      getSnapshotId(row) {
        return row.snapshotId;
      },
      getMetricName(row) {
        return `tablespaceutil.${row.key}.freeSpace`;
      },
      getContent: kiloBytes.detailed,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  },
  {
    title: t('in-forge:plugins.db2Database.spaceUtilPercent'),
    type: 'metric',
    typeArgs: {
      getSnapshotId(row) {
        return row.snapshotId;
      },
      getMetricName(row) {
        return `tablespaceutil.${row.key}.spaceUtilPercent`;
      },
      getContent: percentage.detailed,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  },
  {
    title: t('in-forge:plugins.db2Database.tbspState'),
    type: 'metric',
    typeArgs: {
      getSnapshotId(row) {
        return row.snapshotId;
      },
      getMetricName(row) {
        return `tablespaceutil.${row.key}.tbspState`;
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
    snapshotMap = props;
    return {
      data: getRawPayloadWithTimestamp(props.snapshotId, 'tableSpaceNamesSense')
    };
  },
  function TableSpaceUtil({ data }) {
    if (!data) {
      return null;
    }
    const { snapshotId, timeConfig } = snapshotMap;
    const tableSpaceNamesPayload = data.get('raw_payload');
    const rows = tableSpaceNamesPayload
      .keySeq()
      .toArray()
      .map(key => {
        const tableSpaceNames = tableSpaceNamesPayload.get(key);
        return {
          key: String(key),
          snapshotId,
          timeConfig,
          tableSpaceNames
        };
      });
    if (rows.length === 0) {
      return null;
    }
    const getDetails = row => {
      if (!snapshotMap?.timeConfig) {
        return;
      }
      return (
        <div>
          <Chart
            snapshotId={snapshotId}
            timeConfig={timeConfig}
            y1={{
              min: 0,
              formatter: kiloBytes.detailed,
              metrics: [
                'tablespaceutil.' + row.key + '.totalSize',
                'tablespaceutil.' + row.key + '.usedSpace',
                'tablespaceutil.' + row.key + '.freeSpace'
              ],
              labels: [
                t('in-forge:plugins.db2Database.totalSize'),
                t('in-forge:plugins.db2Database.usedSpace'),
                t('in-forge:plugins.db2Database.freeSpace')
              ],
              type: 'line'
            }}
            y2={{
              min: 0,
              formatter: percentage.detailed,
              metrics: ['tablespaceutil.' + row.key + '.spaceUtilPercent'],
              labels: [t('in-forge:plugins.db2Database.spaceUtilPercent')],
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
        cardTitle={t('in-forge:plugins.db2Database.dashboard.tableSpaceUtil', { len: rows.length })}
        cols={cols}
        rows={rows}
        initialSortColumn={2}
        initialSortDirection="desc"
        getRowDetails={getDetails}
      />
    );
  }
);
