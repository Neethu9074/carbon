import semver from 'semver';
import React from 'react';

import { msZeroDecimalPlaces, zeroDecimalPlaces, zeroDecimalPlacesPerSecond } from 'in-services/formatters/number';
import DashboardSection from 'in-sdk/components/dashboard/DashboardSection';
import ChartWithLegend from 'in-components/ChartWithLegend';
import ExecutorsStreamingAppTable from './ExecutorsStreamingAppTable';
import ExecutorsStreamingAppTableBeforeV200 from './ExecutorsStreamingAppTableBeforeV200';

export default function StreamingAppContent({ snapshot, timeframe }) {
  const version = snapshot.getIn(['data', 'version'], '2.0.0');

  return (
    <div>
      <DashboardSection title="Batches">
        <ChartWithLegend
          snapshotId={snapshot.get('id')}
          timeframe={timeframe}
          margins={{
            left: 80
          }}
          y1={{
            formatter: zeroDecimalPlacesPerSecond,
            metrics: ['completedBatches'],
            labels: ['Completed Batches per Second'],
            type: 'line'
          }}
        />
      </DashboardSection>
      <DashboardSection title="Scheduling Delay">
        <ChartWithLegend
          snapshotId={snapshot.get('id')}
          timeframe={timeframe}
          margins={{
            left: 80
          }}
          y1={{
            formatter: msZeroDecimalPlaces,
            metrics: ['schedulingDelay'],
            labels: ['Scheduling Delay'],
            type: 'line'
          }}
        />
      </DashboardSection>
      <DashboardSection title="Total Delay">
        <ChartWithLegend
          snapshotId={snapshot.get('id')}
          timeframe={timeframe}
          margins={{
            left: 80
          }}
          y1={{
            formatter: msZeroDecimalPlaces,
            metrics: ['totalDelay'],
            labels: ['Total Delay'],
            type: 'line'
          }}
        />
      </DashboardSection>
      <DashboardSection title="Processing Time">
        <ChartWithLegend
          snapshotId={snapshot.get('id')}
          timeframe={timeframe}
          margins={{
            left: 80
          }}
          y1={{
            formatter: msZeroDecimalPlaces,
            metrics: ['processingTime'],
            labels: ['Processing Time'],
            type: 'line'
          }}
        />
      </DashboardSection>
      {semver.satisfies(version, '>=1.6.0')
        ? <DashboardSection title="Output Operations">
            <ChartWithLegend
              snapshotId={snapshot.get('id')}
              timeframe={timeframe}
              margins={{
                left: 80
              }}
              y1={{
                formatter: zeroDecimalPlaces,
                metrics: ['completedOutputOperations', 'failedOutputOperations'],
                labels: ['Completed Output Operations', 'Failed Output Operations'],
                type: 'line'
              }}
            />
          </DashboardSection>
        : null}
      <DashboardSection title="Input Records">
        <ChartWithLegend
          snapshotId={snapshot.get('id')}
          timeframe={timeframe}
          margins={{
            left: 80
          }}
          y1={{
            formatter: zeroDecimalPlaces,
            metrics: ['inputRecords'],
            labels: ['Input Records'],
            type: 'line'
          }}
        />
      </DashboardSection>
      <DashboardSection title="Receivers">
        <ChartWithLegend
          snapshotId={snapshot.get('id')}
          timeframe={timeframe}
          margins={{
            left: 80
          }}
          y1={{
            formatter: zeroDecimalPlaces,
            metrics: ['activeReceivers', 'activeReceivers'],
            labels: ['Active Receivers', 'Inactive Receivers'],
            type: 'line'
          }}
        />
      </DashboardSection>
      {semver.satisfies(version, '>=2.0.0')
        ? <ExecutorsStreamingAppTable snapshot={snapshot} timeframe={timeframe} />
        : <ExecutorsStreamingAppTableBeforeV200 snapshot={snapshot} timeframe={timeframe} />}
    </div>
  );
}
