import React from 'react';

import { twoDecimalPlaces, number, msTwoDecimalPlaces, zeroDecimalPlaces } from 'in-services/formatters/number';
import PageCharts from 'in-forge/plugins/browserLogicalService/Dashboard/new/components/PageCharts';
import { KpiSection, KpiHeading, KpiKeyValue } from 'in-sdk/components/dashboard/KpiSection';
import WebsiteKpiSection from 'in-views/eumView/components/WebsiteKpiSection';
import DashboardTile from 'in-components/Dashboard/components/DashboardTile';
import TimeWindowSizeLabel from 'in-components/TimeWindowSizeLabel';
import { getSubDashboardLink } from 'in-stores/navigation';
import MetricValue from 'in-components/MetricValue';
import { Row, Col } from 'in-components/Grid/Grid';
import { getLabel } from 'in-sdk/snapshot';
import Chart from 'in-components/Chart';

export default function Summary({ snapshot, timeframe }) {
  const snapshotId = snapshot.get('id');
  return (
    <div>
      <DashboardTile title="">
        <WebsiteKpiSection snapshotId={snapshotId} />
        <Chart
          snapshotId={snapshotId}
          margins={{
            left: 40,
            right: 40
          }}
          y1={{
            min: 0,
            formatter: number.compact,
            metrics: ['count'],
            labels: ['views'],
            type: 'bar',
            aggregation: 'sum',
            minPixelPerBlock: 5,
            maxDataPoints: 100
          }}
          y2={{
            min: 0,
            formatter: twoDecimalPlaces,
            metrics: ['duration.mean'],
            labels: ['load time'],
            type: 'discreteLine',
            aggregation: 'mean',
            minPixelPerBlock: 5,
            maxDataPoints: 100
          }}
        />
      </DashboardTile>

      <Row>
        <Col cols={6}>
          <DashboardTile title="Page Load Breakdown" href$={getSubDashboardLink('speed')} />
        </Col>
        <Col cols={6}>
          <DashboardTile title="Top Errors" href$={getSubDashboardLink('errors')} />
        </Col>
      </Row>

      <DashboardTile title="Quick overview">
        <KpiSection>
          <KpiHeading>
            {getLabel(snapshot)}
          </KpiHeading>
          <KpiKeyValue label={<TimeWindowSizeLabel prefix="Views in " />}>
            <MetricValue
              snapshotId={snapshotId}
              formatter={zeroDecimalPlaces}
              metric="count"
              timeWindowAggregation="sum"
            />
          </KpiKeyValue>
          <KpiKeyValue label="time to page load (95th)">
            <MetricValue snapshotId={snapshotId} metric="duration.95th" formatter={msTwoDecimalPlaces} />
          </KpiKeyValue>
          <KpiKeyValue label={<TimeWindowSizeLabel prefix="avg. time to page load in " />}>
            <MetricValue
              snapshotId={snapshotId}
              metric="duration.95th"
              formatter={msTwoDecimalPlaces}
              timeWindowAggregation="mean"
            />
          </KpiKeyValue>
          <KpiKeyValue label="time to first paint (95th)">
            <MetricValue snapshotId={snapshotId} metric="fp" formatter={msTwoDecimalPlaces} />
          </KpiKeyValue>
          <KpiKeyValue label={<TimeWindowSizeLabel prefix="avg. time to first paint in " />}>
            <MetricValue
              snapshotId={snapshotId}
              metric="fp"
              formatter={msTwoDecimalPlaces}
              timeWindowAggregation="mean"
            />
          </KpiKeyValue>
        </KpiSection>
      </DashboardTile>

      <DashboardTile title="Detailed Charts">
        <PageCharts snapshotId={snapshotId} timeframe={timeframe} />
      </DashboardTile>
    </div>
  );
}
