import React from 'react';

import { millis, number, percentagePlain } from 'in-services/formatters/number';
import DashboardSection from 'in-sdk/components/dashboard/DashboardSection';
import { formatDateTime } from 'in-services/formatters/date';
import { emptyList } from 'in-services/fixedImmutables';
import Table from 'in-sdk/components/dashboard/Table';
import Chart from 'in-components/Chart';

const cols = [
  {
    title: 'Name',
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.key;
      }
    }
  },
  {
    title: 'Type',
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.type;
      }
    }
  },
  {
    title: 'Last build number',
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
    title: 'Last build status',
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
    title: 'Recent builds health',
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
  },
  {
    title: 'Last build duration',
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
    title: 'Last build estimated duration',
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
    title: 'Last build started at',
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
        description: job.get('description'),
        snapshot,
        snapshotId,
        timeConfig
      };
    });

  if (rows.length === 0) {
    return null;
  }

  return (
    <DashboardSection title={`Jobs (${rows.length})`}>
      <Table cols={cols} rows={rows} getRowDetails={getDetails} />
    </DashboardSection>
  );
}

function getDetails(row) {
  return (
    <DashboardSection title={`Builds`}>
      <Chart
        snapshotId={row.snapshotId}
        timeConfig={row.timeConfig}
        y1={{
          min: 0,
          metrics: ['jobs.' + row.key + '.lastBuildNumber'],
          labels: ['Last Build Number'],
          type: 'line',
          formatter: number.compact
        }}
        y2={{
          min: 0,
          metrics: ['jobs.' + row.key + '.lastBuildDuration'],
          labels: ['Last Build Duration'],
          type: 'line',
          formatter: millis.detailed
        }}
      />
    </DashboardSection>
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
      return 'Disabled';
    case 2:
      return 'Aborted';
    case 3:
      return 'Not Built';
    case 4:
      return 'Unstable';
    case 5:
      return 'Success';
    case 6:
      return 'Unstable';
    case 7:
      return 'Failed';
    default:
      return 'In Progress';
  }
}
