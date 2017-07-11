import React from 'react';

import { zeroDecimalPlaces, bytesZeroDecimalPlaces } from 'in-services/formatters/number';
import DashboardSection from 'in-sdk/components/dashboard/DashboardSection';
import TwoColumnRow from 'in-sdk/components/dashboard/TwoColumnRow';
import Chart from 'in-components/Chart'
import Table from 'in-sdk/components/dashboard/Table';

const cols = [
  {
    title: 'Routines',
    type: 'metric',
    typeArgs: {
      getSnapshotId(row) {
        return row.snapshotId;
      },
      getMetricName() {
        return 'hm.hm_api_num_go_routines';
      },
      getContent: zeroDecimalPlaces,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  },
  {
    title: 'Allocated',
    type: 'metric',
    typeArgs: {
      getSnapshotId(row) {
        return row.snapshotId;
      },
      getMetricName() {
        return 'hm.hm_api_bytes_allocated';
      },
      getContent: bytesZeroDecimalPlaces,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  },
  {
    title: 'Allocated heap',
    type: 'metric',
    typeArgs: {
      getSnapshotId(row) {
        return row.snapshotId;
      },
      getMetricName() {
        return 'hm.hm_api_bytes_allocated_heap';
      },
      getContent: bytesZeroDecimalPlaces,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  },
  {
    title: 'Allocated stack',
    type: 'metric',
    typeArgs: {
      getSnapshotId(row) {
        return row.snapshotId;
      },
      getMetricName() {
        return 'hm.hm_api_bytes_allocated_stack';
      },
      getContent: bytesZeroDecimalPlaces,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  },
  {
    title: 'Crashed indices',
    type: 'metric',
    typeArgs: {
      getSnapshotId(row) {
        return row.snapshotId;
      },
      getMetricName() {
        return 'hm.hm_analyzer_num_crashed_indices';
      },
      getContent: zeroDecimalPlaces,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  },
  {
    title: 'Crashed instances',
    type: 'metric',
    typeArgs: {
      getSnapshotId(row) {
        return row.snapshotId;
      },
      getMetricName() {
        return 'hm.hm_analyzer_num_crashed_instances';
      },
      getContent: zeroDecimalPlaces,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  },
  {
    title: 'Missing indices',
    type: 'metric',
    typeArgs: {
      getSnapshotId(row) {
        return row.snapshotId;
      },
      getMetricName() {
        return 'hm.hm_analyzer_num_missing_indices';
      },
      getContent: zeroDecimalPlaces,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  },
  {
    title: 'Running instances',
    type: 'metric',
    typeArgs: {
      getSnapshotId(row) {
        return row.snapshotId;
      },
      getMetricName() {
        return 'hm.hm_analyzer_num_running_instances';
      },
      getContent: zeroDecimalPlaces,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  }
];

export default function HealthManagerTable({ snapshot, timeframe }) {
  const hmComponents = [''];

  const rows = hmComponents.map(component => {
    return {
      key: component,
      snapshotId: snapshot.get('id'),
      timeframe
    };
  });

  return (
    <DashboardSection title={`Health Manager (${rows.length})`}>
      <Table cols={cols} rows={rows} getRowDetails={getRowDetails} />
    </DashboardSection>
  );
}

function getRowDetails(row) {
  const snapshotId = row.snapshotId;
  return (
    <div>
      <TwoColumnRow>
        <DashboardSection title="Routines">
          <Chart
            snapshotId={snapshotId}
            timeframe={row.timeframe}
            margins={{
              left: 60
            }}
            y1={{
              formatter: zeroDecimalPlaces,
              tooltipFormatter: zeroDecimalPlaces,
              metrics: ['hm.hm_api_num_go_routines'],
              labels: ['Go routines'],
              type: 'line'
            }}
          />
        </DashboardSection>

        <DashboardSection title="Memory">
          <Chart
            snapshotId={snapshotId}
            timeframe={row.timeframe}
            margins={{
              left: 60
            }}
            y1={{
              formatter: bytesZeroDecimalPlaces,
              tooltipFormatter: bytesZeroDecimalPlaces,
              metrics: [
                'hm.hm_api_bytes_allocated',
                'hm.hm_api_bytes_allocated_heap',
                'hm.hm_api_bytes_allocated_stack'
              ],
              labels: ['Allocated', 'Allocated Heap', 'Allocated Stack'],
              type: 'line'
            }}
          />
        </DashboardSection>
      </TwoColumnRow>
      <DashboardSection title="Health Manager Analyzer">
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
              'hm.hm_analyzer_num_crashed_indices',
              'hm.hm_analyzer_num_crashed_instances',
              'hm.hm_analyzer_num_missing_indices',
              'hm.hm_analyzer_num_running_instances'
            ],
            labels: ['Crashed indices', 'Crashed instances', 'Missing indices', 'Running instances'],
            type: 'line'
          }}
        />
      </DashboardSection>
    </div>
  );
}
