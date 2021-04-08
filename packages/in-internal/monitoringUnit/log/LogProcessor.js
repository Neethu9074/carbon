/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import { getDropwizardWithContext } from 'in-internal/monitoringUnit/dataRetrieval';
import LoadingIndicator from 'in-new-components/LoadingIndicators/LoadingIndicator';
import DashboardSection from 'in-sdk/components/dashboard/DashboardSection';
import Chart from 'in-components/Chart/InfrastructureMetricChartBehavior';
import Columize from 'in-sdk/components/dashboard/Columize';
import { compareIgnoreCase } from 'in-services/util/string';
import { number } from 'in-services/formatters/number';
import { timeConfig$ } from 'in-stores/time/config';
import connectTo from 'in-hoc/connectTo';
import { t } from 'in-i18n';

export default connectTo(
  {
    timeConfig: timeConfig$,
    rows: getDropwizardWithContext('entity.service.name:"log-processor"')
  },
  function LogProcessor({ rows, timeConfig }) {
    if (rows.length === 0) {
      return <LoadingIndicator />;
    }

    rows = rows.slice().sort((a, b) => compareIgnoreCase(a.host.get('label'), b.host.get('label')));
    const labels = rows.map(getLabel);

    return (
      <div>
        <h1>{t('in-internal:monitoringUnit.log.processor.name')}</h1>

        <DashboardSection title={t('in-internal:monitoringUnit.log.processor.hostCpuLoad')}>
          <Chart
            snapshotIds={rows.map(r => r.host.get('id'))}
            timeConfig={timeConfig}
            minRollup={5000}
            y1={{
              min: 0,
              formatter: number.detailed,
              metrics: rows.map(() => 'load.1min'),
              labels,
              type: 'line'
            }}
          />
        </DashboardSection>

        <Columize>
          <DashboardSection title={t('in-internal:monitoringUnit.log.processor.common.incoming')}>
            <Chart
              snapshotIds={rows.map(r => r.dropwizard.get('id'))}
              timeConfig={timeConfig}
              y1={{
                min: 0,
                formatter: number.perSecond.compact,
                metrics: rows.map(() => `metrics.meters.KPI.incoming.log_batches.calls`),
                labels,
                type: 'stackedArea'
              }}
            />
          </DashboardSection>

          <DashboardSection title={t('in-internal:monitoringUnit.log.processor.common.failIncoming')}>
            <Chart
              snapshotIds={rows.map(r => r.dropwizard.get('id'))}
              timeConfig={timeConfig}
              y1={{
                min: 0,
                formatter: number.perSecond.compact,
                metrics: rows.map(() => `metrics.meters.KPI.incoming.log_batches.errors`),
                labels,
                type: 'stackedArea'
              }}
            />
          </DashboardSection>
        </Columize>

        <Columize>
          <DashboardSection title={t('in-internal:monitoringUnit.log.processor.common.processing')}>
            <Chart
              snapshotIds={rows.map(r => r.dropwizard.get('id'))}
              timeConfig={timeConfig}
              y1={{
                min: 0,
                formatter: number.perSecond.compact,
                metrics: rows.map(() => `metrics.meters.KPI.processing.log_messages.calls`),
                labels,
                type: 'stackedArea'
              }}
            />
          </DashboardSection>

          <DashboardSection title={t('in-internal:monitoringUnit.log.processor.common.failProcessing')}>
            <Chart
              snapshotIds={rows.map(r => r.dropwizard.get('id'))}
              timeConfig={timeConfig}
              y1={{
                min: 0,
                formatter: number.perSecond.compact,
                metrics: rows.map(() => `metrics.meters.KPI.incoming.log_messages.errors`),
                labels,
                type: 'stackedArea'
              }}
            />
          </DashboardSection>
        </Columize>

        <Columize>
          <DashboardSection
            title={t('in-internal:monitoringUnit.log.processor.common.kafkaConsumer.availableCapacity')}
          >
            <Chart
              snapshotIds={rows.map(r => r.dropwizard.get('id'))}
              timeConfig={timeConfig}
              y1={{
                min: 0,
                formatter: number.detailed,
                metrics: rows.map(
                  () =>
                    `metrics.gauges.com.instana.backend.common.kafka.GenericReactorKafkaConsumer.log-batch-ingestion.available-capacity`
                ),
                labels,
                type: 'line'
              }}
            />
          </DashboardSection>
          <DashboardSection title={t('in-internal:monitoringUnit.log.processor.common.kafkaConsumer.emptyPolls')}>
            <Chart
              snapshotIds={rows.map(r => r.dropwizard.get('id'))}
              timeConfig={timeConfig}
              y1={{
                min: 0,
                formatter: number.perSecond.compact,
                metrics: rows.map(
                  () =>
                    `metrics.meters.com.instana.backend.common.kafka.GenericReactorKafkaConsumer.log-batch-ingestion.empty-polls`
                ),
                labels,
                type: 'stackedArea'
              }}
            />
          </DashboardSection>
          <DashboardSection title={t('in-internal:monitoringUnit.log.processor.common.kafkaConsumer.tooOld')}>
            <Chart
              snapshotIds={rows.map(r => r.dropwizard.get('id'))}
              timeConfig={timeConfig}
              y1={{
                min: 0,
                formatter: number.perSecond.compact,
                metrics: rows.map(
                  () =>
                    `metrics.meters.com.instana.backend.common.kafka.GenericReactorKafkaConsumer.log-batch-ingestion.too-old`
                ),
                labels,
                type: 'stackedArea'
              }}
            />
          </DashboardSection>
        </Columize>

        <Columize>
          <DashboardSection title={t('in-internal:monitoringUnit.log.processor.trace.incoming')}>
            <Chart
              snapshotIds={rows.map(r => r.dropwizard.get('id'))}
              timeConfig={timeConfig}
              y1={{
                min: 0,
                formatter: number.perSecond.compact,
                metrics: rows.map(() => `metrics.meters.KPI.incoming.trace_logs.calls`),
                labels,
                type: 'stackedArea'
              }}
            />
          </DashboardSection>

          <DashboardSection title={t('in-internal:monitoringUnit.log.processor.trace.failIncoming')}>
            <Chart
              snapshotIds={rows.map(r => r.dropwizard.get('id'))}
              timeConfig={timeConfig}
              y1={{
                min: 0,
                formatter: number.perSecond.compact,
                metrics: rows.map(() => `metrics.meters.KPI.incoming.trace_logs.errors`),
                labels,
                type: 'stackedArea'
              }}
            />
          </DashboardSection>
        </Columize>

        <Columize>
          <DashboardSection title={t('in-internal:monitoringUnit.log.processor.trace.processing')}>
            <Chart
              snapshotIds={rows.map(r => r.dropwizard.get('id'))}
              timeConfig={timeConfig}
              y1={{
                min: 0,
                formatter: number.perSecond.compact,
                metrics: rows.map(() => `metrics.meters.KPI.processing.trace_logs.calls`),
                labels,
                type: 'stackedArea'
              }}
            />
          </DashboardSection>

          <DashboardSection title={t('in-internal:monitoringUnit.log.processor.trace.failProcessing')}>
            <Chart
              snapshotIds={rows.map(r => r.dropwizard.get('id'))}
              timeConfig={timeConfig}
              y1={{
                min: 0,
                formatter: number.perSecond.compact,
                metrics: rows.map(() => `metrics.meters.KPI.processing.trace_logs.errors`),
                labels,
                type: 'stackedArea'
              }}
            />
          </DashboardSection>
        </Columize>

        <Columize>
          <DashboardSection title={t('in-internal:monitoringUnit.log.processor.trace.kafkaConsumer.availableCapacity')}>
            <Chart
              snapshotIds={rows.map(r => r.dropwizard.get('id'))}
              timeConfig={timeConfig}
              y1={{
                min: 0,
                formatter: number.detailed,
                metrics: rows.map(
                  () =>
                    `metrics.gauges.com.instana.backend.common.kafka.GenericReactorKafkaConsumer.trace-log-ingestion.available-capacity`
                ),
                labels,
                type: 'line'
              }}
            />
          </DashboardSection>
          <DashboardSection title={t('in-internal:monitoringUnit.log.processor.trace.kafkaConsumer.emptyPolls')}>
            <Chart
              snapshotIds={rows.map(r => r.dropwizard.get('id'))}
              timeConfig={timeConfig}
              y1={{
                min: 0,
                formatter: number.perSecond.compact,
                metrics: rows.map(
                  () =>
                    `metrics.meters.com.instana.backend.common.kafka.GenericReactorKafkaConsumer.trace-log-ingestion.empty-polls`
                ),
                labels,
                type: 'stackedArea'
              }}
            />
          </DashboardSection>
          <DashboardSection title={t('in-internal:monitoringUnit.log.processor.trace.kafkaConsumer.tooOld')}>
            <Chart
              snapshotIds={rows.map(r => r.dropwizard.get('id'))}
              timeConfig={timeConfig}
              y1={{
                min: 0,
                formatter: number.perSecond.compact,
                metrics: rows.map(
                  () =>
                    `metrics.meters.com.instana.backend.common.kafka.GenericReactorKafkaConsumer.trace-log-ingestion.too-old`
                ),
                labels,
                type: 'stackedArea'
              }}
            />
          </DashboardSection>
        </Columize>

        <Columize>
          <DashboardSection title={t('in-internal:monitoringUnit.log.processor.outgoing')}>
            <Chart
              snapshotIds={rows.map(r => r.dropwizard.get('id'))}
              timeConfig={timeConfig}
              y1={{
                min: 0,
                formatter: number.perSecond.compact,
                metrics: rows.map(() => `metrics.meters.KPI.outgoing.log_messages.calls`),
                labels,
                type: 'stackedArea'
              }}
            />
          </DashboardSection>

          <DashboardSection title={t('in-internal:monitoringUnit.log.processor.failOutgoing')}>
            <Chart
              snapshotIds={rows.map(r => r.dropwizard.get('id'))}
              timeConfig={timeConfig}
              y1={{
                min: 0,
                formatter: number.perSecond.compact,
                metrics: rows.map(() => `metrics.meters.KPI.outgoing.log_messages.errors`),
                labels,
                type: 'stackedArea'
              }}
            />
          </DashboardSection>
        </Columize>
      </div>
    );
  }
);

export function getLabel(row) {
  return row.host
    .get('label')
    .replace('.instana.io', '')
    .replace('ip-', '');
}
