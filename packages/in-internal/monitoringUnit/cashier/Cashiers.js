/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import { t } from 'in-i18n';
import React from 'react';

import { number, millis, timeByMillisTwoDecimalPlaces } from 'in-services/formatters/number';
import { getDropwizardWithContext } from 'in-internal/monitoringUnit/dataRetrieval';
import DashboardSection from 'in-sdk/components/dashboard/DashboardSection';
import Chart from 'in-components/Chart/InfrastructureMetricChartBehavior';
import { compareIgnoreCase } from 'in-services/util/string';
import Columize from 'in-sdk/components/dashboard/Columize';
import { timeConfig$ } from 'in-stores/time/config';
import connectTo from 'in-hoc/connectTo';

export default connectTo(
  {
    timeConfig: timeConfig$,
    cashieracceptors: getDropwizardWithContext('entity.kubernetes.deployment.name:"cashier-acceptor"'),
    cashierusagetransfers: getDropwizardWithContext('entity.jvm.app.name:"cashier-usage-transfer"'),
    cashieringests: getDropwizardWithContext('entity.kubernetes.deployment.name:"cashier-ingest"'),
    cashierrollups: getDropwizardWithContext('entity.kubernetes.deployment.name:"cashier-rollup"')
  },
  function Overview({ cashieracceptors, cashierusagetransfers, cashieringests, cashierrollups, timeConfig }) {
    cashieracceptors = sort(cashieracceptors);
    const acceptorLabels = getLabels(cashieracceptors, /^(k8s-worker-\d+).*$/i);

    cashierusagetransfers = sort(cashierusagetransfers);
    const cashierusagetransfersLabels = getLabels(cashierusagetransfers, /^(fleet-worker-\d+).*$/i);

    cashieringests = sort(cashieringests);
    const cashieringestsLabels = getLabels(cashieringests, /^(k8s-worker-\d+).*$/i);

    cashierrollups = sort(cashierrollups);
    const cashierrollupsLabels = getLabels(cashierrollups, /^(k8s-worker-\d+).*$/i);

    return (
      <div>
        <h2>{t('in-internal:monitoringUnit.cashier.cashierAcceptors')}</h2>
        <Columize>
          <DashboardSection title={t('in-internal:monitoringUnit.cashier.writes')}>
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

          <DashboardSection title={t('in-internal:monitoringUnit.cashier.outgoingCalls')}>
            <Chart
              snapshotIds={cashieracceptors.map(r => r.dropwizard.get('id'))}
              timeConfig={timeConfig}
              y1={{
                min: 0,
                formatter: number.perSecond.compact,
                metrics: cashieracceptors.map(() => 'metrics.meters.KPI.outgoing.usage_reports_transfer.calls'),
                labels: acceptorLabels,
                type: 'stackedArea'
              }}
            />
          </DashboardSection>
        </Columize>

        <h2>{t('in-internal:monitoringUnit.cashier.cashierUsageTransfer')}</h2>
        <Columize>
          <DashboardSection title={t('in-internal:monitoringUnit.cashier.consumedCashierReports')}>
            <p>{t('in-internal:monitoringUnit.cashier.verifyMinDataReadFromKafka')}</p>
            <Chart
              snapshotIds={cashierusagetransfers.map(r => r.dropwizard.get('id'))}
              timeConfig={timeConfig}
              y1={{
                min: 0,
                formatter: number.perSecond.compact,
                metrics: cashierusagetransfers.map(
                  () =>
                    'metrics.meters.com.instana.cashierusagetransfer.service.processing.PayloadAcceptor.consumed-cashier-reports'
                ),
                labels: cashierusagetransfersLabels,
                type: 'stackedArea'
              }}
            />
          </DashboardSection>

          <DashboardSection title={t('in-internal:monitoringUnit.cashier.fwdPayloadAcceptorTimeRate')}>
            <p>{t('in-internal:monitoringUnit.cashier.timeUpReqPotentialScaleoutCashierAcceptor')}</p>
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
          <DashboardSection title={t('in-internal:monitoringUnit.cashier.fwdPayloadAcceptorTimerMean')}>
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
          <DashboardSection title={t('in-internal:monitoringUnit.cashier.kafkaLagTimer99th')}>
            <Chart
              snapshotIds={cashierusagetransfers.map(r => r.dropwizard.get('id'))}
              timeConfig={timeConfig}
              y1={{
                min: 0,
                formatter: timeByMillisTwoDecimalPlaces,
                metrics: cashierusagetransfers.map(
                  () =>
                    'metrics.timers.com.instana.cashierusagetransfer.service.processing.PayloadAcceptor.kafka-lag.99th'
                ),
                labels: cashierusagetransfersLabels,
                type: 'line'
              }}
            />
          </DashboardSection>
          <DashboardSection title={t('in-internal:monitoringUnit.cashier.kafkaLagTimerMean')}>
            <Chart
              snapshotIds={cashierusagetransfers.map(r => r.dropwizard.get('id'))}
              timeConfig={timeConfig}
              y1={{
                min: 0,
                formatter: timeByMillisTwoDecimalPlaces,
                metrics: cashierusagetransfers.map(
                  () =>
                    'metrics.timers.com.instana.cashierusagetransfer.service.processing.PayloadAcceptor.kafka-lag.mean'
                ),
                labels: cashierusagetransfersLabels,
                type: 'line'
              }}
            />
          </DashboardSection>
        </Columize>
        <Columize>
          <DashboardSection title={t('in-internal:monitoringUnit.cashier.genReactorKafkaConsumerAvailCapacity')}>
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

        <h2>{t('in-internal:monitoringUnit.cashier.cashierIngest')}</h2>
        <Columize>
          <DashboardSection title={t('in-internal:monitoringUnit.cashier.consumedCashierReport')}>
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

          <DashboardSection title={t('in-internal:monitoringUnit.cashier.addRollupDataRate')}>
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
          <DashboardSection title={t('in-internal:monitoringUnit.cashier.addRollupDataMean')}>
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
          <DashboardSection title={t('in-internal:monitoringUnit.cashier.addRollupData50th')}>
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
          <DashboardSection title={t('in-internal:monitoringUnit.cashier.addRollupData99th')}>
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
        <Columize>
          <DashboardSection title={t('in-internal:monitoringUnit.cashier.kafkaLagTimer99th')}>
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
        <h2>{t('in-internal:monitoringUnit.cashier.cashierRollups')}</h2>
        <Columize>
          <DashboardSection title={t('in-internal:monitoringUnit.cashier.createInsertHourlyPayloadRollupsRate')}>
            <Chart
              snapshotIds={cashierrollups.map(r => r.dropwizard.get('id'))}
              timeConfig={timeConfig}
              y1={{
                formatter: number.perSecond.compact,
                metrics: cashierrollups.map(
                  () =>
                    'metrics.timers.com.instana.cashiershared.jdbi.dao.HourRollupDao.createAndInsertHourlyPayloadRollups.rate'
                ),
                labels: cashierrollupsLabels,
                type: 'stackedArea'
              }}
            />
          </DashboardSection>
        </Columize>
        <Columize>
          <DashboardSection title={t('in-internal:monitoringUnit.cashier.createInsertHourlyPayloadRollupsMean')}>
            <Chart
              snapshotIds={cashierrollups.map(r => r.dropwizard.get('id'))}
              timeConfig={timeConfig}
              y1={{
                formatter: millis.fixedCompact,
                metrics: cashierrollups.map(
                  () =>
                    'metrics.timers.com.instana.cashiershared.jdbi.dao.HourRollupDao.createAndInsertHourlyPayloadRollups.mean'
                ),
                labels: cashierrollupsLabels,
                type: 'line'
              }}
            />
          </DashboardSection>
          <DashboardSection title={t('in-internal:monitoringUnit.cashier.createInsertHourlyPayloadRollups50')}>
            <Chart
              snapshotIds={cashierrollups.map(r => r.dropwizard.get('id'))}
              timeConfig={timeConfig}
              y1={{
                formatter: millis.fixedCompact,
                metrics: cashierrollups.map(
                  () =>
                    'metrics.timers.com.instana.cashiershared.jdbi.dao.HourRollupDao.createAndInsertHourlyPayloadRollups.50th'
                ),
                labels: cashierrollupsLabels,
                type: 'line'
              }}
            />
          </DashboardSection>
          <DashboardSection title={t('in-internal:monitoringUnit.cashier.createInsertHourlyPayloadRollups99')}>
            <Chart
              snapshotIds={cashierrollups.map(r => r.dropwizard.get('id'))}
              timeConfig={timeConfig}
              y1={{
                formatter: millis.fixedCompact,
                metrics: cashierrollups.map(
                  () =>
                    'metrics.timers.com.instana.cashiershared.jdbi.dao.HourRollupDao.createAndInsertHourlyPayloadRollups.99th'
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
