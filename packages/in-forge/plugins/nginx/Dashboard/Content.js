import React from 'react';

import { KpiSection, KpiKeyValue } from 'in-sdk/components/dashboard/KpiSection';
import PluginDashboardsMarkerLanes from 'in-forge/PluginDashboardsMarkerLanes';
import DashboardSection from 'in-sdk/components/dashboard/DashboardSection';
import Chart from 'in-components/Chart/InfrastructureMetricChartBehavior';
import DashboardNotification from 'in-sdk/components/dashboard/DashboardNotification';
import { twoDecimalPlaces } from 'in-services/formatters/number';
import MetricValue from 'in-components/MetricValue';
import Code from 'in-components/Code';

const stubStatusSampleConfig = `location /nginx_status {
  stub_status  on;
  access_log   off;
}`;

const apiDirectiveSampleConfig = `location /api {
  api write=off;
}`;

export default function NginxDashboard({ snapshot, timeConfig }) {
  const snapshotId = snapshot.get('id');
  const stubStatusUrlFound = snapshot.getIn(['data', 'stubStatusUrlFound']);
  const errorCode = snapshot.getIn(['data', 'error_code']);
  const statusUrl = snapshot.getIn(['data', 'status_url']);
  const isNginxPlus = snapshot.getIn(['data', 'version'], 'nginx').indexOf('nginx-plus') !== -1;

  if (errorCode === 'CONFIG_FILE_NOT_ACCESSIBLE') {
    return (
      <DashboardNotification type="warning">
        <strong>Nginx configuration file not accessible.</strong>
        <p>
          The config file could either not be located or could not be accessed. The agent tries to automatically{' '}
          identify the location of the configuration file. It does so by analyzing the command line of the nginx master
          process. Additionally, it also tries common locations for nginx config files such as{' '}
          <code>/etc/nginx/nginx.conf</code>.
        </p>
        <p>
          This file needs to be accessible in order to identify the URL under which nginx is exposing status
          information.
        </p>
      </DashboardNotification>
    );
  } else if (errorCode === 'STATUS_LOCATION_NOT_FOUND') {
    return (
      <DashboardNotification type="warning">
        <strong>Status URL not found.</strong>

        <p>
          The nginx config file was parsed and no <code>stub_status</code> direction could be found. This directive{' '}
          needs to be configured in order to gather nginx metrics. The following snippet shows how to configure{' '}
          <code>stub_status</code> within an nginx config file:
        </p>

        <Code code={stubStatusSampleConfig} />
      </DashboardNotification>
    );
  } else if (errorCode === 'STATUS_LOCATION_NOT_ACCESSIBLE') {
    return (
      <DashboardNotification type="warning">
        <strong>Status URL not accessible.</strong>
        <p>
          Based on the nginx config, the status URL <code>{statusUrl}</code> was identified but this address could not
          be accessed. This is commonly the case due to nginx <code>allow</code> and <code>deny</code> directives, port
          bindings or iptable configurations.
        </p>
      </DashboardNotification>
    );
  } else if (stubStatusUrlFound === false) {
    return (
      <DashboardNotification type="warning">
        <p>
          A <code>stub_status</code> directive could not found within the nginx configuration. Please add or enable it{' '}
          within the nginx configuration to enable monitoring metrics.
        </p>
        <Code code={stubStatusSampleConfig} />
      </DashboardNotification>
    );
  } else if (errorCode === 'API_LOCATION_NOT_ACCESSIBLE') {
    return (
      <DashboardNotification type="warning">
        <strong>NgnixPlus API URL not accessible.</strong>
        <p>
          Based on the nginx config, we identified the nginx-plus API which is inaccessible on it
          {`'`}s specified location. This is commonly the case due to nginx <code>allow</code> and <code>deny</code>{' '}
          directives, port bindings or iptable configurations.
        </p>
      </DashboardNotification>
    );
  } else if (errorCode === 'API_LOCATION_NOT_FOUND') {
    return (
      <DashboardNotification type="warning">
        <strong>API URL not found.</strong>

        <p>
          The nginx config file was parsed and no <code>api</code> direction could be found. This directive needs to be
          configured in order to gather nginx plus metrics. The following snippet shows how to configure{' '}
          <code>api</code> within an nginx config file.
        </p>

        <Code code={apiDirectiveSampleConfig} />
      </DashboardNotification>
    );
  }

  return (
    <div>
      <KpiSection>
        <KpiKeyValue label="Requests per second">
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

      <DashboardSection title="Requests per second">
        <Chart
          snapshotId={snapshotId}
          timeConfig={timeConfig}
          y1={{
            min: 0,
            metrics: ['requests'],
            labels: ['Requests'],
            type: 'line',
            formatter: twoDecimalPlaces
          }}
          renderPostChartContent={PluginDashboardsMarkerLanes}
        />
      </DashboardSection>

      {isNginxPlus && (
        <DashboardSection title="Responses for server zones">
          <Chart
            snapshotId={snapshotId}
            timeConfig={timeConfig}
            y1={{
              min: 0,
              metrics: ['nginx_plus.http.server_zones.5xx_responses'],
              labels: ['5xx responses per second'],
              type: 'line',
              formatter: twoDecimalPlaces
            }}
            renderPostChartContent={PluginDashboardsMarkerLanes}
          />
        </DashboardSection>
      )}

      <DashboardSection title="Connections">
        <Chart
          snapshotId={snapshotId}
          timeConfig={timeConfig}
          y1={{
            min: 0,
            metrics: ['connections.accepted', 'connections.handled', 'connections.active', 'connections.dropped'],
            labels: ['Accepted', 'Handled', 'Active', 'Dropped'],
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
          renderPostChartContent={PluginDashboardsMarkerLanes}
        />
      </DashboardSection>

      {isNginxPlus && (
        <DashboardSection title="Caches">
          <Chart
            snapshotId={snapshotId}
            timeConfig={timeConfig}
            y1={{
              min: 0,
              metrics: [
                'nginx_plus.http.caches.miss.responses',
                'nginx_plus.http.caches.hit.responses',
                'nginx_plus.http.caches.size',
                'nginx_plus.http.caches.max_size',
                'nginx_plus.http.caches.cold'
              ],
              labels: [
                'Misses per second',
                'Hits per second',
                'Caches size',
                'Max cache size',
                'Number of cold caches'
              ],
              type: 'line',
              formatter: twoDecimalPlaces
            }}
            renderPostChartContent={PluginDashboardsMarkerLanes}
          />
        </DashboardSection>
      )}

      {isNginxPlus && (
        <DashboardSection title="SSL">
          <Chart
            snapshotId={snapshotId}
            timeConfig={timeConfig}
            y1={{
              min: 0,
              metrics: [
                'nginx_plus.ssl.handshakes',
                'nginx_plus.ssl.handshakes_failed',
                'nginx_plus.ssl.session_reuses'
              ],
              labels: ['Handshakes', 'Failed hanshakes', 'Session reuses'],
              type: 'line',
              formatter: twoDecimalPlaces
            }}
            renderPostChartContent={PluginDashboardsMarkerLanes}
          />
        </DashboardSection>
      )}

      {isNginxPlus && (
        <DashboardSection title="Processes and upstreams">
          <Chart
            snapshotId={snapshotId}
            timeConfig={timeConfig}
            y1={{
              min: 0,
              metrics: ['nginx_plus.processes.respawned', 'nginx_plus.http.upstreams.peers.failed'],
              labels: ['Processes respawned', 'Upstreams failed'],
              type: 'line',
              formatter: twoDecimalPlaces
            }}
            renderPostChartContent={PluginDashboardsMarkerLanes}
          />
        </DashboardSection>
      )}
    </div>
  );
}
