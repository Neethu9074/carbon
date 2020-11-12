import React, { Fragment } from 'react';
import theme from 'in-themes';

import { getDropwizardWithContext } from 'in-internal/monitoringUnit/dataRetrieval';
import DashboardSection from 'in-sdk/components/dashboard/DashboardSection';
import { percentage, number, millis } from 'in-services/formatters/number';
import Chart from 'in-components/Chart/InfrastructureMetricChartBehavior';
import connectTo from 'in-hoc/connectTo';

export default connectTo(
  ({ tenant, unit }) => ({
    appdata_processor_instances: getDropwizardWithContext(
      'entity.label:"*' + tenant + '-' + unit + '-appdata-processor*"'
    )
  }),
  function ApplicationDataStatistics({ timeConfig, tenantUnitId, appdata_processor_instances }) {
    const appdata_processor_labels = appdata_processor_instances.map(instance => instance.host.get('label'));

    return (
      <Fragment>
        <DashboardSection title={`AppData-Processor Instances`}>
          <Chart
            snapshotId={tenantUnitId}
            timeConfig={timeConfig}
            y1={{
              formatter: number.compact,
              metrics: [`appdata-processor.instances`],
              labels: ['AppData-Processor Processor Instances'],
              type: 'stackedArea'
            }}
          />
        </DashboardSection>

        <DashboardSection title={`Backend Span Dropping (sum across instances)`}>
          <Chart
            snapshotId={tenantUnitId}
            timeConfig={timeConfig}
            y1={{
              min: 0,
              max: 1,
              formatter: percentage.detailed,
              metrics: [`appdata-processor.spanDropping`],
              labels: ['Dropping rate'],
              type: 'line'
            }}
            y2={{
              min: 0,
              formatter: number.compact,
              metrics: [
                `appdata-processor.processedSpans`,
                `appdata-processor.droppedSpansDueToConfiguration`,
                `appdata-processor.droppedSpansDueToConsistentDropping`,
                `appdata-processor.droppedSpansDueToBackpressure`,
                `appdata-processor.droppedSpansDueToHardBackpressure`,
                `appdata-processor.droppedSpansDueToPerTraceConfiguration`
              ],
              labels: [
                'Processed',
                'Dropped due to global throttler',
                'Dropped due to consistent dropping',
                'Dropped due to backpressure',
                'Dropped hard due to backpressure (random dropping)',
                'Dropped due to trace throttler'
              ],
              colors: [
                theme.lib.colors.success,
                theme.lib.colors.red800,
                theme.lib.colors.orange800,
                theme.lib.colors.yellow800,
                theme.lib.colors.pink800,
                theme.lib.colors.purple800
              ],
              type: 'stackedArea'
            }}
          />
        </DashboardSection>

        {appdata_processor_instances.length > 1 && (
          <DashboardSection title={`Backend Span Dropping (per instance)`}>
            <Chart
              snapshotIds={appdata_processor_instances.map(instance => instance.dropwizard.get('id'))}
              timeConfig={timeConfig}
              minRollup={5000}
              y1={{
                min: 0,
                max: 1,
                formatter: percentage.detailed,
                metrics: appdata_processor_instances.map(() => 'metrics.gauges.KPI.incoming.span_messages.error_rate'),
                labels: appdata_processor_labels,
                type: 'line'
              }}
            />
          </DashboardSection>
        )}

        <DashboardSection title={`Span latency (mean across instances)`}>
          <Chart
            snapshotId={tenantUnitId}
            timeConfig={timeConfig}
            y1={{
              min: 0,
              formatter: millis.compact,
              metrics: [
                `appdata-processor.spanLatency.mean`,
                `appdata-processor.spanLatency.50th`,
                `appdata-processor.spanLatency.99th`
              ],
              labels: ['Mean', '50th', '99th'],
              type: 'line'
            }}
          />
        </DashboardSection>

        <DashboardSection title={`Acceptor Rate-Limited Span Messages`}>
          <Chart
            snapshotId={tenantUnitId}
            timeConfig={timeConfig}
            y1={{
              formatter: number.compact,
              metrics: [`acceptor.droppedSpanMessagesRateLimited`],
              labels: ['Acceptor Dropped Span Messages'],
              type: 'stackedArea'
            }}
          />
        </DashboardSection>

        <DashboardSection title={`Serverless Acceptor Rate-Limited Span Messages`}>
          <Chart
            snapshotId={tenantUnitId}
            timeConfig={timeConfig}
            y1={{
              formatter: number.compact,
              metrics: [`serverless-acceptor.droppedSpanMessagesRateLimited`],
              labels: ['Serverless Acceptor Dropped Span Messages'],
              type: 'stackedArea'
            }}
          />
        </DashboardSection>
      </Fragment>
    );
  }
);
