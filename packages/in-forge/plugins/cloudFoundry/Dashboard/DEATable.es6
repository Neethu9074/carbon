import React from 'react';

import { zeroDecimalPlaces, percentageTwoDecimalPlaces } from 'in-services/formatters/number';
import DashboardSection from 'in-sdk/components/dashboard/DashboardSection';
import Chart from 'in-components/Chart';
import Table from 'in-sdk/components/dashboard/Table';

const cols = [
  {
    title: 'Available disk ratio',
    type: 'metric',
    typeArgs: {
      getSnapshotId(row) {
        return row.snapshotId;
      },
      getMetricName() {
        return 'dea.dea_available_disk_ratio';
      },
      getContent: percentageTwoDecimalPlaces,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  },
  {
    title: 'Available memory ratio',
    type: 'metric',
    typeArgs: {
      getSnapshotId(row) {
        return row.snapshotId;
      },
      getMetricName() {
        return 'dea.dea_available_memory_ratio';
      },
      getContent: percentageTwoDecimalPlaces,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  },
  {
    title: 'Born',
    type: 'metric',
    typeArgs: {
      getSnapshotId(row) {
        return row.snapshotId;
      },
      getMetricName() {
        return 'dea.dea_registry_born';
      },
      getContent: zeroDecimalPlaces,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  },
  {
    title: 'Crashed',
    type: 'metric',
    typeArgs: {
      getSnapshotId(row) {
        return row.snapshotId;
      },
      getMetricName() {
        return 'dea.dea_registry_crashed';
      },
      getContent: zeroDecimalPlaces,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  },
  {
    title: 'Evacuating',
    type: 'metric',
    typeArgs: {
      getSnapshotId(row) {
        return row.snapshotId;
      },
      getMetricName() {
        return 'dea.dea_registry_evacuating';
      },
      getContent: zeroDecimalPlaces,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  },
  {
    title: 'Running',
    type: 'metric',
    typeArgs: {
      getSnapshotId(row) {
        return row.snapshotId;
      },
      getMetricName() {
        return 'dea.dea_registry_running';
      },
      getContent: zeroDecimalPlaces,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  },
  {
    title: 'Starting',
    type: 'metric',
    typeArgs: {
      getSnapshotId(row) {
        return row.snapshotId;
      },
      getMetricName() {
        return 'dea.dea_registry_starting';
      },
      getContent: zeroDecimalPlaces,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  },
  {
    title: 'Stopped',
    type: 'metric',
    typeArgs: {
      getSnapshotId(row) {
        return row.snapshotId;
      },
      getMetricName() {
        return 'dea.dea_registry_stopped';
      },
      getContent: zeroDecimalPlaces,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  }
];

export default function DEATable({ snapshot, timeframe }) {
  const deaComponents = [''];

  const rows = deaComponents.map(component => {
    return {
      key: component,
      snapshotId: snapshot.get('id'),
      timeframe
    };
  });

  return (
    <DashboardSection title={`DEA (${rows.length})`}>
      <Table cols={cols} rows={rows} getRowDetails={getRowDetails} />
    </DashboardSection>
  );
}

function getRowDetails(row) {
  const snapshotId = row.snapshotId;
  return (
    <div>
      <DashboardSection title="Resources">
        <Chart
          snapshotId={snapshotId}
          timeframe={row.timeframe}
          margins={{
            left: 60
          }}
          y1={{
            formatter: percentageTwoDecimalPlaces,
            tooltipFormatter: percentageTwoDecimalPlaces,
            metrics: ['dea.dea_available_disk_ratio', 'dea.dea_available_memory_ratio'],
            labels: ['Available disk ratio', 'Available memory ratio'],
            type: 'line'
          }}
        />
      </DashboardSection>
      <DashboardSection title="Registry">
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
              'dea.dea_registry_born',
              'dea.dea_registry_crashed',
              'dea.dea_registry_evacuating',
              'dea.dea_registry_running',
              'dea.dea_registry_starting',
              'dea.dea_registry_stopped'
            ],
            labels: ['Born', 'Crashed', 'Evacuating', 'Running', 'Starting', 'Stopped'],
            type: 'line'
          }}
        />
      </DashboardSection>
    </div>
  );
}
