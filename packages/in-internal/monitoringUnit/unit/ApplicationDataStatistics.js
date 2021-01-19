/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import React, { Fragment } from 'react';
import theme from 'in-themes';

import { getDropwizardWithContext } from 'in-internal/monitoringUnit/dataRetrieval';
import DashboardSection from 'in-sdk/components/dashboard/DashboardSection';
import ChartExplanation from 'in-sdk/components/dashboard/ChartExplanation';
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
          <ChartExplanation>
            <div>
              Shows whether spans are being dropped and why:
              <ul>
                <li>
                  <b>Processed:</b> how many spans got successfully processed.
                </li>
                <li>
                  <b>Dropped due to global throttler:</b> dropped due to a global rate limiter (
                  <i>config.hard.spans.rate.drop.threshold</i>).
                </li>
                <li>
                  <b>Dropped due to consistent dropping:</b> dropped because other spans of the same trace got dropped
                  in the past , e.g. due to backpressure (ensure we drop all spans of a trace or none).
                </li>
                <li>
                  <b>Dropped due to backpressure:</b> dropped because of resource exhaustion (e.g. high CPU usage or one
                  step of the pipeline is a bottleneck).
                </li>
                <li>
                  <b>Dropped hard due to backpressure (random dropping):</b> dropped because Kafka record is older than
                  5 seconds.
                </li>
                <li>
                  <b>Dropped due to trace throttler:</b> dropped due to a rate limiter per trace (
                  <i>config.hard.spans.per.trace.rate.drop.threshold</i>){' '}
                </li>
              </ul>
            </div>
          </ChartExplanation>
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
            <ChartExplanation>
              <div>
                When spans are dropped, it is important to look at individual instances.
                <ul>
                  <li>All of the instances are dropping: scale out.</li>
                  <li>
                    One or several instances are dropping (but not all): scaling out will not help.
                    <ul>
                      <li>
                        Traces with a high throughput are being processed (sharding key is the trace id): adjust{' '}
                        <i>config.hard.spans.per.trace.rate.drop.threshold</i>.
                      </li>
                      <li>
                        CPU load is too high on the underlying host(s): assign instance to a less overloaded host.
                      </li>
                    </ul>
                  </li>
                </ul>
              </div>
            </ChartExplanation>
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
          <ChartExplanation>
            <div>
              Delay in the agent: delay between the time a span was ended and the time it was sent from the agent to
              acceptor.
            </div>
          </ChartExplanation>
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
          <ChartExplanation>
            <div>
              Number of span messages (a message contains multiple spans) dropped due to a rate per-tenant-unit limiter.
              See <i>config.span.publish.rate.limit</i> (default: 25,000).
            </div>
          </ChartExplanation>
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
          <ChartExplanation>
            <div>
              Number of span messages (a message contains multiple spans) dropped due to a rate per-tenant-unit limiter.
              See <i>config.span.publish.rate.limit</i> (default: 25,000).
            </div>
          </ChartExplanation>
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
