import React from 'react';

import { msTwoDecimalPlaces, zeroDecimalPlaces, twoDecimalPlaces } from 'in-services/formatters/number';
import { KpiSection, KpiHeading, KpiKeyValue } from 'in-sdk/components/dashboard/KpiSection';
import DashboardSection from 'in-sdk/components/dashboard/DashboardSection';
import Connections from 'in-components/LogicalEntityTables/Connections';
import TimeWindowSizeLabel from 'in-components/TimeWindowSizeLabel';
import TwoColumnRow from 'in-sdk/components/dashboard/TwoColumnRow';
import ChartWithLegend from 'in-components/ChartWithLegend';
import MetricValue from 'in-components/MetricValue';
import { getLabel } from 'in-sdk/snapshot';

export default function DefaultLogicalServiceDashboard({ snapshot, timeframe }) {
  const snapshotId = snapshot.get('id');
  return (
    <div>
      <KpiSection>
        <KpiHeading>
          {getLabel(snapshot)}
        </KpiHeading>
        <KpiKeyValue label="calls/s">
          <MetricValue snapshotId={snapshotId} metric="count" formatter={zeroDecimalPlaces} />
        </KpiKeyValue>
        <KpiKeyValue label={<TimeWindowSizeLabel prefix="calls in " />}>
          <MetricValue
            snapshotId={snapshotId}
            formatter={zeroDecimalPlaces}
            metric="count"
            timeWindowAggregation="adjustedCount"
          />
        </KpiKeyValue>
        <KpiKeyValue label="time to page load  (95th)">
          <MetricValue snapshotId={snapshotId} metric="duration. (95th)" formatter={msTwoDecimalPlaces} />
        </KpiKeyValue>
        <KpiKeyValue label={<TimeWindowSizeLabel prefix="avg. time to page load in " />}>
          <MetricValue
            snapshotId={snapshotId}
            metric="duration. (95th)"
            formatter={msTwoDecimalPlaces}
            timeWindowAggregation="mean"
          />
        </KpiKeyValue>
        <KpiKeyValue label="time to first paint (95th)">
          <MetricValue snapshotId={snapshotId} metric="fp. (95th)" formatter={msTwoDecimalPlaces} />
        </KpiKeyValue>
        <KpiKeyValue label={<TimeWindowSizeLabel prefix="avg. time to first paint in " />}>
          <MetricValue
            snapshotId={snapshotId}
            metric="fp. (95th)"
            formatter={msTwoDecimalPlaces}
            timeWindowAggregation="mean"
          />
        </KpiKeyValue>
      </KpiSection>

      <TwoColumnRow>
        <DashboardSection title="Calls/s">
          <ChartWithLegend
            snapshotId={snapshotId}
            timeframe={timeframe}
            margins={{
              left: 80
            }}
            y1={{
              min: 0,
              formatter: twoDecimalPlaces,
              metrics: ['count'],
              labels: ['calls/s'],
              type: 'line'
            }}
          />
        </DashboardSection>

        <DashboardSection title="Errors/s">
          <ChartWithLegend
            snapshotId={snapshotId}
            timeframe={timeframe}
            margins={{
              left: 80
            }}
            y1={{
              min: 0,
              formatter: twoDecimalPlaces,
              metrics: ['error_count'],
              labels: ['errors/s'],
              type: 'line'
            }}
          />
        </DashboardSection>
      </TwoColumnRow>

      <DashboardSection title="Page Load Time">
        <ChartWithLegend
          snapshotId={snapshotId}
          timeframe={timeframe}
          height={200}
          margins={{
            left: 80
          }}
          y1={{
            min: 0,
            formatter: msTwoDecimalPlaces,
            metrics: [
              'duration.min',
              'duration.25th',
              'duration.50th',
              'duration.75th',
              'duration.95th',
              'duration.98th',
              'duration.99th',
              'duration.max'
            ],
            labels: ['min', '25th', '50th', '75th', '95th', '98th', '99th', 'max'],
            type: 'integral'
          }}
        />
      </DashboardSection>

      <DashboardSection title="Page Load Breakdown (95th)">
        <ChartWithLegend
          snapshotId={snapshotId}
          timeframe={timeframe}
          margins={{
            left: 80
          }}
          y1={{
            min: 0,
            formatter: msTwoDecimalPlaces,
            metrics: [
              'unl.95th',
              'red.95th',
              'apc.95th',
              'dns.95th',
              'tcp.95th',
              'req.95th',
              'rsp.95th',
              'pro.95th',
              'loa.95th'
            ],
            labels: ['Unload', 'Redirect', 'AppCache', 'DNS', 'TCP', 'Request', 'Response', 'Processing', 'Load'],
            type: 'stackedArea'
          }}
        />
      </DashboardSection>

      <DashboardSection title="Time to First Paint (95th)">
        <ChartWithLegend
          snapshotId={snapshotId}
          timeframe={timeframe}
          margins={{
            left: 80
          }}
          y1={{
            min: 0,
            formatter: msTwoDecimalPlaces,
            metrics: ['fp.95th'],
            labels: ['First paint time'],
            type: 'line'
          }}
        />
      </DashboardSection>

      <Connections snapshotId={snapshotId} timeframe={timeframe} />
    </div>
  );
}
