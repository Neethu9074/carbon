/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import React, { Fragment } from 'react';
import { t } from 'in-i18n';

import { hostTableCols } from 'in-internal/monitoringUnit/sre/datastores';
import { percentageZeroDecimalPlaces } from 'in-services/formatters/number';
import { getBeeInstanaAggregatorWithContext } from 'in-internal/monitoringUnit/dataRetrieval';
import LoadingIndicator from 'in-new-components/LoadingIndicators/LoadingIndicator';
import { number, millis } from 'in-services/formatters/number';
import DashboardSection from 'in-sdk/components/dashboard/DashboardSection';
import Chart from 'in-components/Chart/InfrastructureMetricChartBehavior';
import Columize from 'in-sdk/components/dashboard/Columize';
import { compareIgnoreCase } from 'in-services/util/string';
import Table from 'in-sdk/components/dashboard/Table';
import { timeConfig$ } from 'in-stores/time/config';
import connectTo from 'in-hoc/connectTo';

export default connectTo(
  {
    timeConfig: timeConfig$,
    ingestors: getBeeInstanaAggregatorWithContext('"beeinstana ingestor"')
  },
  function Overview({ ingestors, timeConfig }) {
    if (ingestors.length === 0) {
      return <LoadingIndicator />;
    }

    ingestors = sort(ingestors);
    const ingestorLabels = ingestors.map(r => r.host.get('label').replace('.instana.io', ''));

    return (
      <div>
        <h1>
          {t('in-internal:monitoringUnit.sre.beeInstanaIngestor.beeInstanaIngest', { ingestorsLen: ingestors.length })}
        </h1>
        <Columize>
          <DashboardSection title={t('in-internal:monitoringUnit.sre.beeInstanaIngestor.metrics')}>
            <Chart
              snapshotIds={ingestors.map(r => r.beeinstana.get('id'))}
              timeConfig={timeConfig}
              y1={{
                min: 0,
                metrics: ingestors.map(() => `Ingestor.AggregatorFlushByTimeAndPartition.NumOfMetrics.sum`),
                type: 'line',
                formatter: number.compact,
                labels: ingestorLabels
              }}
            />
          </DashboardSection>
          <DashboardSection title={t('in-internal:monitoringUnit.sre.beeInstanaIngestor.messages')}>
            <Chart
              snapshotIds={ingestors.map(r => r.beeinstana.get('id'))}
              timeConfig={timeConfig}
              y1={{
                min: 0,
                metrics: ingestors.map(() => `Ingestor.KafkaConsumer.MessageDelay.count`),
                type: 'line',
                formatter: number.compact,
                labels: ingestorLabels
              }}
            />
          </DashboardSection>
        </Columize>
        <Columize>
          <DashboardSection title={t('in-internal:monitoringUnit.sre.beeInstanaIngestor.kafkaConsumerErrors')}>
            <Chart
              snapshotIds={ingestors.map(r => r.beeinstana.get('id'))}
              timeConfig={timeConfig}
              y1={{
                min: 0,
                metrics: ingestors.map(() => `Ingestor.KafkaConsumer.Error.sum`),
                type: 'line',
                formatter: number.compact,
                labels: ingestorLabels
              }}
            />
          </DashboardSection>
          <DashboardSection title={t('in-internal:monitoringUnit.sre.beeInstanaIngestor.messageDelay')}>
            <Chart
              snapshotIds={ingestors.map(r => r.beeinstana.get('id'))}
              timeConfig={timeConfig}
              y1={{
                min: 0,
                metrics: ingestors.map(() => `Ingestor.KafkaConsumer.MessageDelay.max`),
                type: 'line',
                formatter: millis.compact,
                labels: ingestorLabels
              }}
            />
          </DashboardSection>
        </Columize>
        <Columize>
          <DashboardSection title={t('in-internal:monitoringUnit.sre.beeInstanaIngestor.queueWorkerMaxQueueSize')}>
            <Chart
              snapshotIds={ingestors.map(r => r.beeinstana.get('id'))}
              timeConfig={timeConfig}
              y1={{
                min: 0,
                metrics: ingestors.map(() => `Ingestor.Configuration.MaxQueueSize.max`),
                type: 'line',
                formatter: number.detailed,
                labels: ingestorLabels
              }}
            />
          </DashboardSection>
          <DashboardSection title={t('in-internal:monitoringUnit.sre.beeInstanaIngestor.queueWorkerTaskQueueSize')}>
            <Chart
              snapshotIds={ingestors.map(r => r.beeinstana.get('id'))}
              timeConfig={timeConfig}
              y1={{
                min: 0,
                metrics: ingestors.map(() => `Ingestor.KafkaConsumer.TaskQueueSize.max`),
                type: 'line',
                formatter: number.detailed,
                labels: ingestorLabels
              }}
            />
          </DashboardSection>
        </Columize>
        <Columize>
          <DashboardSection
            title={t('in-internal:monitoringUnit.sre.beeInstanaIngestor.hostsIngestorsLen', {
              ingestorsLen: ingestors.length
            })}
          >
            <Table cols={hostTableCols} rows={ingestors} getRowDetails={getRowDetails} />
          </DashboardSection>
        </Columize>
      </div>
    );
  }
);

function sort(rows) {
  return rows.slice().sort((a, b) => compareIgnoreCase(a.host.get('label'), b.host.get('label')));
}

function getRowDetails(row) {
  return (
    <Fragment>
      <DashboardSection title={t('in-internal:monitoringUnit.sre.beeInstanaIngestor.cpuUsage')}>
        <Chart
          snapshotId={row.host.get('id')}
          timeConfig={row.timeConfig}
          y1={{
            min: 0,
            max: 1,
            formatter: percentageZeroDecimalPlaces,
            metrics: ['cpu.user', 'cpu.sys', 'cpu.wait', 'cpu.nice', 'cpu.steal'],
            labels: [
              t('in-internal:monitoringUnit.sre.user'),
              t('in-internal:monitoringUnit.sre.system'),
              t('in-internal:monitoringUnit.sre.wait'),
              t('in-internal:monitoringUnit.sre.nice'),
              t('in-internal:monitoringUnit.sre.steal')
            ],
            type: 'stackedArea'
          }}
        />
      </DashboardSection>
    </Fragment>
  );
}
