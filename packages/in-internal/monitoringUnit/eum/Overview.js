/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import { getLabel as getJsStackTraceTranslatorLabel } from 'in-internal/monitoringUnit/eum/JsStackTraceTranslator';
import { hostTableCols, getHostDetails } from 'in-internal/monitoringUnit/sre/datastores';
import { getDropwizardWithContext } from 'in-internal/monitoringUnit/dataRetrieval';
import LoadingIndicator from 'in-components/LoadingIndicators/LoadingIndicator';
import { getNginxWithContext } from 'in-internal/monitoringUnit/dataRetrieval';
import DashboardSection from 'in-sdk/components/dashboard/DashboardSection';
import Chart from 'in-components/Chart/InfrastructureMetricChartBehavior';
import { number, time } from 'in-services/formatters/number';
import Columize from 'in-sdk/components/dashboard/Columize';
import { compareIgnoreCase } from 'in-services/util/string';
import Table from 'in-sdk/components/dashboard/Table';
import { timeConfig$ } from 'in-stores/time/config';
import connectTo from 'in-hoc/connectTo';
import { t } from 'in-i18n';

export default connectTo(
  {
    timeConfig: timeConfig$,
    appdataWriters: getDropwizardWithContext('entity.jvm.app.name:"appdata-writer"'),
    eumAcceptors: getDropwizardWithContext('entity.jvm.app.name:"eum-acceptor"'),
    eumProcessors: getDropwizardWithContext('entity.jvm.app.name:"eum-processor"'),
    jsStackTraceTranslators: getDropwizardWithContext('entity.jvm.app.name:"js-stack-trace-translator"'),
    eumLoadbalancers: getNginxWithContext('entity.host.name:"loadbalancer-eum-*"')
  },
  function Overview({
    appdataWriters,
    eumAcceptors,
    eumProcessors,
    eumLoadbalancers,
    jsStackTraceTranslators,
    timeConfig
  }) {
    // Not deployed everywhere as of 2019-08-06
    jsStackTraceTranslators = jsStackTraceTranslators || [];

    if (appdataWriters.length === 0 || eumAcceptors.length === 0 || eumProcessors.length === 0) {
      return <LoadingIndicator />;
    }

    appdataWriters = sort(appdataWriters);
    const appdataWriterLabels = getLabels(appdataWriters, /^(appdata-writer-\d+).*$/i);
    eumAcceptors = sort(eumAcceptors);
    const eumAcceptorLabels = getLabels(eumAcceptors, /^(eum-acceptor-\d+).*$/i);
    eumProcessors = sort(eumProcessors);
    const eumProcessorLabels = getLabels(eumProcessors, /^(eum-processor-\d+).*$/i);
    let eumLoadbalancerLabels;
    if (eumLoadbalancers) {
      eumLoadbalancers = sort(eumLoadbalancers);
      eumLoadbalancerLabels = getLabels(eumLoadbalancers, /^(loadbalancer-eum-\d+).*$/i);
    }
    jsStackTraceTranslators = jsStackTraceTranslators
      .slice()
      .sort((a, b) => compareIgnoreCase(getJsStackTraceTranslatorLabel(a), getJsStackTraceTranslatorLabel(b)));
    const jsStackTraceTranslatorsLabels = jsStackTraceTranslators.map(getJsStackTraceTranslatorLabel);

    return (
      <div>
        {eumLoadbalancers?.length > 0 && (
          <>
            <h1>{t('in-internal:monitoringUnit.eum.overview.loadbalancerEumEdge')}</h1>

            <Columize>
              <DashboardSection title={t('in-internal:monitoringUnit.eum.overview.requests')}>
                <Chart
                  snapshotIds={eumLoadbalancers.map(r => r.nginx.get('id'))}
                  timeConfig={timeConfig}
                  y1={{
                    min: 0,
                    formatter: number.perSecond.compact,
                    metrics: eumLoadbalancers.map(() => `requests`),
                    labels: eumLoadbalancerLabels,
                    type: 'stackedArea'
                  }}
                />
              </DashboardSection>

              <DashboardSection title={t('in-internal:monitoringUnit.eum.overview.dropConnection')}>
                <Chart
                  snapshotIds={eumLoadbalancers.map(r => r.nginx.get('id'))}
                  timeConfig={timeConfig}
                  y1={{
                    min: 0,
                    formatter: number.perSecond.compact,
                    metrics: eumLoadbalancers.map(() => `connections.dropped`),
                    labels: eumLoadbalancerLabels,
                    type: 'line'
                  }}
                />
              </DashboardSection>
            </Columize>

            <Columize>
              <DashboardSection title={t('in-internal:monitoringUnit.eum.overview.cpuLoad')}>
                <Chart
                  snapshotIds={eumLoadbalancers.map(r => r.host.get('id'))}
                  timeConfig={timeConfig}
                  minRollup={5000}
                  y1={{
                    min: 0,
                    formatter: number.detailed,
                    tooltipFormatter: number.detailed,
                    metrics: eumLoadbalancers.map(() => 'load.1min'),
                    labels: eumLoadbalancers.map(r => r.host.get('label')),
                    type: 'line'
                  }}
                />
              </DashboardSection>

              <Table
                cardTitle={t('in-internal:monitoringUnit.eum.overview.cpuUsage')}
                cols={hostTableCols}
                rows={eumLoadbalancers}
                getRowDetails={getHostDetails}
                maxItemsPerPage={5}
              />
            </Columize>
          </>
        )}

        <h1>{t('in-internal:monitoringUnit.eum.overview.eumAcceptorDataCollection')}</h1>

        <Columize>
          <DashboardSection title={t('in-internal:monitoringUnit.eum.overview.beaconRequest')}>
            <Chart
              snapshotIds={eumAcceptors.map(r => r.dropwizard.get('id'))}
              timeConfig={timeConfig}
              y1={{
                min: 0,
                formatter: number.perSecond.compact,
                metrics: eumAcceptors.map(() => `metrics.meters.instana.beaconRequests.total`),
                labels: eumAcceptorLabels,
                type: 'stackedArea'
              }}
            />
          </DashboardSection>

          <DashboardSection title={t('in-internal:monitoringUnit.eum.overview.youngGenGcTime')}>
            <Chart
              snapshotIds={eumAcceptors.map(r => r.jvm.get('id'))}
              timeConfig={timeConfig}
              minRollup={5000}
              y1={{
                min: 0,
                formatter: time,
                tooltipFormatter: number.detailed,
                metrics: eumAcceptors.map(() => 'gc.G1 Young Generation.time'),
                labels: eumAcceptorLabels,
                type: 'line'
              }}
            />
          </DashboardSection>
        </Columize>

        <h1>{t('in-internal:monitoringUnit.eum.overview.jsStackTraceTrxDataPreProc')}</h1>

        <Columize>
          <DashboardSection title={t('in-internal:monitoringUnit.eum.overview.incomingWebsiteBeacons')}>
            <Chart
              snapshotIds={jsStackTraceTranslators.map(r => r.dropwizard.get('id'))}
              timeConfig={timeConfig}
              y1={{
                min: 0,
                formatter: number.perSecond.compact,
                metrics: jsStackTraceTranslators.map(() => `metrics.meters.KPI.incoming.beacons.calls`),
                labels: jsStackTraceTranslatorsLabels,
                type: 'stackedArea'
              }}
            />
          </DashboardSection>

          <DashboardSection title={t('in-internal:monitoringUnit.eum.overview.failIncomingWebsiteBeacon')}>
            <Chart
              snapshotIds={jsStackTraceTranslators.map(r => r.dropwizard.get('id'))}
              timeConfig={timeConfig}
              y1={{
                min: 0,
                formatter: number.perSecond.compact,
                metrics: jsStackTraceTranslators.map(() => `metrics.meters.KPI.incoming.beacons.errors`),
                labels: jsStackTraceTranslatorsLabels,
                type: 'stackedArea'
              }}
            />
          </DashboardSection>
        </Columize>

        <Columize>
          <DashboardSection title={t('in-internal:monitoringUnit.eum.overview.outgoingBeacon')}>
            <Chart
              snapshotIds={jsStackTraceTranslators.map(r => r.dropwizard.get('id'))}
              timeConfig={timeConfig}
              y1={{
                min: 0,
                formatter: number.perSecond.compact,
                metrics: jsStackTraceTranslators.map(() => `metrics.meters.KPI.outgoing.beacons.calls`),
                labels: jsStackTraceTranslatorsLabels,
                type: 'stackedArea'
              }}
            />
          </DashboardSection>

          <DashboardSection title={t('in-internal:monitoringUnit.eum.overview.failOutgoingBeacon')}>
            <Chart
              snapshotIds={jsStackTraceTranslators.map(r => r.dropwizard.get('id'))}
              timeConfig={timeConfig}
              y1={{
                min: 0,
                formatter: number.perSecond.compact,
                metrics: jsStackTraceTranslators.map(() => `metrics.meters.KPI.outgoing.beacons.errors`),
                labels: jsStackTraceTranslatorsLabels,
                type: 'stackedArea'
              }}
            />
          </DashboardSection>
        </Columize>

        <h1>{t('in-internal:monitoringUnit.eum.overview.eumProcDataProc')}</h1>

        <Columize>
          <DashboardSection title={t('in-internal:monitoringUnit.eum.overview.incomingWebsiteBeacon')}>
            <Chart
              snapshotIds={eumProcessors.map(r => r.dropwizard.get('id'))}
              timeConfig={timeConfig}
              y1={{
                min: 0,
                formatter: number.perSecond.compact,
                metrics: eumProcessors.map(() => `metrics.meters.KPI.incoming.website_monitoring_beacons.calls`),
                labels: eumProcessorLabels,
                type: 'stackedArea'
              }}
            />
          </DashboardSection>

          <DashboardSection title={t('in-internal:monitoringUnit.eum.overview.failIncomingWebsiteBeacon')}>
            <Chart
              snapshotIds={eumProcessors.map(r => r.dropwizard.get('id'))}
              timeConfig={timeConfig}
              y1={{
                min: 0,
                formatter: number.perSecond.compact,
                metrics: eumProcessors.map(() => `metrics.meters.KPI.incoming.website_monitoring_beacons.errors`),
                labels: eumProcessorLabels,
                type: 'stackedArea'
              }}
            />
          </DashboardSection>
        </Columize>

        <Columize>
          <DashboardSection title={t('in-internal:monitoringUnit.eum.overview.outgoingProcessWebsiteBeacon')}>
            <Chart
              snapshotIds={eumProcessors.map(r => r.dropwizard.get('id'))}
              timeConfig={timeConfig}
              y1={{
                min: 0,
                formatter: number.perSecond.compact,
                metrics: eumProcessors.map(
                  () => `metrics.meters.KPI.outgoing.processed_website_monitoring_beacons.calls`
                ),
                labels: eumProcessorLabels,
                type: 'stackedArea'
              }}
            />
          </DashboardSection>

          <DashboardSection title={t('in-internal:monitoringUnit.eum.overview.failOutgoingProcessWebsiteBeacon')}>
            <Chart
              snapshotIds={eumProcessors.map(r => r.dropwizard.get('id'))}
              timeConfig={timeConfig}
              y1={{
                min: 0,
                formatter: number.perSecond.compact,
                metrics: eumProcessors.map(
                  () => `metrics.meters.KPI.outgoing.processed_website_monitoring_beacons.errors`
                ),
                labels: eumProcessorLabels,
                type: 'stackedArea'
              }}
            />
          </DashboardSection>
        </Columize>

        <h1>{t('in-internal:monitoringUnit.eum.overview.appdataWriterDataIngest')}</h1>

        <Columize>
          <DashboardSection title={t('in-internal:monitoringUnit.eum.overview.incomingProcessWebsiteBeacon')}>
            <Chart
              snapshotIds={appdataWriters.map(r => r.dropwizard.get('id'))}
              timeConfig={timeConfig}
              y1={{
                min: 0,
                formatter: number.perSecond.compact,
                metrics: appdataWriters.map(
                  () => `metrics.meters.KPI.incoming.website_monitoring_processed_beacons.calls`
                ),
                labels: appdataWriterLabels,
                type: 'stackedArea'
              }}
            />
          </DashboardSection>

          <DashboardSection title={t('in-internal:monitoringUnit.eum.overview.failIncomingProcessWebsiteBeacon')}>
            <Chart
              snapshotIds={appdataWriters.map(r => r.dropwizard.get('id'))}
              timeConfig={timeConfig}
              y1={{
                min: 0,
                formatter: number.perSecond.compact,
                metrics: appdataWriters.map(
                  () => `metrics.meters.KPI.incoming.website_monitoring_processed_beacons.errors`
                ),
                labels: appdataWriterLabels,
                type: 'stackedArea'
              }}
            />
          </DashboardSection>
        </Columize>

        <Columize>
          <DashboardSection title={t('in-internal:monitoringUnit.eum.overview.shortBeaconBatchWrite')}>
            <Chart
              snapshotIds={appdataWriters.map(r => r.dropwizard.get('id'))}
              timeConfig={timeConfig}
              y1={{
                min: 0,
                formatter: number.perSecond.compact,
                metrics: appdataWriters.map(() => `metrics.meters.batching.beacons.shortTerm.transmissions.calls`),
                labels: appdataWriterLabels,
                type: 'stackedArea'
              }}
            />
          </DashboardSection>

          <DashboardSection title={t('in-internal:monitoringUnit.eum.overview.shortBeaconBatchWriteFail')}>
            <Chart
              snapshotIds={appdataWriters.map(r => r.dropwizard.get('id'))}
              timeConfig={timeConfig}
              y1={{
                min: 0,
                formatter: number.perSecond.compact,
                metrics: appdataWriters.map(() => `metrics.meters.batching.beacons.shortTerm.transmissions.errors`),
                labels: appdataWriterLabels,
                type: 'stackedArea'
              }}
            />
          </DashboardSection>
        </Columize>

        <Columize>
          <DashboardSection title={t('in-internal:monitoringUnit.eum.overview.longBeaconBatchWrite')}>
            <Chart
              snapshotIds={appdataWriters.map(r => r.dropwizard.get('id'))}
              timeConfig={timeConfig}
              y1={{
                min: 0,
                formatter: number.perSecond.compact,
                metrics: appdataWriters.map(() => `metrics.meters.batching.beacons.longTerm.transmissions.calls`),
                labels: appdataWriterLabels,
                type: 'stackedArea'
              }}
            />
          </DashboardSection>

          <DashboardSection title={t('in-internal:monitoringUnit.eum.overview.longBeaconBatchWriteFail')}>
            <Chart
              snapshotIds={appdataWriters.map(r => r.dropwizard.get('id'))}
              timeConfig={timeConfig}
              y1={{
                min: 0,
                formatter: number.perSecond.compact,
                metrics: appdataWriters.map(() => `metrics.meters.batching.beacons.longTerm.transmissions.errors`),
                labels: appdataWriterLabels,
                type: 'stackedArea'
              }}
            />
          </DashboardSection>
        </Columize>
      </div>
    );
  }
);

function sort(rows) {
  return rows.slice().sort((a, b) => compareIgnoreCase(a.host.get('label'), b.host.get('label')));
}

function getLabels(rows, regexp) {
  return rows.map(r =>
    r.host
      .get('label')
      .replace(regexp, '$1')
      .replace('.instana.io', '')
      .replace('ip-', '')
  );
}
