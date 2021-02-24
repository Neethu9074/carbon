/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import { t } from 'in-i18n';
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
    title: t('in-internal:monitoringUnit.appdata.batchingInsights.calls'),
    type: 'calls',
    incomingKpi: 'KPI.incoming.calls'
  },
  {
    title: t('in-internal:monitoringUnit.appdata.batchingInsights.websiteBeaconsShort'),
    type: 'beacons.shortTerm',
    incomingKpi: 'KPI.incoming.website_monitoring_processed_beacons'
  },
  {
    title: t('in-internal:monitoringUnit.appdata.batchingInsights.websiteBeaconsLong'),
    type: 'beacons.longTerm'
  },
  {
    title: t('in-internal:monitoringUnit.appdata.batchingInsights.mobileAppBeaconsShort'),
    type: 'mobileBeacons.shortTerm',
    incomingKpi: 'KPI.incoming.mobile_app_monitoring_processed_beacons'
  },
  {
    title: t('in-internal:monitoringUnit.appdata.batchingInsights.mobileAppBeaconsLong'),
    type: 'mobileBeacons.longTerm'
  },
  {
    title: t('in-internal:monitoringUnit.appdata.batchingInsights.chains'),
    type: 'chains',
    incomingKpi: 'KPI.incoming.call_graphs'
  },
  {
    title: t('in-internal:monitoringUnit.appdata.batchingInsights.logs'),
    type: 'logs',
    incomingKpi: 'KPI.incoming.logs'
  },
  {
    title: t('in-internal:monitoringUnit.appdata.batchingInsights.profileInfosClickHouse'),
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
          <DashboardSection title={t('in-internal:monitoringUnit.appdata.batchingInsights.hostCpuLoad')}>
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

          <DashboardSection title={t('in-internal:monitoringUnit.appdata.batchingInsights.garbageCollectionAct')}>
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
              <ExpandableCard title={t('in-internal:monitoringUnit.appdata.batchingInsights.pipelineBehaviorFor', {titleOrType: title || type})}>
                {incomingKpi && (
                  <Columize>
                    <DashboardSection title={t('in-internal:monitoringUnit.appdata.batchingInsights.kafkaReads')}>
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

                    <DashboardSection title={t('in-internal:monitoringUnit.appdata.batchingInsights.dropped')}>
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
                  <DashboardSection title={t('in-internal:monitoringUnit.appdata.batchingInsights.batchAdditions')}>
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

                  <DashboardSection title={t('in-internal:monitoringUnit.appdata.batchingInsights.batchAdditionFailures')}>
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

                <DashboardSection title={t('in-internal:monitoringUnit.appdata.batchingInsights.usageMaxAllowedBatchSize')}>
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
                  <DashboardSection title={t('in-internal:monitoringUnit.appdata.batchingInsights.batchTransmissions')}>
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

                  <DashboardSection title={t('in-internal:monitoringUnit.appdata.batchingInsights.batchTransmissionFail')}>
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
            <ExpandableCard title={t('in-internal:monitoringUnit.appdata.batchingInsights.pipelineBehaviorRawSpans')}>
              <Columize>
                <DashboardSection title={t('in-internal:monitoringUnit.appdata.batchingInsights.kafkaReads')}>
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
                <DashboardSection title={t('in-internal:monitoringUnit.appdata.batchingInsights.dropped')}>
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
                <DashboardSection title={t('in-internal:monitoringUnit.appdata.batchingInsights.s3Writes')}>
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
                <DashboardSection title={t('in-internal:monitoringUnit.appdata.batchingInsights.s3Err')}>
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
                <DashboardSection title={t('in-internal:monitoringUnit.appdata.batchingInsights.avgFileSize')}>
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
            <ExpandableCard title={t('in-internal:monitoringUnit.appdata.batchingInsights.pipelinebehaviorRawProfilesCassandra')}>
              <Columize>
                <DashboardSection title={t('in-internal:monitoringUnit.appdata.batchingInsights.cassandraWrites')}>
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
                <DashboardSection title={t('in-internal:monitoringUnit.appdata.batchingInsights.cassandraErr')}>
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
