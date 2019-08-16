import React, { Fragment } from 'react';

import { getDropwizardWithContext } from 'in-internal/monitoringUnit/dataRetrieval';
import { number, percentagePlain, millis } from 'in-services/formatters/number';
import DashboardSection from 'in-sdk/components/dashboard/DashboardSection';
import Chart from 'in-components/Chart/InfrastructureMetricChartBehavior';
import LoadingIndicator from 'in-components/LoadingIndicator';
import Columize from 'in-sdk/components/dashboard/Columize';
import { timeConfig$ } from 'in-stores/time/config';
import { compare } from 'in-services/util/number';
import connectTo from 'in-hoc/connectTo';

import locals from './BatchingInsights.mless';

const types = [
  {
    type: 'calls',
    incomingKpi: 'KPI.incoming.calls'
  },
  {
    type: 'beacons.shortTerm',
    incomingKpi: 'KPI.incoming.website_monitoring_processed_beacons'
  },
  {
    type: 'beacons.longTerm'
  },
  {
    type: 'chains',
    incomingKpi: 'KPI.incoming.chains'
  },
  {
    type: 'logs',
    incomingKpi: 'KPI.incoming.logs'
  }
];

export default connectTo(
  {
    timeConfig: timeConfig$,
    rows: getDropwizardWithContext('entity.label:"appdata-writer"')
  },
  function AppDataWriter({ rows, timeConfig }) {
    if (rows.length === 0) {
      return <LoadingIndicator type="dark" />;
    }

    rows = rows.slice().sort((a, b) => compare(Number(getLabel(a)), Number(getLabel(b))));
    const labels = rows.map(getLabel);

    return (
      <div className={locals.wrapper}>
        <Columize>
          <DashboardSection title={`Host CPU load`}>
            <Chart
              snapshotIds={rows.map(r => r.host.get('id'))}
              timeConfig={timeConfig}
              minRollup={5000}
              y1={{
                min: 0,
                formatter: number.detailed,
                tooltipFormatter: number.detailed,
                metrics: rows.map(() => 'load.1min'),
                labels: labels,
                type: 'line'
              }}
            />
          </DashboardSection>

          <DashboardSection title={`Garbage Collection Activity`}>
            <Chart
              snapshotIds={rows.map(r => r.jvm.get('id'))}
              timeConfig={timeConfig}
              minRollup={5000}
              y1={{
                min: 0,
                formatter: millis.compact,
                metrics: rows.map(() => 'gc.G1 Young Generation.time'),
                labels,
                type: 'line'
              }}
            />
          </DashboardSection>
        </Columize>

        {types.map(({ type, incomingKpi }) => (
          <Fragment key={type}>
            <h1>Pipeline behavior for: {type}</h1>

            {incomingKpi && (
              <Columize>
                <DashboardSection title={`Kafka Reads`}>
                  <Chart
                    snapshotIds={rows.map(r => r.dropwizard.get('id'))}
                    timeConfig={timeConfig}
                    customHeight={150}
                    y1={{
                      min: 0,
                      formatter: number.perSecond.compact,
                      metrics: rows.map(() => `metrics.meters.${incomingKpi}.calls`),
                      labels,
                      type: 'stackedArea'
                    }}
                  />
                </DashboardSection>

                <DashboardSection title={`Dropped`}>
                  <Chart
                    snapshotIds={rows.map(r => r.dropwizard.get('id'))}
                    timeConfig={timeConfig}
                    customHeight={150}
                    y1={{
                      min: 0,
                      formatter: number.perSecond.compact,
                      metrics: rows.map(() => `metrics.meters.${incomingKpi}.errors`),
                      labels,
                      type: 'stackedArea'
                    }}
                  />
                </DashboardSection>
              </Columize>
            )}

            <Columize>
              <DashboardSection title={`Batch Additions`}>
                <Chart
                  snapshotIds={rows.map(r => r.dropwizard.get('id'))}
                  timeConfig={timeConfig}
                  customHeight={150}
                  y1={{
                    min: 0,
                    formatter: number.perSecond.compact,
                    metrics: rows.map(() => `metrics.meters.batching.${type}.additionsToBatch.calls`),
                    labels,
                    type: 'stackedArea'
                  }}
                />
              </DashboardSection>

              <DashboardSection title={`Batch Addition Failures`}>
                <Chart
                  snapshotIds={rows.map(r => r.dropwizard.get('id'))}
                  timeConfig={timeConfig}
                  customHeight={150}
                  y1={{
                    min: 0,
                    formatter: number.perSecond.compact,
                    metrics: rows.map(() => `metrics.meters.batching.${type}.additionsToBatch.errors`),
                    labels,
                    type: 'stackedArea'
                  }}
                />
              </DashboardSection>
            </Columize>

            <DashboardSection title={`Usage of Maximum Allowed Batch Size`}>
              <Chart
                snapshotIds={rows.map(r => r.dropwizard.get('id'))}
                timeConfig={timeConfig}
                customHeight={150}
                y1={{
                  min: 0,
                  formatter: percentagePlain.compact,
                  metrics: rows.map(() => `metrics.histograms.batching.${type}.batched.bytes.%.mean`),
                  labels,
                  type: 'line'
                }}
              />
            </DashboardSection>

            <Columize>
              <DashboardSection title={`Batch Transmissions`}>
                <Chart
                  snapshotIds={rows.map(r => r.dropwizard.get('id'))}
                  timeConfig={timeConfig}
                  customHeight={150}
                  y1={{
                    min: 0,
                    formatter: number.perSecond.compact,
                    metrics: rows.map(() => `metrics.meters.batching.${type}.transmissions.calls`),
                    labels,
                    type: 'stackedArea'
                  }}
                />
              </DashboardSection>

              <DashboardSection title={`Batch Transmission Failures`}>
                <Chart
                  snapshotIds={rows.map(r => r.dropwizard.get('id'))}
                  timeConfig={timeConfig}
                  customHeight={150}
                  y1={{
                    min: 0,
                    formatter: number.perSecond.compact,
                    metrics: rows.map(() => `metrics.meters.batching.${type}.transmissions.errors`),
                    labels,
                    type: 'stackedArea'
                  }}
                />
              </DashboardSection>
            </Columize>
          </Fragment>
        ))}
      </div>
    );
  }
);

function getLabel(row) {
  return row.host.get('label').replace(/^(appdata-writer-(\d+)).*$/i, '$2');
}
