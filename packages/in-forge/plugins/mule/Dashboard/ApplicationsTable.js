/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import PluginDashboardsMarkerLanes from 'in-forge/PluginDashboardsMarkerLanes';
import Chart from 'in-components/Chart/InfrastructureMetricChartBehavior';
import { millis, number } from 'in-services/formatters/number';
import { yesOrNo } from 'in-services/formatters/boolean';
import { emptyList } from 'in-services/fixedImmutables';
import Table from 'in-sdk/components/dashboard/Table';
import { t } from 'in-i18n';

const cols = [
  {
    title: t('in-forge:plugins.mule.name'),
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.key;
      }
    }
  },
  {
    title: t('in-forge:plugins.mule.containerMode'),
    type: 'string',
    typeArgs: {
      getValue(row) {
        return yesOrNo(row.config.get('containerMode'));
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
        return `applications.${row.key}.processedEvents`;
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
        return `applications.${row.key}.executionErrors`;
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
        return `applications.${row.key}.fatalErrors`;
      },
      getContent: number.compact,
      getTimeWindowAggregation() {
        return 'sum';
      }
    }
  },
  {
    title: t('in-forge:plugins.mule.processingTtime'),
    type: 'metric',
    typeArgs: {
      getSnapshotId(row) {
        return row.snapshotId;
      },
      getMetricName(row) {
        return `applications.${row.key}.avgProcessingTime`;
      },
      getContent: millis.fixedCompact,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  },
  {
    title: t('in-forge:plugins.mule.shutdownTimeout'),
    type: 'number',
    typeArgs: {
      getValue(row) {
        return row.config.get('shutdownTimeout');
      },
      getContent(value) {
        return millis.compact(value);
      }
    }
  },
  {
    title: t('in-forge:plugins.mule.syncEventTimeout'),
    type: 'number',
    typeArgs: {
      getValue(row) {
        return row.config.get('synchronousEventTimeout');
      },
      getContent(value) {
        return millis.compact(value);
      }
    }
  },
  {
    title: t('in-forge:plugins.mule.transactionTimeout'),
    type: 'number',
    typeArgs: {
      getValue(row) {
        return row.config.get('transactionTimeout');
      },
      getContent(value) {
        return millis.compact(value);
      }
    }
  }
];

export default function ApplicationsTable({ snapshot, timeConfig }) {
  const data = snapshot.get('data');
  const rows = data
    .getIn(['configurations'], emptyList)
    .map((config, key) => {
      const app = data.getIn(['applications', key], emptyList);
      return {
        key,
        snapshotId: snapshot.get('id'),
        timeConfig: timeConfig,
        config,
        app
      };
    })
    .toArray();

  return (
    <Table
      withoutPadding
      cardTitle={t('in-forge:plugins.mule.applicationsWithCount', { len: rows.length })}
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
        metrics: [
          'applications.' + row.key + '.processedEvents',
          'applications.' + row.key + '.executionErrors',
          'applications.' + row.key + '.fatalErrors'
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
        metrics: ['applications.' + row.key + '.avgProcessingTime'],
        labels: [t('in-forge:plugins.mule.averagePprocessingTime')],
        formatter: millis.fixedCompact,
        type: 'line'
      }}
      renderPostChartContent={PluginDashboardsMarkerLanes}
    />
  );
}
