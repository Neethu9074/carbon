import React from 'react';

import timeDistributionUrl from 'in-forge/plugins/browserLogicalService/Dashboard/navigation-timing.svg';
import MaxWidthFullscreenContainer from 'in-components/layout/MaxWidthFullscreenContainer';
import { instanaInternalFeaturesEnabled } from 'in-services/featureFlags';
import { millis, seconds, number } from 'in-services/formatters/number';
import DashboardTile from 'in-sdk/components/dashboard/DashboardTile';
import TwoColumnRow from 'in-sdk/components/dashboard/TwoColumnRow';
import mockup from './time-distribution.png';
import Chart from 'in-components/Chart';
import Link from 'in-components/Link';

export default function Speed({ snapshot, timeframe, metricPrefix }) {
  const snapshotId = snapshot.get('id');
  return (
    <MaxWidthFullscreenContainer>
      <TwoColumnRow>
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
              metrics: [metricPrefix + 'count'],
              labels: ['views'],
              type: 'bar',
              aggregation: 'sum'
            }}
            y2={{
              min: 0,
              formatter: seconds.fromMillisFixedDetailed,
              metrics: [metricPrefix + 'duration.mean'],
              labels: ['load time'],
              type: 'line',
              aggregation: 'mean'
            }}
          />
        </DashboardTile>
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
                metricPrefix + 'duration.50th',
                metricPrefix + 'duration.90th',
                metricPrefix + 'duration.95th',
                metricPrefix + 'duration.98th',
                metricPrefix + 'duration.99th'
              ],
              labels: ['50th', '90th', '95th', '98th', '99th'],
              type: 'line',
              aggregation: 'mean'
            }}
          />
        </DashboardTile>
      </TwoColumnRow>

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

      <DashboardTile title="Page Load Breakdown Over Time">
        <p>
          With the exception of the DOM and children metrics, all the names come directly from the{' '}
          <Link href="https://www.w3.org/TR/navigation-timing-2/#h-processing-model" external>
            navigation timining
          </Link>{' '}
          specification. To learn more about DOM and children timing, check out our variation of the{' '}
          <Link href={timeDistributionUrl} external>
            navigation timing stages
          </Link>.
        </p>
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
            metrics: [
              metricPrefix + 'unl',
              metricPrefix + 'red',
              metricPrefix + 'apc',
              metricPrefix + 'dns',
              metricPrefix + 'tcp',
              metricPrefix + 'ssl',
              metricPrefix + 'req',
              metricPrefix + 'rsp',
              metricPrefix + 'dom',
              metricPrefix + 'chi'
            ],
            labels: ['Unload', 'Redirect', 'AppCache', 'DNS', 'TCP', 'SSL', 'Request', 'Response', 'DOM', 'Children'],
            type: 'stackedArea',
            aggregation: 'mean'
          }}
        />
      </DashboardTile>

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
            metrics: [metricPrefix + 'fp'],
            labels: ['First paint'],
            type: 'line',
            aggregation: 'mean'
          }}
        />
      </DashboardTile>
    </MaxWidthFullscreenContainer>
  );
}
