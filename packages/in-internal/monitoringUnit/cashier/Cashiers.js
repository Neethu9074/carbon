/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import { Typography } from '@instana/components';

import { number, millis, timeByMillisTwoDecimalPlaces } from 'in-services/formatters/number';
import { getDropwizardWithContext } from 'in-internal/monitoringUnit/dataRetrieval';
import Chart from 'in-infrastructure/components/InfrastructureMetricChartBehavior';
import DashboardSection from 'in-sdk/components/dashboard/DashboardSection';
import { compareIgnoreCase } from 'in-services/util/string';
import Columize from 'in-sdk/components/dashboard/Columize';
import { timeConfig$ } from 'in-stores/time/config';
import connectTo from 'in-hoc/connectTo';
import { t } from 'in-i18n';

import locals from 'in-internal/monitoringUnit/cashier/Cashiers.mless';

export default connectTo(
  {
    timeConfig: timeConfig$,
    cashieracceptors: getDropwizardWithContext('entity.kubernetes.deployment.name:"cashier-acceptor"'),
    cashierusagetransfers: getDropwizardWithContext('entity.jvm.app.name:"cashier-usage-transfer"'),
    cashieringests: getDropwizardWithContext('entity.kubernetes.deployment.name:"cashier-ingest"'),
    cashierrollups: getDropwizardWithContext('entity.kubernetes.deployment.name:"cashier-rollup"')
  },
  function Overview({ cashieracceptors, cashierusagetransfers, cashieringests, cashierrollups, timeConfig }) {
    cashierusagetransfers = sort(cashierusagetransfers);
    const cashierusagetransfersLabels = getLabels(cashierusagetransfers, /^(fleet-worker-\d+).*$/i);

    cashieracceptors = sort(cashieracceptors);
    const acceptorLabels = getLabels(cashieracceptors, /^(k8s-worker-\d+).*$/i);

    cashieringests = sort(cashieringests);
    const cashieringestsLabels = getLabels(cashieringests, /^(k8s-worker-\d+).*$/i);

    cashierrollups = sort(cashierrollups);
    const cashierrollupsLabels = getLabels(cashierrollups, /^(k8s-worker-\d+).*$/i);

    return (
      <div>
        <Typography variant="heading-03">{t('in-internal:monitoringUnit.cashier.cashierUsageTransfer')}</Typography>
        <Typography variant="label-01" component="p">
          {t('in-internal:monitoringUnit.cashier.cashierUsageTransferExplanation')}
        </Typography>
        <Columize>
          <DashboardSection title={t('in-internal:monitoringUnit.cashier.consumedCashierReports')}>
            <span>{t('in-internal:monitoringUnit.cashier.cashierUsageTransferHowManyReports')}</span>
            <Chart
              snapshotIds={cashierusagetransfers.map(r => r.dropwizard.get('id'))}
              timeConfig={timeConfig}
              y1={{
                min: 0,
                formatter: number.perSecond.compact,
                metrics: cashierusagetransfers.map(
                  () =>
                    'metrics.meters.com.instana.cashierusagetransfer.service.processing.MultiPayloadAcceptor.consumed-cashier-reports-multi'
                ),
                labels: cashierusagetransfersLabels,
                type: 'stackedArea'
              }}
            />
          </DashboardSection>

          <DashboardSection title={t('in-internal:monitoringUnit.cashier.fwdPayloadAcceptorTimeRate')}>
            <p>{t('in-internal:monitoringUnit.cashier.cashierUsageTransferHowOftenMessagesForwarded')}</p>
            <Chart
              snapshotIds={cashierusagetransfers.map(r => r.dropwizard.get('id'))}
              timeConfig={timeConfig}
              y1={{
                formatter: number.perSecond.compact,
                metrics: cashierusagetransfers.map(
                  () =>
                    'metrics.timers.com.instana.cashierusagetransfer.service.acceptor.CashierAcceptorClient.forward-payload-to-acceptor-timer.rate'
                ),
                labels: cashierusagetransfersLabels,
                type: 'stackedArea'
              }}
            />
          </DashboardSection>
        </Columize>
        <Columize>
          <DashboardSection title={t('in-internal:monitoringUnit.cashier.kafkaLagTimer99th')}>
            <p>
              {t('in-internal:monitoringUnit.cashier.cashierUsageTransferLagBetweenTimeOfCashierMessageAndConsumption')}
            </p>
            <Chart
              snapshotIds={cashierusagetransfers.map(r => r.dropwizard.get('id'))}
              timeConfig={timeConfig}
              y1={{
                min: 0,
                formatter: timeByMillisTwoDecimalPlaces,
                metrics: cashierusagetransfers.map(
                  () =>
                    'metrics.timers.com.instana.cashierusagetransfer.service.processing.MultiPayloadAcceptor.kafka-lag-multi.99th'
                ),
                labels: cashierusagetransfersLabels,
                type: 'line'
              }}
            />
          </DashboardSection>
          <DashboardSection title={t('in-internal:monitoringUnit.cashier.kafkaLagTimerMean')}>
            <p>
              {t('in-internal:monitoringUnit.cashier.cashierUsageTransferLagBetweenTimeOfCashierMessageAndConsumption')}
            </p>
            <Chart
              snapshotIds={cashierusagetransfers.map(r => r.dropwizard.get('id'))}
              timeConfig={timeConfig}
              y1={{
                min: 0,
                formatter: timeByMillisTwoDecimalPlaces,
                metrics: cashierusagetransfers.map(
                  () =>
                    'metrics.timers.com.instana.cashierusagetransfer.service.processing.MultiPayloadAcceptor.kafka-lag-multi.mean'
                ),
                labels: cashierusagetransfersLabels,
                type: 'line'
              }}
            />
          </DashboardSection>
        </Columize>
        <Columize>
          <DashboardSection title={t('in-internal:monitoringUnit.cashier.fwdPayloadAcceptorTimerMean')}>
            <p>{t('in-internal:monitoringUnit.cashier.cashierUsageTransferHowLongDoesForwardingNeed')}</p>
            <Chart
              snapshotIds={cashierusagetransfers.map(r => r.dropwizard.get('id'))}
              timeConfig={timeConfig}
              y1={{
                formatter: millis.fixedCompact,
                metrics: cashierusagetransfers.map(
                  () =>
                    'metrics.timers.com.instana.cashierusagetransfer.service.acceptor.CashierAcceptorClient.forward-payload-to-acceptor-timer.mean'
                ),
                labels: cashierusagetransfersLabels,
                type: 'line'
              }}
            />
          </DashboardSection>
          <DashboardSection title={t('in-internal:monitoringUnit.cashier.fwdPayloadAcceptorTimer50')}>
            <p>{t('in-internal:monitoringUnit.cashier.cashierUsageTransferHowLongDoesForwardingNeed')}</p>
            <Chart
              snapshotIds={cashierusagetransfers.map(r => r.dropwizard.get('id'))}
              timeConfig={timeConfig}
              y1={{
                formatter: millis.fixedCompact,
                metrics: cashierusagetransfers.map(
                  () =>
                    'metrics.timers.com.instana.cashierusagetransfer.service.acceptor.CashierAcceptorClient.forward-payload-to-acceptor-timer.50th'
                ),
                labels: cashierusagetransfersLabels,
                type: 'line'
              }}
            />
          </DashboardSection>
          <DashboardSection title={t('in-internal:monitoringUnit.cashier.fwdPayloadAcceptorTimer99')}>
            <p>{t('in-internal:monitoringUnit.cashier.cashierUsageTransferHowLongDoesForwardingNeed')}</p>
            <Chart
              snapshotIds={cashierusagetransfers.map(r => r.dropwizard.get('id'))}
              timeConfig={timeConfig}
              y1={{
                formatter: millis.fixedCompact,
                metrics: cashierusagetransfers.map(
                  () =>
                    'metrics.timers.com.instana.cashierusagetransfer.service.acceptor.CashierAcceptorClient.forward-payload-to-acceptor-timer.99th'
                ),
                labels: cashierusagetransfersLabels,
                type: 'line'
              }}
            />
          </DashboardSection>
        </Columize>
        <Columize>
          <DashboardSection title={t('in-internal:monitoringUnit.cashier.genReactorKafkaConsumerAvailCapacity')}>
            <p>{t('in-internal:monitoringUnit.cashier.cashierUsageTransferHowManyKafkaConsumersAvailable')}</p>
            <Chart
              snapshotIds={cashierusagetransfers.map(r => r.dropwizard.get('id'))}
              timeConfig={timeConfig}
              y1={{
                min: 0,
                formatter: number.detailed,
                metrics: cashierusagetransfers.map(
                  () =>
                    'metrics.gauges.com.instana.backend.common.kafka.GenericReactorKafkaConsumer.usage_reporting.available-capacity'
                ),
                labels: cashierusagetransfersLabels,
                type: 'line'
              }}
            />
          </DashboardSection>
        </Columize>

        <hr className={locals.divider} />

        <Typography variant="heading-03">{t('in-internal:monitoringUnit.cashier.cashierAcceptor')}</Typography>
        <Typography variant="label-01" component="p">
          {t('in-internal:monitoringUnit.cashier.cashierAcceptorExplanation')}
        </Typography>
        <Columize>
          <DashboardSection title={t('in-internal:monitoringUnit.cashier.writes')}>
            <p>{t('in-internal:monitoringUnit.cashier.cashierAcceptorHowManyWritesToKafka')}</p>
            <Chart
              snapshotIds={cashieracceptors.map(r => r.dropwizard.get('id'))}
              timeConfig={timeConfig}
              y1={{
                min: 0,
                formatter: number.perSecond.compact,
                metrics: cashieracceptors.map(() => 'metrics.meters.kafka.writes.by_topic.usage_reporting_transfer'),
                labels: acceptorLabels,
                type: 'stackedArea'
              }}
            />
          </DashboardSection>
        </Columize>

        <hr className={locals.divider} />

        <Typography variant="heading-03">{t('in-internal:monitoringUnit.cashier.cashierIngest')}</Typography>
        <Typography variant="label-01" component="p">
          {t('in-internal:monitoringUnit.cashier.cashierIngestExplanation')}
        </Typography>
        <Columize>
          <DashboardSection title={t('in-internal:monitoringUnit.cashier.aggregatedCashierReports')}>
            <p>{t('in-internal:monitoringUnit.cashier.cashierIngestHowManyMessagesAreBeingAggregated')}</p>
            <Chart
              snapshotIds={cashieringests.map(r => r.dropwizard.get('id'))}
              timeConfig={timeConfig}
              y1={{
                min: 0,
                formatter: number.perSecond.compact,
                metrics: cashieringests.map(
                  () =>
                    'metrics.meters.com.instana.cashieringest.service.kafka.KafkaStreamAggregatorUsageReporting.aggregated-cashier-reports'
                ),
                labels: cashieringestsLabels,
                type: 'stackedArea'
              }}
            />
          </DashboardSection>

          <DashboardSection title={t('in-internal:monitoringUnit.cashier.emittedCashierReports')}>
            <p>{t('in-internal:monitoringUnit.cashier.cashierIngestHowManyMessagesHaveBeenEmittedAfterAggregation')}</p>
            <Chart
              snapshotIds={cashieringests.map(r => r.dropwizard.get('id'))}
              timeConfig={timeConfig}
              y1={{
                min: 0,
                formatter: number.perSecond.compact,
                metrics: cashieringests.map(
                  () =>
                    'metrics.meters.com.instana.cashieringest.service.kafka.KafkaStreamAggregatorUsageReporting.emitted-cashier-reports'
                ),
                labels: cashieringestsLabels,
                type: 'stackedArea'
              }}
            />
          </DashboardSection>
        </Columize>
        <Columize>
          <DashboardSection title={t('in-internal:monitoringUnit.cashier.aggregatedKafkaStreamsLagTimer99th')}>
            <p>{t('in-internal:monitoringUnit.cashier.cashierIngestLagBetweenMessageAndAggregation')}</p>
            <Chart
              snapshotIds={cashieringests.map(r => r.dropwizard.get('id'))}
              timeConfig={timeConfig}
              y1={{
                min: 0,
                formatter: timeByMillisTwoDecimalPlaces,
                metrics: cashieringests.map(
                  () =>
                    'metrics.timers.com.instana.cashieringest.service.kafka.KafkaStreamAggregatorUsageReporting.kafka-streams-lag-timer.99th'
                ),
                labels: cashieringestsLabels,
                type: 'line'
              }}
            />
          </DashboardSection>
          <DashboardSection title={t('in-internal:monitoringUnit.cashier.aggregatedKafkaStreamsLagTimerMean')}>
            <p>{t('in-internal:monitoringUnit.cashier.cashierIngestLagBetweenMessageAndAggregation')}</p>
            <Chart
              snapshotIds={cashieringests.map(r => r.dropwizard.get('id'))}
              timeConfig={timeConfig}
              y1={{
                min: 0,
                formatter: timeByMillisTwoDecimalPlaces,
                metrics: cashieringests.map(
                  () =>
                    'metrics.timers.com.instana.cashieringest.service.kafka.KafkaStreamAggregatorUsageReporting.kafka-streams-lag-timer.mean'
                ),
                labels: cashieringestsLabels,
                type: 'line'
              }}
            />
          </DashboardSection>
        </Columize>
        <Columize>
          <DashboardSection title={t('in-internal:monitoringUnit.cashier.kafkaLagTimer99th')}>
            <p>{t('in-internal:monitoringUnit.cashier.cashierIngestLagBetweenMessageAndReceiving')}</p>
            <Chart
              snapshotIds={cashieringests.map(r => r.dropwizard.get('id'))}
              timeConfig={timeConfig}
              y1={{
                min: 0,
                formatter: timeByMillisTwoDecimalPlaces,
                metrics: cashieringests.map(
                  () =>
                    'metrics.timers.com.instana.cashieringest.service.processing.PayloadAcceptor.kafka-lag-timer.99th'
                ),
                labels: cashieringestsLabels,
                type: 'line'
              }}
            />
          </DashboardSection>
          <DashboardSection title={t('in-internal:monitoringUnit.cashier.kafkaLagTimerMean')}>
            <p>{t('in-internal:monitoringUnit.cashier.cashierIngestLagBetweenMessageAndReceiving')}</p>
            <Chart
              snapshotIds={cashieringests.map(r => r.dropwizard.get('id'))}
              timeConfig={timeConfig}
              y1={{
                min: 0,
                formatter: timeByMillisTwoDecimalPlaces,
                metrics: cashieringests.map(
                  () =>
                    'metrics.timers.com.instana.cashieringest.service.processing.PayloadAcceptor.kafka-lag-timer.mean'
                ),
                labels: cashieringestsLabels,
                type: 'line'
              }}
            />
          </DashboardSection>
        </Columize>
        <Columize>
          <DashboardSection title={t('in-internal:monitoringUnit.cashier.consumedCashierReport')}>
            <p>{t('in-internal:monitoringUnit.cashier.cashierIngestHowManyMessagesHaveBeenReceived')}</p>
            <Chart
              snapshotIds={cashieringests.map(r => r.dropwizard.get('id'))}
              timeConfig={timeConfig}
              y1={{
                min: 0,
                formatter: number.perSecond.compact,
                metrics: cashieringests.map(
                  () =>
                    'metrics.meters.com.instana.cashieringest.service.processing.PayloadAcceptor.consumed-cashier-reports'
                ),
                labels: cashieringestsLabels,
                type: 'stackedArea'
              }}
            />
          </DashboardSection>
          <DashboardSection title={t('in-internal:monitoringUnit.cashier.writeToDatabaseRate')}>
            <p>{t('in-internal:monitoringUnit.cashier.cashierIngestHowOftenMessagesWrittenOutToDatabase')}</p>
            <Chart
              snapshotIds={cashieringests.map(r => r.dropwizard.get('id'))}
              timeConfig={timeConfig}
              y1={{
                formatter: number.perSecond.compact,
                metrics: cashieringests.map(
                  () => 'metrics.timers.com.instana.cashiershared.jdbi.dao.MinuteRollupDao.addRollupData.rate'
                ),
                labels: cashieringestsLabels,
                type: 'stackedArea'
              }}
            />
          </DashboardSection>
        </Columize>
        <Columize>
          <DashboardSection title={t('in-internal:monitoringUnit.cashier.writeToDatabaseMean')}>
            <p>{t('in-internal:monitoringUnit.cashier.cashierIngestHowFastMessagesWrittenOutToDatabase')}</p>
            <Chart
              snapshotIds={cashieringests.map(r => r.dropwizard.get('id'))}
              timeConfig={timeConfig}
              y1={{
                formatter: millis.fixedCompact,
                metrics: cashieringests.map(
                  () => 'metrics.timers.com.instana.cashiershared.jdbi.dao.MinuteRollupDao.addRollupData.mean'
                ),
                labels: cashieringestsLabels,
                type: 'line'
              }}
            />
          </DashboardSection>
          <DashboardSection title={t('in-internal:monitoringUnit.cashier.writeToDatabase50th')}>
            <p>{t('in-internal:monitoringUnit.cashier.cashierIngestHowFastMessagesWrittenOutToDatabase')}</p>
            <Chart
              snapshotIds={cashieringests.map(r => r.dropwizard.get('id'))}
              timeConfig={timeConfig}
              y1={{
                formatter: millis.fixedCompact,
                metrics: cashieringests.map(
                  () => 'metrics.timers.com.instana.cashiershared.jdbi.dao.MinuteRollupDao.addRollupData.50th'
                ),
                labels: cashieringestsLabels,
                type: 'line'
              }}
            />
          </DashboardSection>
          <DashboardSection title={t('in-internal:monitoringUnit.cashier.writeToDatabase99th')}>
            <p>{t('in-internal:monitoringUnit.cashier.cashierIngestHowFastMessagesWrittenOutToDatabase')}</p>
            <Chart
              snapshotIds={cashieringests.map(r => r.dropwizard.get('id'))}
              timeConfig={timeConfig}
              y1={{
                formatter: millis.fixedCompact,
                metrics: cashieringests.map(
                  () => 'metrics.timers.com.instana.cashiershared.jdbi.dao.MinuteRollupDao.addRollupData.99th'
                ),
                labels: cashieringestsLabels,
                type: 'line'
              }}
            />
          </DashboardSection>
        </Columize>

        <hr className={locals.divider} />

        <Typography variant="heading-03">{t('in-internal:monitoringUnit.cashier.cashierRollup')}</Typography>
        <Typography variant="label-01" component="p">
          {t('in-internal:monitoringUnit.cashier.cashierRollupExplanation')}
        </Typography>
        <Columize>
          <DashboardSection title={t('in-internal:monitoringUnit.cashier.createInsertHourlyPayloadRollupsRate')}>
            <p>{t('in-internal:monitoringUnit.cashier.cashierRollupHowOftenRollupsWrittenOutToDatabase')}</p>
            <Chart
              snapshotIds={cashierrollups.map(r => r.dropwizard.get('id'))}
              timeConfig={timeConfig}
              y1={{
                formatter: number.perSecond.compact,
                metrics: cashierrollups.map(
                  () =>
                    'metrics.timers.com.instana.cashiershared.jdbi.dao.HourRollupDao.createAndInsertHourlyRollups.rate'
                ),
                labels: cashierrollupsLabels,
                type: 'stackedArea'
              }}
            />
          </DashboardSection>
        </Columize>
        <Columize>
          <DashboardSection title={t('in-internal:monitoringUnit.cashier.createInsertHourlyPayloadRollupsMean')}>
            <p>{t('in-internal:monitoringUnit.cashier.cashierRollupHowFastRollupsWrittenOutToDatabase')}</p>
            <Chart
              snapshotIds={cashierrollups.map(r => r.dropwizard.get('id'))}
              timeConfig={timeConfig}
              y1={{
                formatter: millis.fixedCompact,
                metrics: cashierrollups.map(
                  () =>
                    'metrics.timers.com.instana.cashiershared.jdbi.dao.HourRollupDao.createAndInsertHourlyRollups.mean'
                ),
                labels: cashierrollupsLabels,
                type: 'line'
              }}
            />
          </DashboardSection>
          <DashboardSection title={t('in-internal:monitoringUnit.cashier.createInsertHourlyPayloadRollups50')}>
            <p>{t('in-internal:monitoringUnit.cashier.cashierRollupHowFastRollupsWrittenOutToDatabase')}</p>
            <Chart
              snapshotIds={cashierrollups.map(r => r.dropwizard.get('id'))}
              timeConfig={timeConfig}
              y1={{
                formatter: millis.fixedCompact,
                metrics: cashierrollups.map(
                  () =>
                    'metrics.timers.com.instana.cashiershared.jdbi.dao.HourRollupDao.createAndInsertHourlyRollups.50th'
                ),
                labels: cashierrollupsLabels,
                type: 'line'
              }}
            />
          </DashboardSection>
          <DashboardSection title={t('in-internal:monitoringUnit.cashier.createInsertHourlyPayloadRollups99')}>
            <p>{t('in-internal:monitoringUnit.cashier.cashierRollupHowFastRollupsWrittenOutToDatabase')}</p>
            <Chart
              snapshotIds={cashierrollups.map(r => r.dropwizard.get('id'))}
              timeConfig={timeConfig}
              y1={{
                formatter: millis.fixedCompact,
                metrics: cashierrollups.map(
                  () =>
                    'metrics.timers.com.instana.cashiershared.jdbi.dao.HourRollupDao.createAndInsertHourlyRollups.99th'
                ),
                labels: cashierrollupsLabels,
                type: 'line'
              }}
            />
          </DashboardSection>
        </Columize>
        <Columize>
          <DashboardSection title={t('in-internal:monitoringUnit.cashier.createInsertDailyPayloadRollupsRate')}>
            <p>{t('in-internal:monitoringUnit.cashier.cashierRollupHowOftenRollupsWrittenOutToDatabase')}</p>
            <Chart
              snapshotIds={cashierrollups.map(r => r.dropwizard.get('id'))}
              timeConfig={timeConfig}
              y1={{
                formatter: number.perSecond.compact,
                metrics: cashierrollups.map(
                  () =>
                    'metrics.timers.com.instana.cashiershared.jdbi.dao.DayRollupDao.createAndInsertDailyRollups.rate'
                ),
                labels: cashierrollupsLabels,
                type: 'stackedArea'
              }}
            />
          </DashboardSection>
        </Columize>
        <Columize>
          <DashboardSection title={t('in-internal:monitoringUnit.cashier.createInsertDailyPayloadRollupsMean')}>
            <p>{t('in-internal:monitoringUnit.cashier.cashierRollupHowFastRollupsWrittenOutToDatabase')}</p>
            <Chart
              snapshotIds={cashierrollups.map(r => r.dropwizard.get('id'))}
              timeConfig={timeConfig}
              y1={{
                formatter: millis.fixedCompact,
                metrics: cashierrollups.map(
                  () =>
                    'metrics.timers.com.instana.cashiershared.jdbi.dao.DayRollupDao.createAndInsertDailyRollups.mean'
                ),
                labels: cashierrollupsLabels,
                type: 'line'
              }}
            />
          </DashboardSection>
          <DashboardSection title={t('in-internal:monitoringUnit.cashier.createInsertDailyPayloadRollups50')}>
            <p>{t('in-internal:monitoringUnit.cashier.cashierRollupHowFastRollupsWrittenOutToDatabase')}</p>
            <Chart
              snapshotIds={cashierrollups.map(r => r.dropwizard.get('id'))}
              timeConfig={timeConfig}
              y1={{
                formatter: millis.fixedCompact,
                metrics: cashierrollups.map(
                  () =>
                    'metrics.timers.com.instana.cashiershared.jdbi.dao.DayRollupDao.createAndInsertDailyRollups.50th'
                ),
                labels: cashierrollupsLabels,
                type: 'line'
              }}
            />
          </DashboardSection>
          <DashboardSection title={t('in-internal:monitoringUnit.cashier.createInsertDailyPayloadRollups99')}>
            <p>{t('in-internal:monitoringUnit.cashier.cashierRollupHowFastRollupsWrittenOutToDatabase')}</p>
            <Chart
              snapshotIds={cashierrollups.map(r => r.dropwizard.get('id'))}
              timeConfig={timeConfig}
              y1={{
                formatter: millis.fixedCompact,
                metrics: cashierrollups.map(
                  () =>
                    'metrics.timers.com.instana.cashiershared.jdbi.dao.DayRollupDao.createAndInsertDailyRollups.99th'
                ),
                labels: cashierrollupsLabels,
                type: 'line'
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
  return rows.map(r => r.host.get('label').replace(regexp, '$1'));
}
