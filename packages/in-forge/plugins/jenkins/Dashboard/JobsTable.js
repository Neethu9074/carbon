/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import { millis, number, percentagePlain } from 'in-services/formatters/number';
import PluginDashboardsMarkerLanes from 'in-forge/PluginDashboardsMarkerLanes';
import Chart from 'in-components/Chart/InfrastructureMetricChartBehavior';
import { formatDateTime } from 'in-services/formatters/date';
import { emptyList } from 'in-services/fixedImmutables';
import Table from 'in-sdk/components/dashboard/Table';
import { t } from 'in-i18n';

const cols = [
  {
    title: t('in-forge:plugins.jenkins.name'),
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.key;
      }
    }
  },
  {
    title: t('in-forge:plugins.jenkins.type'),
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.type;
      }
    }
  },
  {
    title: t('in-forge:plugins.jenkins.lastBuild'),
    type: 'metric',
    typeArgs: {
      getSnapshotId(row) {
        return row.snapshotId;
      },
      getMetricName(row) {
        return `jobs.${row.key}.lastBuildNumber`;
      },
      getContent: number.compact,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  },
  {
    title: t('in-forge:plugins.jenkins.status'),
    type: 'metric',
    typeArgs: {
      getSnapshotId(row) {
        return row.snapshotId;
      },
      getMetricName(row) {
        return `jobs.${row.key}.lastBuildStatus`;
      },
      getContent(value) {
        return getStatusText(value);
      },
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  },
  {
    title: t('in-forge:plugins.jenkins.duration'),
    type: 'metric',
    typeArgs: {
      getSnapshotId(row) {
        return row.snapshotId;
      },
      getMetricName(row) {
        return `jobs.${row.key}.lastBuildDuration`;
      },
      getContent: millis.detailed,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  },
  {
    title: t('in-forge:plugins.jenkins.estimatedDuration'),
    type: 'metric',
    typeArgs: {
      getSnapshotId(row) {
        return row.snapshotId;
      },
      getMetricName(row) {
        return `jobs.${row.key}.lastBuildEstimatedDuration`;
      },
      getContent: millis.detailed,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  },
  {
    title: t('in-forge:plugins.jenkins.started'),
    type: 'metric',
    typeArgs: {
      getSnapshotId(row) {
        return row.snapshotId;
      },
      getMetricName(row) {
        return `jobs.${row.key}.lastBuildTimestamp`;
      },
      getContent: formatDateTime,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  },
  {
    title: t('in-forge:plugins.jenkins.healthScore'),
    type: 'metric',
    typeArgs: {
      getSnapshotId(row) {
        return row.snapshotId;
      },
      getMetricName(row) {
        return `jobs.${row.key}.healthScore`;
      },
      getContent: percentagePlain.compact,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  }
];

export default function JobsTable({ snapshot, timeConfig }) {
  const snapshotId = snapshot.get('id');

  const rows = snapshot
    .getIn(['data', 'jobNames'], emptyList)
    .toArray()
    .map(job => {
      return {
        key: job.get('name'),
        type: job.get('type'),
        snapshotId,
        timeConfig
      };
    });

  return (
    <Table
      withoutPadding
      cardTitle={t('in-forge:plugins.jenkins.jobsWithCount', { len: rows.length })}
      cols={cols}
      rows={rows}
      maxItemsPerPage={15}
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
        metrics: ['jobs.' + row.key + '.lastBuildNumber'],
        labels: [t('in-forge:plugins.jenkins.lastBuildNumber')],
        type: 'line',
        formatter: number.compact
      }}
      y2={{
        min: 0,
        metrics: ['jobs.' + row.key + '.lastBuildDuration'],
        labels: [t('in-forge:plugins.jenkins.lastBuildDuration')],
        type: 'line',
        formatter: millis.detailed
      }}
      renderPostChartContent={PluginDashboardsMarkerLanes}
    />
  );
}

/*
  Backend jenkins state enums:
  red_anime(-7)
  yellow_anime(-6)
  blue_anime(-5)
  grey_anime(-4)
  notbuilt_anime(-3)
  aborted_anime(-2)
  disabled_anime(-1)
  disabled(1)
  aborted(2)
  notbuilt(3)
  grey(4)
  blue(5)
  yellow(6)
  red(7)
 */
function getStatusText(state) {
  switch (state) {
    case 1:
      return t('in-forge:plugins.jenkins.disabled');
    case 2:
      return t('in-forge:plugins.jenkins.aborted');
    case 3:
      return t('in-forge:plugins.jenkins.notBuilt');
    case 4:
      return t('in-forge:plugins.jenkins.unstable');
    case 5:
      return t('in-forge:plugins.jenkins.success');
    case 6:
      return t('in-forge:plugins.jenkins.unstable');
    case 7:
      return t('in-forge:plugins.jenkins.failed');
    default:
      return t('in-forge:plugins.jenkins.inProgress');
  }
}
