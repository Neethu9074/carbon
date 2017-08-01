import React from 'react';

import DashboardSection from 'in-sdk/components/dashboard/DashboardSection';
import { zeroDecimalPlaces } from 'in-services/formatters/number';
import Chart from 'in-components/Chart';
import Table from 'in-sdk/components/dashboard/Table';

const cols = [
  {
    title: 'Requests completed',
    type: 'metric',
    typeArgs: {
      getSnapshotId(row) {
        return row.snapshotId;
      },
      getMetricName() {
        return 'cloud_controller.cc_requests_completed';
      },
      getContent: zeroDecimalPlaces,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  },
  {
    title: 'Requests outstanding',
    type: 'metric',
    typeArgs: {
      getSnapshotId(row) {
        return row.snapshotId;
      },
      getMetricName() {
        return 'cloud_controller.cc_requests_outstanding';
      },
      getContent: zeroDecimalPlaces,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  },
  {
    title: 'Total users',
    type: 'metric',
    typeArgs: {
      getSnapshotId(row) {
        return row.snapshotId;
      },
      getMetricName() {
        return 'cloud_controller.cc_total_users';
      },
      getContent: zeroDecimalPlaces,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  },
  {
    title: 'Thread count',
    type: 'metric',
    typeArgs: {
      getSnapshotId(row) {
        return row.snapshotId;
      },
      getMetricName() {
        return 'cloud_controller.cc_thread_count';
      },
      getContent: zeroDecimalPlaces,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  },
  {
    title: 'Total failed jobs',
    type: 'metric',
    typeArgs: {
      getSnapshotId(row) {
        return row.snapshotId;
      },
      getMetricName() {
        return 'cloud_controller.cc_total_failed_job_count';
      },
      getContent: zeroDecimalPlaces,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  }
];

export default function CloudControllerTable({ snapshot, timeframe }) {
  const ccComponents = [''];

  const rows = ccComponents.map(app => {
    return {
      key: app,
      snapshotId: snapshot.get('id'),
      timeframe
    };
  });

  return (
    <DashboardSection title={`Cloud Controller (${rows.length})`}>
      <Table cols={cols} rows={rows} getRowDetails={getRowDetails} />
    </DashboardSection>
  );
}

function getRowDetails(row) {
  const snapshotId = row.snapshotId;

  return (
    <div>
      <DashboardSection title="Requests">
        <Chart
          snapshotId={snapshotId}
          timeframe={row.timeframe}
          margins={{
            left: 60
          }}
          y1={{
            formatter: zeroDecimalPlaces,
            tooltipFormatter: zeroDecimalPlaces,
            metrics: ['cloud_controller.cc_requests_completed', 'cloud_controller.cc_requests_outstanding'],
            labels: ['Requests completed', 'Requests outstanding'],
            type: 'line'
          }}
        />
      </DashboardSection>
      <DashboardSection title="Statistics">
        <Chart
          snapshotId={snapshotId}
          timeframe={row.timeframe}
          margins={{
            left: 60
          }}
          y1={{
            formatter: zeroDecimalPlaces,
            tooltipFormatter: zeroDecimalPlaces,
            metrics: [
              'cloud_controller.cc_total_users',
              'cloud_controller.cc_thread_count',
              'cloud_controller.cc_total_failed_job_count'
            ],
            labels: ['Total users', 'Thread count', 'Total failed jobs'],
            type: 'line'
          }}
        />
      </DashboardSection>
    </div>
  );
}
