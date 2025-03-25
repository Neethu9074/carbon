/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import TimeOfLastUpdateCardTitle from 'in-sdk/components/dashboard/TimeOfLastUpdateCardTitle';
import Chart from 'in-infrastructure/components/InfrastructureMetricChartBehavior';
import PluginDashboardsMarkerLanes from 'in-forge/PluginDashboardsMarkerLanes';
import { getRawPayloadWithTimestamp } from 'in-stores/snapshot';
import { number } from 'in-services/formatters/number';
import Table from 'in-sdk/components/dashboard/Table';
import connectTo from 'in-hoc/connectTo';
import { t } from 'in-i18n';

const JobQueueStatusEnum = jobType => {
  switch (jobType) {
    case 1:
      return 'HELD';
    case 2:
      return 'RELEASED';
    default:
      return '-';
  }
};

const cols = [
  {
    title: t('in-forge:plugins.ibmIOs.dashboard.tables.jobQueue.jobQueueName'),
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.jobQueueStringData.get('jobQueueName');
      }
    }
  },
  {
    title: t('in-forge:plugins.ibmIOs.dashboard.tables.jobQueue.jobQueueLibrary'),
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.jobQueueStringData.get('jobQueueLibrary');
      }
    }
  },
  {
    title: t('in-forge:plugins.ibmIOs.dashboard.tables.jobQueue.subsystemName'),
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.jobQueueStringData.get('subsystemName');
      }
    }
  },
  {
    title: t('in-forge:plugins.ibmIOs.dashboard.tables.jobQueue.subsystemLibraryName'),
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.jobQueueStringData.get('subsystemLibraryName');
      }
    }
  },
  {
    title: t('in-forge:plugins.ibmIOs.dashboard.tables.jobQueue.numberOfJobs'),
    type: 'metric',
    typeArgs: {
      getSnapshotId(row) {
        return row.snapshotId;
      },
      getMetricName(row) {
        return `jobQueueMetrics.${row.key}.numberOfJobs`;
      },
      getContent: number.compact,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  },
  {
    title: t('in-forge:plugins.ibmIOs.dashboard.tables.jobQueue.activeJobs'),
    type: 'metric',
    typeArgs: {
      getSnapshotId(row) {
        return row.snapshotId;
      },
      getMetricName(row) {
        return `jobQueueMetrics.${row.key}.activeJobs`;
      },
      getContent: number.compact,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  },
  {
    title: t('in-forge:plugins.ibmIOs.dashboard.tables.jobQueue.maximumActiveJobs'),
    type: 'metric',
    typeArgs: {
      getSnapshotId(row) {
        return row.snapshotId;
      },
      getMetricName(row) {
        return `jobQueueMetrics.${row.key}.maximumActiveJobs`;
      },
      getContent: number.compact,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  },
  {
    title: t('in-forge:plugins.ibmIOs.dashboard.tables.jobQueue.jobQueueStatus'),
    type: 'metric',
    typeArgs: {
      getSnapshotId(row) {
        return row.snapshotId;
      },
      getMetricName(row) {
        return `jobQueueMetrics.${row.key}.jobQueueStatus`;
      },
      getContent: JobQueueStatusEnum,
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
      data: getRawPayloadWithTimestamp(snapshotId, 'jobQueueInfoMap')
    };
  },
  function jobQueueTable({ data, snapshotId, timeConfig }) {
    if (!data || !data.get('raw_payload')) {
      return null;
    }
    const jobQueueInfoMap = data.get('raw_payload');
    if (jobQueueInfoMap.size === 0) {
      return null;
    }

    const rows = jobQueueInfoMap
      .map((jobQueueStringData, key) => {
        return {
          key,
          jobQueueStringData,
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
            title={t('in-forge:plugins.ibmIOs.dashboard.tables.jobQueue.name')}
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
      <p>
        <label>
          <strong>{t('in-forge:plugins.ibmIOs.dashboard.tables.jobQueue.charts.textDescription')}</strong>
          {' : '}
        </label>
        {row.jobQueueStringData.get('textDescription')}
      </p>
      <Chart
        snapshotId={snapshotId}
        timeConfig={timeConfig}
        y1={{
          formatter: number.compact,
          metrics: [
            'jobQueueMetrics.' + row.key + '.heldJobs',
            'jobQueueMetrics.' + row.key + '.releasedJobs',
            'jobQueueMetrics.' + row.key + '.scheduledJobs'
          ],
          labels: [
            t('in-forge:plugins.ibmIOs.dashboard.tables.jobQueue.charts.heldJobs'),
            t('in-forge:plugins.ibmIOs.dashboard.tables.jobQueue.charts.releasedJobs'),
            t('in-forge:plugins.ibmIOs.dashboard.tables.jobQueue.charts.scheduledJobs')
          ],
          min: 0,
          type: 'line'
        }}
        renderPostChartContent={PluginDashboardsMarkerLanes}
      />
    </div>
  );
}
