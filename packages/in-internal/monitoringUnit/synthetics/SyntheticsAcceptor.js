/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2022
 */

import React, { Fragment } from 'react';

import { percentage, percentageZeroDecimalPlaces } from 'in-services/formatters/number';
import { getDropwizardWithContext } from 'in-internal/monitoringUnit/dataRetrieval';
import Chart from 'in-infrastructure/components/InfrastructureMetricChartBehavior';
import LoadingIndicator from 'in-components/LoadingIndicators/LoadingIndicator';
import { number, bytesZeroDecimalPlaces } from 'in-services/formatters/number';
import { physicalDashboardPath } from 'in-stores/navigation/paths/mainPaths';
import DashboardSection from 'in-sdk/components/dashboard/DashboardSection';
import Columize from 'in-sdk/components/dashboard/Columize';
import { compareIgnoreCase } from 'in-services/util/string';
import Table from 'in-sdk/components/dashboard/Table';
import { timeConfig$ } from 'in-stores/time/config';
import connectTo from 'in-hoc/connectTo';
import { t } from 'in-i18n';

const cols = [
  {
    title: t('in-internal:monitoringUnit.synthetics.acceptor.host'),
    type: 'snapshotLink',
    typeArgs: {
      pathname: physicalDashboardPath,
      getSnapshotId(row) {
        return row.host.get('id');
      }
    }
  },
  {
    title: t('in-internal:monitoringUnit.synthetics.acceptor.user'),
    type: 'metric',
    typeArgs: {
      getSnapshotId(row) {
        return row.host.get('id');
      },
      getMetricName() {
        return `cpu.user`;
      },
      getContent: percentage.compact,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  },
  {
    title: t('in-internal:monitoringUnit.synthetics.acceptor.system'),
    type: 'metric',
    typeArgs: {
      getSnapshotId(row) {
        return row.host.get('id');
      },
      getMetricName() {
        return `cpu.sys`;
      },
      getContent: percentage.compact,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  },
  {
    title: t('in-internal:monitoringUnit.synthetics.acceptor.wait'),
    type: 'metric',
    typeArgs: {
      getSnapshotId(row) {
        return row.host.get('id');
      },
      getMetricName() {
        return `cpu.wait`;
      },
      getContent: percentage.compact,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  },
  {
    title: t('in-internal:monitoringUnit.synthetics.acceptor.nice'),
    type: 'metric',
    typeArgs: {
      getSnapshotId(row) {
        return row.host.get('id');
      },
      getMetricName() {
        return `cpu.nice`;
      },
      getContent: percentage.compact,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  },
  {
    title: t('in-internal:monitoringUnit.synthetics.acceptor.steal'),
    type: 'metric',
    typeArgs: {
      getSnapshotId(row) {
        return row.host.get('id');
      },
      getMetricName() {
        return `cpu.steal`;
      },
      getContent: percentage.compact,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  }
];

export default connectTo(
  {
    timeConfig: timeConfig$,
    acceptors: getDropwizardWithContext('entity.jvm.app.name:"synthetics-acceptor"')
  },
  function Overview({ acceptors, timeConfig }) {
    if (acceptors.length === 0) {
      return <LoadingIndicator />;
    }

    acceptors = acceptors.slice().sort((a, b) => compareIgnoreCase(a.host.get('label'), b.host.get('label')));
    const acceptorLabels = acceptors.map(r =>
      r.host
        .get('label')
        .replace('.instana.io', '')
        .replace('ip-', '')
    );

    return (
      <div>
        <h1>{t('in-internal:monitoringUnit.synthetics.acceptor.title')}</h1>

        <Columize>
          <DashboardSection title={t('in-internal:monitoringUnit.synthetics.acceptor.s3Writes')}>
            <Chart
              snapshotIds={acceptors.map(r => r.dropwizard.get('id'))}
              timeConfig={timeConfig}
              minRollup={5000}
              y1={{
                min: 0,
                formatter: number.perSecond.detailed,
                metrics: acceptors.map(() => `metrics.meters.KPI.synthetics.s3.store.calls`),
                labels: acceptorLabels,
                type: 'stackedArea'
              }}
            />
          </DashboardSection>

          <DashboardSection title={t('in-internal:monitoringUnit.synthetics.acceptor.s3Err')}>
            <Chart
              snapshotIds={acceptors.map(r => r.dropwizard.get('id'))}
              timeConfig={timeConfig}
              minRollup={5000}
              y1={{
                min: 0,
                formatter: number.perSecond.detailed,
                metrics: acceptors.map(() => `metrics.meters.KPI.synthetics.s3.store.errors`),
                labels: acceptorLabels,
                type: 'stackedArea'
              }}
            />
          </DashboardSection>
        </Columize>

        <Columize>
          <DashboardSection title={t('in-internal:monitoringUnit.synthetics.acceptor.networkDataReceived')}>
            <Chart
              snapshotIds={acceptors.map(r => r.host.get('id'))}
              timeConfig={timeConfig}
              y1={{
                min: 0,
                formatter: bytesZeroDecimalPlaces,
                metrics: acceptors.map(() => `ifs.eth0.rx.bytes`),
                labels: acceptorLabels,
                type: 'line'
              }}
            />
          </DashboardSection>

          <DashboardSection title={t('in-internal:monitoringUnit.synthetics.acceptor.networkDataTransmit')}>
            <Chart
              snapshotIds={acceptors.map(r => r.host.get('id'))}
              timeConfig={timeConfig}
              y1={{
                min: 0,
                formatter: bytesZeroDecimalPlaces,
                metrics: acceptors.map(() => `ifs.eth0.tx.bytes`),
                labels: acceptorLabels,
                type: 'line'
              }}
            />
          </DashboardSection>
        </Columize>

        <Columize>
          <DashboardSection title={t('in-internal:monitoringUnit.synthetics.acceptor.cpuLoad')}>
            <Chart
              snapshotIds={acceptors.map(r => r.host.get('id'))}
              timeConfig={timeConfig}
              minRollup={5000}
              y1={{
                min: 0,
                formatter: number.detailed,
                tooltipFormatter: number.detailed,
                metrics: acceptors.map(() => 'load.1min'),
                labels: acceptorLabels,
                type: 'line'
              }}
            />
          </DashboardSection>
        </Columize>

        <Columize>
          <DashboardSection title={t('in-internal:monitoringUnit.synthetics.acceptor.fileWrites')}>
            <Chart
              snapshotIds={acceptors.map(r => r.dropwizard.get('id'))}
              timeConfig={timeConfig}
              minRollup={5000}
              y1={{
                min: 0,
                formatter: number.perSecond.detailed,
                metrics: acceptors.map(() => `metrics.meters.KPI.synthetics.file.store.calls`),
                labels: acceptorLabels,
                type: 'stackedArea'
              }}
            />
          </DashboardSection>

          <DashboardSection title={t('in-internal:monitoringUnit.synthetics.acceptor.fileErr')}>
            <Chart
              snapshotIds={acceptors.map(r => r.dropwizard.get('id'))}
              timeConfig={timeConfig}
              minRollup={5000}
              y1={{
                min: 0,
                formatter: number.perSecond.detailed,
                metrics: acceptors.map(() => `metrics.meters.KPI.synthetics.file.store.errors`),
                labels: acceptorLabels,
                type: 'stackedArea'
              }}
            />
          </DashboardSection>
        </Columize>

        <Columize>
          <DashboardSection
            title={t('in-internal:monitoringUnit.synthetics.acceptor.hostsAcceptorsLen', {
              acceptorLen: acceptors.length
            })}
          >
            <Table cols={cols} rows={acceptors} getRowDetails={getRowDetails} />
          </DashboardSection>
        </Columize>
      </div>
    );
  }
);

function getRowDetails(row) {
  return (
    <Fragment>
      <DashboardSection title={t('in-internal:monitoringUnit.synthetics.acceptor.cpuUsage')}>
        <Chart
          snapshotId={row.host.get('id')}
          timeConfig={row.timeConfig}
          y1={{
            min: 0,
            max: 1,
            formatter: percentageZeroDecimalPlaces,
            metrics: ['cpu.user', 'cpu.sys', 'cpu.wait', 'cpu.nice', 'cpu.steal'],
            labels: [
              t('in-internal:monitoringUnit.synthetics.acceptor.user'),
              t('in-internal:monitoringUnit.synthetics.acceptor.system'),
              t('in-internal:monitoringUnit.synthetics.acceptor.wait'),
              t('in-internal:monitoringUnit.synthetics.acceptor.nice'),
              t('in-internal:monitoringUnit.synthetics.acceptor.steal')
            ],
            type: 'stackedArea'
          }}
        />
      </DashboardSection>
    </Fragment>
  );
}
