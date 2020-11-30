import React from 'react';

import { getDropwizardWithContext } from 'in-internal/monitoringUnit/dataRetrieval';
import LoadingIndicator from 'in-new-components/LoadingIndicators/LoadingIndicator';
import { number, percentagePlain, millis } from 'in-services/formatters/number';
import DashboardSection from 'in-sdk/components/dashboard/DashboardSection';
import Chart from 'in-components/Chart/InfrastructureMetricChartBehavior';
import ExpandableCard from 'in-new-components/ExpandableCard';
import Columize from 'in-sdk/components/dashboard/Columize';
import { Row, Col } from 'in-new-components/layout/Grid';
import { timeConfig$ } from 'in-stores/time/config';
import { compare } from 'in-services/util/number';
import connectTo from 'in-hoc/connectTo';

import locals from './BatchingInsights.mless';

const types = [
  {
    title: 'Calls',
    type: 'calls',
    incomingKpi: 'KPI.incoming.calls'
  },
  {
    title: 'Website Beacons (short term)',
    type: 'beacons.shortTerm',
    incomingKpi: 'KPI.incoming.website_monitoring_processed_beacons'
  },
  {
    title: 'Website Beacons (long term)',
    type: 'beacons.longTerm'
  },
  {
    title: 'Mobile App Beacons (short term)',
    type: 'mobileBeacons.shortTerm',
    incomingKpi: 'KPI.incoming.mobile_app_monitoring_processed_beacons'
  },
  {
    title: 'Mobile App Beacons (long term)',
    type: 'mobileBeacons.longTerm'
  },
  {
    title: 'Chains',
    type: 'chains',
    incomingKpi: 'KPI.incoming.call_graphs'
  },
  {
    title: 'Logs',
    type: 'logs',
    incomingKpi: 'KPI.incoming.logs'
  },
  {
    title: 'Profile Infos (ClickHouse)',
    type: 'raw_profile_infos',
    incomingKpi: 'KPI.incoming.raw_profiles'
  }
];

export default connectTo(
  {
    timeConfig: timeConfig$,
    rows: getDropwizardWithContext('entity.jvm.app.name:"appdata-writer"')
  },
  function AppDataWriter({ rows, timeConfig }) {
    if (rows.length === 0) {
      return <LoadingIndicator />;
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

        {types.map(({ title, type, incomingKpi }) => (
          <Row key={type}>
            <Col lg={12}>
              <ExpandableCard title={`Pipeline behavior for: ${title || type}`}>
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
              </ExpandableCard>
            </Col>
          </Row>
        ))}

        <Row key={`raw-spans`}>
          <Col lg={12}>
            <ExpandableCard title={`Pipeline behavior for: Raw Spans`}>
              <Columize>
                <DashboardSection title={`Kafka Reads`}>
                  <Chart
                    snapshotIds={rows.map(r => r.dropwizard.get('id'))}
                    timeConfig={timeConfig}
                    customHeight={150}
                    y1={{
                      min: 0,
                      formatter: number.perSecond.compact,
                      metrics: rows.map(() => `metrics.meters.KPI.incoming.raw_spans.calls`),
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
                      metrics: rows.map(() => `metrics.meters.KPI.incoming.raw_spans.errors`),
                      labels,
                      type: 'stackedArea'
                    }}
                  />
                </DashboardSection>
              </Columize>

              <Columize>
                <DashboardSection title={`S3 Writes`}>
                  <Chart
                    snapshotIds={rows.map(r => r.dropwizard.get('id'))}
                    timeConfig={timeConfig}
                    customHeight={150}
                    y1={{
                      min: 0,
                      formatter: number.perSecond.compact,
                      metrics: rows.map(() => `metrics.meters.KPI.raw_spans.s3.store.calls`),
                      labels,
                      type: 'stackedArea'
                    }}
                  />
                </DashboardSection>
                <DashboardSection title={`S3 Errors`}>
                  <Chart
                    snapshotIds={rows.map(r => r.dropwizard.get('id'))}
                    timeConfig={timeConfig}
                    customHeight={150}
                    y1={{
                      min: 0,
                      formatter: number.perSecond.compact,
                      metrics: rows.map(() => `metrics.meters.KPI.raw_spans.s3.store.errors`),
                      labels,
                      type: 'stackedArea'
                    }}
                  />
                </DashboardSection>
              </Columize>

              <Columize>
                <DashboardSection title={`Avg File Size`}>
                  <Chart
                    snapshotIds={rows.map(r => r.dropwizard.get('id'))}
                    timeConfig={timeConfig}
                    customHeight={150}
                    y1={{
                      min: 0,
                      formatter: number.bytesZeroDecimalPlaces,
                      metrics: rows.map(
                        () =>
                          `metrics.histograms.com.instana.application.externalstorage.S3ExternalStorageClient.raw_spans.s3.file_size.mean`
                      ),
                      labels,
                      type: 'line'
                    }}
                  />
                </DashboardSection>
              </Columize>
            </ExpandableCard>
          </Col>
        </Row>

        <Row key={`raw-profiles`}>
          <Col lg={12}>
            <ExpandableCard title={`Pipeline behavior for: Raw Profiles (Cassandra)`}>
              <Columize>
                <DashboardSection title={`Cassandra writes`}>
                  <Chart
                    snapshotIds={rows.map(r => r.dropwizard.get('id'))}
                    timeConfig={timeConfig}
                    customHeight={150}
                    y1={{
                      min: 0,
                      formatter: number.perSecond.compact,
                      metrics: rows.map(
                        () =>
                          `metrics.meters.com.instana.appdata.writer.service.RawProfilesCassandraDownstream.num-written-profiles`
                      ),
                      labels,
                      type: 'stackedArea'
                    }}
                  />
                </DashboardSection>
                <DashboardSection title={`Cassandra errors`}>
                  <Chart
                    snapshotIds={rows.map(r => r.dropwizard.get('id'))}
                    timeConfig={timeConfig}
                    customHeight={150}
                    y1={{
                      min: 0,
                      formatter: number.perSecond.compact,
                      metrics: rows.map(
                        () =>
                          `metrics.meters.com.instana.appdata.writer.service.RawProfilesCassandraDownstream.num-failed-profiles`
                      ),
                      labels,
                      type: 'stackedArea'
                    }}
                  />
                </DashboardSection>
              </Columize>
            </ExpandableCard>
          </Col>
        </Row>
      </div>
    );
  }
);

function getLabel(row) {
  return row.host
    .get('label')
    .replace(/^(appdata-writer-(\d+)).*$/i, '$2')
    .replace('.instana.io', '')
    .replace('ip-', '');
}
