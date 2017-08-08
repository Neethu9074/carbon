import React from 'react';

import PageLoadBreakdownChart from 'in-forge/plugins/browserLogicalService/Dashboard/new/components/PageLoadBreakdownChart';
import MaxWidthFullscreenContainer from 'in-components/layout/MaxWidthFullscreenContainer';
import { getSubDashboardLink } from 'in-sdk/components/dashboard/TabView/links';
import DashboardTile from 'in-components/Dashboard/components/DashboardTile';
import { number, millis } from 'in-services/formatters/number';
import { Row, Col } from 'in-components/Grid';
import Chart from 'in-components/Chart';

export default function Summary({ snapshot, timeframe }) {
  const snapshotId = snapshot.get('id');
  return (
    <MaxWidthFullscreenContainer>
      <DashboardTile title="Overview">
        <Chart
          snapshotId={snapshotId}
          margins={{
            left: 60,
            right: 60
          }}
          y1={{
            min: 0,
            formatter: number.compact,
            metrics: ['count'],
            labels: ['views'],
            type: 'bar',
            aggregation: 'sum'
          }}
          y2={{
            min: 0,
            formatter: millis.detailed,
            metrics: ['duration.mean'],
            labels: ['load time'],
            type: 'discreteLine',
            aggregation: 'mean'
          }}
        />
      </DashboardTile>

      <Row>
        <Col cols={6}>
          <DashboardTile title="Page Load Breakdown" href$={getSubDashboardLink('/speed')}>
            <PageLoadBreakdownChart snapshotId={snapshotId} timeframe={timeframe} />
          </DashboardTile>
        </Col>
        <Col cols={6}>
          <DashboardTile title="Uncaught Errors" href$={getSubDashboardLink('/errors')}>
            <Chart
              snapshotId={snapshotId}
              margins={{
                left: 60
              }}
              y1={{
                min: 0,
                formatter: number.compact,
                metrics: ['uncaughtErrors'],
                labels: ['Uncaught errors'],
                type: 'bar',
                aggregation: 'sum'
              }}
            />
          </DashboardTile>
        </Col>
      </Row>
    </MaxWidthFullscreenContainer>
  );
}
