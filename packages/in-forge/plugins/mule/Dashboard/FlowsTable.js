/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import PluginDashboardsMarkerLanes from 'in-forge/PluginDashboardsMarkerLanes';
import Chart from 'in-components/Chart/InfrastructureMetricChartBehavior';
import { millis, number } from 'in-services/formatters/number';
import { emptyMap } from 'in-services/fixedImmutables';
import Table from 'in-sdk/components/dashboard/Table';
import { t } from 'in-i18n';

const cols = [
  {
    title: t('in-forge:plugins.mule.name'),
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.flowName;
      }
    }
  },
  {
    title: t('in-forge:plugins.mule.application'),
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.appName;
      }
    }
  },
  {
    title: t('in-forge:plugins.mule.processedEvents'),
    type: 'metric',
    typeArgs: {
      getSnapshotId(row) {
        return row.snapshotId;
      },
      getMetricName(row) {
        return `flows.${row.key}.processedEvents`;
      },
      getContent: number.compact,
      getTimeWindowAggregation() {
        return 'sum';
      }
    }
  },
  {
    title: t('in-forge:plugins.mule.executionErrors'),
    type: 'metric',
    typeArgs: {
      getSnapshotId(row) {
        return row.snapshotId;
      },
      getMetricName(row) {
        return `flows.${row.key}.executionErrors`;
      },
      getContent: number.compact,
      getTimeWindowAggregation() {
        return 'sum';
      }
    }
  },
  {
    title: t('in-forge:plugins.mule.fatalErrors'),
    type: 'metric',
    typeArgs: {
      getSnapshotId(row) {
        return row.snapshotId;
      },
      getMetricName(row) {
        return `flows.${row.key}.fatalErrors`;
      },
      getContent: number.compact,
      getTimeWindowAggregation() {
        return 'sum';
      }
    }
  },
  {
    title: t('in-forge:plugins.mule.processingTime'),
    type: 'metric',
    typeArgs: {
      getSnapshotId(row) {
        return row.snapshotId;
      },
      getMetricName(row) {
        return `flows.${row.key}.avgProcessingTime`;
      },
      getContent: millis.fixedCompact,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  }
];

export default function FlowsTable({ snapshot, timeConfig }) {
  const data = snapshot.get('data');
  const rows = data
    .getIn(['flowNames'], emptyMap)
    .map((appName, flowName) => {
      return {
        key: appName + '_' + flowName,
        appName,
        flowName,
        snapshotId: snapshot.get('id'),
        timeConfig: timeConfig
      };
    })
    .toArray();

  return (
    <Table
      withoutPadding
      cardTitle={t('in-forge:plugins.mule.flowsWithCount', { len: rows.length })}
      cols={cols}
      rows={rows}
      getRowDetails={getDetails}
    />
  );
}

function getDetails(row) {
  return (
    <Chart
      snapshotId={row.snapshotId}
      timeConfig={row.timeConfig}
      y1={{
        min: 0,
        metrics: [
          'flows.' + row.key + '.processedEvents',
          'flows.' + row.key + '.executionErrors',
          'flows.' + row.key + '.fatalErrors'
        ],
        labels: [
          t('in-forge:plugins.mule.processedEevents'),
          t('in-forge:plugins.mule.executionEerrors'),
          t('in-forge:plugins.mule.fatalEerrors')
        ],
        formatter: number.compact,
        tooltipFormatter: number.compact,
        type: 'line'
      }}
      y2={{
        min: 0,
        metrics: ['flows.' + row.key + '.avgProcessingTime'],
        labels: [t('in-forge:plugins.mule.averagePprocessingTime')],
        formatter: millis.fixedCompact,
        type: 'line'
      }}
      renderPostChartContent={PluginDashboardsMarkerLanes}
    />
  );
}
