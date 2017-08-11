import React from 'react';

import PageLoadBreakdownChart from 'in-forge/plugins/browserLogicalService/Dashboard/new/components/PageLoadBreakdownChart';
import DashboardTile from 'in-components/Dashboard/components/DashboardTile';
import { instanaInternalFeaturesEnabled } from 'in-services/featureFlags';
import { millis, seconds, number } from 'in-services/formatters/number';
import { Row, Col } from 'in-components/Grid';
import mockup from './time-distribution.png';
import Chart from 'in-components/Chart';

export default function Speed({ snapshot, timeframe }) {
  const snapshotId = snapshot.get('id');
  return (
    <div>
      <Row>
        <Col cols={6}>
          <DashboardTile title="Views vs Page Load Time">
            <Chart
              snapshotId={snapshotId}
              timeframe={timeframe}
              height={200}
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
                formatter: seconds.fromMillisFixedDetailed,
                metrics: ['duration.mean'],
                labels: ['load time'],
                type: 'line',
                aggregation: 'mean'
              }}
            />
          </DashboardTile>
        </Col>
        <Col cols={6}>
          <DashboardTile title="Page Load Time">
            <Chart
              snapshotId={snapshotId}
              timeframe={timeframe}
              height={200}
              margins={{
                left: 60
              }}
              y1={{
                min: 0,
                formatter: seconds.fromMillisFixedDetailed,
                metrics: [
                  'duration.50th',
                  'duration.75th',
                  'duration.90th',
                  'duration.95th',
                  'duration.98th',
                  'duration.99th'
                ],
                labels: ['50th', '75th', '90th', '95th', '98th', '99th'],
                type: 'line',
                aggregation: 'mean'
              }}
            />
          </DashboardTile>
        </Col>
      </Row>

      {instanaInternalFeaturesEnabled
        ? <DashboardTile title="Load Time Distribution">
            <p>
              <strong style={{ color: 'darkred' }}>
                This is a mockup which is only visible internally. We should really have this! In order to get this,
                we need a new way of analyzing durations and calculating distributions.
              </strong>
            </p>
            <img src={mockup} style={{ height: '200px' }} />

          </DashboardTile>
        : null}

      <Row>
        <Col cols={4}>
          <DashboardTile title="Page Load Breakdown Summary">
            <PageLoadBreakdownChart snapshotId={snapshotId} timeframe={timeframe} />
          </DashboardTile>
        </Col>
        <Col cols={8}>
          <DashboardTile title="Page Load Breakdown Over Time">
            <Chart
              snapshotId={snapshotId}
              timeframe={timeframe}
              height={215}
              margins={{
                left: 60
              }}
              y1={{
                min: 0,
                formatter: millis.compact,
                metrics: ['unl', 'red', 'apc', 'dns', 'tcp', 'ssl', 'req', 'rsp', 'dom', 'chi'],
                labels: [
                  'Unload',
                  'Redirect',
                  'AppCache',
                  'DNS',
                  'TCP',
                  'SSL',
                  'Request',
                  'Response',
                  'DOM',
                  'Children'
                ],
                type: 'stackedArea',
                aggregation: 'mean'
              }}
            />
          </DashboardTile>
        </Col>
      </Row>

      <DashboardTile title="Paint Timing">
        <Chart
          snapshotId={snapshotId}
          timeframe={timeframe}
          margins={{
            left: 60
          }}
          y1={{
            min: 0,
            formatter: seconds.fromMillisFixedDetailed,
            metrics: ['fp'],
            labels: ['First paint'],
            type: 'line',
            aggregation: 'mean'
          }}
        />
      </DashboardTile>
    </div>
  );
}
