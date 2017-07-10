import React from 'react';

import { KpiSection, KpiHeading, KpiKeyValue } from 'in-sdk/components/dashboard/KpiSection';
import DashboardSection from 'in-sdk/components/dashboard/DashboardSection';
import DashboardNotification from 'in-components/DashboardNotification';
import { twoDecimalPlaces } from 'in-services/formatters/number';
import Chart from 'in-components/Chart'
import MetricValue from 'in-components/MetricValue';
import { getLabel } from 'in-sdk/snapshot';
import Code from 'in-components/Code';

const stubStatusSampleConfig = `location /nginx_status {
  stub_status  on;
  access_log   off;
}`;

export default function NginxDashboard({ snapshot, timeframe }) {
  const snapshotId = snapshot.get('id');
  const stubStatusUrlFound = snapshot.getIn(['data', 'stubStatusUrlFound']);
  if (stubStatusUrlFound === false) {
    return (
      <DashboardNotification type="info">
        A
        {' '}
        <code>stub_status</code>
        {' '}
        directive could not found within the nginx configuration. Please add or enable it
        {' '}
        within the nginx configuration to enable monitoring metrics.
        <br />
        <br />

        <Code code={stubStatusSampleConfig} />
      </DashboardNotification>
    );
  }

  return (
    <div>
      <KpiSection>
        <KpiHeading>
          {getLabel(snapshot)}
        </KpiHeading>
        <KpiKeyValue label="Requests / s">
          <MetricValue snapshotId={snapshotId} metric="requests" />
        </KpiKeyValue>
        <KpiKeyValue label="Connections Reading">
          <MetricValue snapshotId={snapshotId} metric="connections.reading" />
        </KpiKeyValue>
        <KpiKeyValue label="Connections Writing">
          <MetricValue snapshotId={snapshotId} metric="connections.writing" />
        </KpiKeyValue>
        <KpiKeyValue label="Connections Waiting">
          <MetricValue snapshotId={snapshotId} metric="connections.waiting" />
        </KpiKeyValue>
      </KpiSection>

      <DashboardSection title="Requests">
        <Chart
          snapshotId={snapshotId}
          timeframe={timeframe}
          margins={{
            left: 80
          }}
          y1={{
            min: 0,
            metrics: ['requests'],
            labels: ['Requests / s'],
            type: 'line',
            formatter: twoDecimalPlaces
          }}
        />
      </DashboardSection>

      <DashboardSection title="Connections">
        <Chart
          snapshotId={snapshotId}
          timeframe={timeframe}
          margins={{
            left: 80,
            right: 80
          }}
          y1={{
            min: 0,
            metrics: ['connections.accepted', 'connections.handled', 'connections.active', 'connections.dropped'],
            labels: ['Accepted connections', 'Handled connections', 'Active connections', 'Dropped connections'],
            type: 'line',
            formatter: twoDecimalPlaces
          }}
          y2={{
            min: 0,
            metrics: ['connections.reading', 'connections.writing', 'connections.waiting'],
            labels: ['Reading', 'Writing', 'Waiting'],
            type: 'line',
            formatter: twoDecimalPlaces
          }}
        />
      </DashboardSection>
    </div>
  );
}
