import React from 'react';

import { KpiSection, KpiHeading, KpiKeyValue } from 'in-sdk/components/dashboard/KpiSection';
import DashboardSection from 'in-sdk/components/dashboard/DashboardSection';
import DashboardNotification from 'in-components/DashboardNotification';
import { twoDecimalPlaces } from 'in-services/formatters/number';
import ChartWithLegend from 'in-components/ChartWithLegend';
import MetricValue from 'in-components/MetricValue';
import { getLabel } from 'in-sdk/snapshot';
import Code from 'in-components/Code';

const stubStatusSampleConfig = `location /nginx_status {
  stub_status  on;
  access_log   off;
}`;

const stubStatusAccessSampleConfig = `location /nginx_status {
  ...
  allow 127.0.0.1;
  deny all;
}`;

export default function NginxDashboard({ snapshot, timeframe }) {
  const snapshotId = snapshot.get('id');
  const stubStatusUrlFound = snapshot.getIn(['data', 'stubStatusUrlFound']);
  const errorCode = snapshot.getIn(['data', 'error_code']);
  const statusUrl = snapshot.getIn(['data', 'status_url']);

  if (errorCode === 'CONFIG_FILE_NOT_ACCESSIBLE') {
    return (
      <DashboardNotification type="info">
        Default nginx configuration file not found or cannot be opened.
        <br />
        Instana agent tries to find configuration file location, either from command line arguments or
        on default location such as <code>/etc/nginx/nginx.conf</code>.
      </DashboardNotification>
    );
  } else if (errorCode === 'STATUS_LOCATION_NOT_ACCESSIBLE') {
    return (
      <DashboardNotification type="info">
        Url <code>{statusUrl}</code> is not accessible.
        <br />
        Different combinations of <code>allow</code>/<code>deny</code> directives within the nginx configuration,
        can block access to <code>{statusUrl}</code>.
        <br />
        eg. <Code code={stubStatusAccessSampleConfig} />
      </DashboardNotification>
    );
  } else if (stubStatusUrlFound === false) {
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
        <ChartWithLegend
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
        <ChartWithLegend
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
