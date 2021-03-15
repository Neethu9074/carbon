/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React, { Fragment } from 'react';

import { percentage, percentageZeroDecimalPlaces } from 'in-services/formatters/number';
import { getDropwizardWithContext } from 'in-internal/monitoringUnit/dataRetrieval';
import LoadingIndicator from 'in-new-components/LoadingIndicators/LoadingIndicator';
import { number, bytesZeroDecimalPlaces } from 'in-services/formatters/number';
import { physicalDashboardPath } from 'in-stores/navigation/paths/mainPaths';
import DashboardSection from 'in-sdk/components/dashboard/DashboardSection';
import Chart from 'in-components/Chart/InfrastructureMetricChartBehavior';
import Columize from 'in-sdk/components/dashboard/Columize';
import { compareIgnoreCase } from 'in-services/util/string';
import Table from 'in-sdk/components/dashboard/Table';
import { timeConfig$ } from 'in-stores/time/config';
import connectTo from 'in-hoc/connectTo';
import { t } from 'in-i18n';

const cols = [
  {
    title: t('in-internal:monitoringUnit.sre.host'),
    type: 'snapshotLink',
    typeArgs: {
      pathname: physicalDashboardPath,
      getSnapshotId(row) {
        return row.host.get('id');
      }
    }
  },
  {
    title: t('in-internal:monitoringUnit.sre.user'),
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
    title: t('in-internal:monitoringUnit.sre.system'),
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
    title: t('in-internal:monitoringUnit.sre.wait'),
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
    title: t('in-internal:monitoringUnit.sre.nice'),
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
    title: t('in-internal:monitoringUnit.sre.steal'),
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
    acceptors: getDropwizardWithContext('entity.jvm.app.name:"acceptor"')
  },
  function Overview({ acceptors, timeConfig }) {
    if (acceptors.length === 0) {
      return <LoadingIndicator />;
    }

    acceptors = sort(acceptors);
    const acceptorLabels = getLabels(acceptors, /^(acceptor-\d+).*$/i);

    return (
      <div>
        <Columize>
          <DashboardSection title={t('in-internal:monitoringUnit.sre.acceptors.messages')}>
            <Chart
              snapshotIds={acceptors.map(r => r.dropwizard.get('id'))}
              timeConfig={timeConfig}
              y1={{
                min: 0,
                formatter: number.perSecond.compact,
                metrics: acceptors.map(() => `metrics.meters.acceptor.messages.http2`),
                labels: acceptorLabels,
                type: 'stackedArea'
              }}
            />
          </DashboardSection>

          <DashboardSection title={t('in-internal:monitoringUnit.sre.acceptors.droppedDeniedMsg')}>
            <Chart
              snapshotIds={acceptors.map(r => r.dropwizard.get('id'))}
              timeConfig={timeConfig}
              y1={{
                min: 0,
                formatter: number.perSecond.compact,
                metrics: acceptors.map(() => `metrics.meters.acceptor.messages.http2.dropped`),
                labels: acceptorLabels,
                type: 'stackedArea'
              }}
            />
          </DashboardSection>

          <DashboardSection title={t('in-internal:monitoringUnit.sre.acceptors.ipFilterMsg0')}>
            <Chart
              snapshotIds={acceptors.map(r => r.dropwizard.get('id'))}
              timeConfig={timeConfig}
              y1={{
                min: 0,
                formatter: number.perSecond.compact,
                metrics: acceptors.map(() => `metrics.meters.acceptor.messages.ipfilter.dropped`),
                labels: acceptorLabels,
                type: 'stackedArea'
              }}
            />
          </DashboardSection>
        </Columize>

        <Columize>
          <DashboardSection title={t('in-internal:monitoringUnit.sre.acceptors.kafkaSpanMsgErrRate')}>
            <Chart
              snapshotIds={acceptors.map(r => r.dropwizard.get('id'))}
              timeConfig={timeConfig}
              y1={{
                min: 0,
                formatter: percentageZeroDecimalPlaces,
                metrics: acceptors.map(() => `metrics.gauges.KPI.outgoing.span_messages.error_rate`),
                labels: acceptorLabels,
                type: 'line'
              }}
            />
          </DashboardSection>

          <DashboardSection title={t('in-internal:monitoringUnit.sre.acceptors.kafkaSpanMsgErr')}>
            <Chart
              snapshotIds={acceptors.map(r => r.dropwizard.get('id'))}
              timeConfig={timeConfig}
              y1={{
                min: 0,
                formatter: number.perSecond.compact,
                metrics: acceptors.map(() => `metrics.meters.KPI.outgoing.span_messages.errors`),
                labels: acceptorLabels,
                type: 'line'
              }}
            />
          </DashboardSection>
        </Columize>

        <Columize>
          <DashboardSection title={t('in-internal:monitoringUnit.sre.acceptors.networkDataReceived')}>
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

          <DashboardSection title={t('in-internal:monitoringUnit.sre.acceptors.networkDataTransmit')}>
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
          <DashboardSection title={t('in-internal:monitoringUnit.sre.acceptors.cpuLoad')}>
            <Chart
              snapshotIds={acceptors.map(r => r.host.get('id'))}
              timeConfig={timeConfig}
              minRollup={5000}
              y1={{
                min: 0,
                formatter: number.detailed,
                tooltipFormatter: number.detailed,
                metrics: acceptors.map(() => 'load.1min'),
                labels: acceptors.map(r => r.host.get('label')),
                type: 'line'
              }}
            />
          </DashboardSection>

          <DashboardSection
            title={t('in-internal:monitoringUnit.sre.acceptors.hostsAcceptorsLen', { acceptorLen: acceptors.length })}
          >
            <Table cols={cols} rows={acceptors} getRowDetails={getRowDetails} />
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

function getRowDetails(row) {
  return (
    <Fragment>
      <DashboardSection title={t('in-internal:monitoringUnit.sre.acceptors.cpuUsage')}>
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
