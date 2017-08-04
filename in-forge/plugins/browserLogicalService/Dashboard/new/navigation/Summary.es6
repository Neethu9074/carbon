import React from 'react';

import WebsiteKpiSection from 'in-views/eumView/components/WebsiteKpiSection';
import DashboardTile from 'in-components/Dashboard/components/DashboardTile';
import { twoDecimalPlaces, number } from 'in-services/formatters/number';
import { getSubDashboardLink } from 'in-stores/navigation';
import { Row, Col } from 'in-components/Grid/Grid';
import Chart from 'in-components/Chart';

export default function Summary({ snapshot }) {
  const snapshotId = snapshot.get('id');
  return (
    <div>
      <DashboardTile title="Views vs Page Load">
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
    </div>
  );
}
