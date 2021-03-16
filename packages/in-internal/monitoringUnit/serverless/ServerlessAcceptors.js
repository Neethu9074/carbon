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
import { compareIgnoreCase } from 'in-services/util/string';
import Columize from 'in-sdk/components/dashboard/Columize';
import Table from 'in-sdk/components/dashboard/Table';
import { timeConfig$ } from 'in-stores/time/config';
import connectTo from 'in-hoc/connectTo';
import { t } from 'in-i18n';

const cols = [
  {
    title: t('in-internal:monitoringUnit.serverless.serverlessAcceptors.host'),
    type: 'snapshotLink',
    typeArgs: {
      pathname: physicalDashboardPath,
      getSnapshotId(row) {
        return row.host.get('id');
      }
    }
  },
  {
    title: t('in-internal:monitoringUnit.serverless.serverlessAcceptors.user'),
    type: 'metric',
    typeArgs: {
      getSnapshotId(row) {
        return row.host.get('id');
      },
      getMetricName() {
        return 'cpu.user';
      },
      getContent: percentage.compact,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  },
  {
    title: t('in-internal:monitoringUnit.serverless.serverlessAcceptors.system'),
    type: 'metric',
    typeArgs: {
      getSnapshotId(row) {
        return row.host.get('id');
      },
      getMetricName() {
        return 'cpu.sys';
      },
      getContent: percentage.compact,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  },
  {
    title: t('in-internal:monitoringUnit.serverless.serverlessAcceptors.wait'),
    type: 'metric',
    typeArgs: {
      getSnapshotId(row) {
        return row.host.get('id');
      },
      getMetricName() {
        return 'cpu.wait';
      },
      getContent: percentage.compact,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  },
  {
    title: t('in-internal:monitoringUnit.serverless.serverlessAcceptors.nice'),
    type: 'metric',
    typeArgs: {
      getSnapshotId(row) {
        return row.host.get('id');
      },
      getMetricName() {
        return 'cpu.nice';
      },
      getContent: percentage.compact,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  },
  {
    title: t('in-internal:monitoringUnit.serverless.serverlessAcceptors.steal'),
    type: 'metric',
    typeArgs: {
      getSnapshotId(row) {
        return row.host.get('id');
      },
      getMetricName() {
        return 'cpu.steal';
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
    serverlessacceptors: getDropwizardWithContext('entity.jvm.app.name:"serverless-acceptor"')
  },
  function Overview({ serverlessacceptors, timeConfig }) {
    if (serverlessacceptors.length === 0) {
      return <LoadingIndicator />;
    }

    serverlessacceptors = sort(serverlessacceptors);
    const acceptorLabels = getLabels(serverlessacceptors, /^(serverless-acceptor-\d+).*$/i);

    return (
      <div>
        <Columize>
          <DashboardSection title={t('in-internal:monitoringUnit.serverless.serverlessAcceptors.messages')}>
            <Chart
              snapshotIds={serverlessacceptors.map(r => r.dropwizard.get('id'))}
              timeConfig={timeConfig}
              y1={{
                min: 0,
                formatter: number.perSecond.compact,
                metrics: serverlessacceptors.map(() => 'metrics.meters.serverless-acceptor.messages.http2'),
                labels: acceptorLabels,
                type: 'stackedArea'
              }}
            />
          </DashboardSection>

          <DashboardSection title={t('in-internal:monitoringUnit.serverless.serverlessAcceptors.dropDeniedMsg')}>
            <Chart
              snapshotIds={serverlessacceptors.map(r => r.dropwizard.get('id'))}
              timeConfig={timeConfig}
              y1={{
                min: 0,
                formatter: number.perSecond.compact,
                metrics: serverlessacceptors.map(() => 'metrics.meters.serverless-acceptor.messages.http2.dropped'),
                labels: acceptorLabels,
                type: 'stackedArea'
              }}
            />
          </DashboardSection>

          <DashboardSection title={t('in-internal:monitoringUnit.serverless.serverlessAcceptors.ipFilterMsgBe0')}>
            <Chart
              snapshotIds={serverlessacceptors.map(r => r.dropwizard.get('id'))}
              timeConfig={timeConfig}
              y1={{
                min: 0,
                formatter: number.perSecond.compact,
                metrics: serverlessacceptors.map(() => 'metrics.meters.serverless-acceptor.messages.ipfilter.dropped'),
                labels: acceptorLabels,
                type: 'stackedArea'
              }}
            />
          </DashboardSection>
        </Columize>

        <Columize>
          <DashboardSection title={t('in-internal:monitoringUnit.serverless.serverlessAcceptors.traceMsg')}>
            <Chart
              snapshotIds={serverlessacceptors.map(r => r.dropwizard.get('id'))}
              timeConfig={timeConfig}
              y1={{
                min: 0,
                formatter: number.perSecond.compact,
                metrics: serverlessacceptors.map(() => 'metrics.meters.serverless-acceptor.trace.messages'),
                labels: acceptorLabels,
                type: 'stackedArea'
              }}
            />
          </DashboardSection>

          <DashboardSection title={t('in-internal:monitoringUnit.serverless.serverlessAcceptors.traceDropDeniedMsg')}>
            <Chart
              snapshotIds={serverlessacceptors.map(r => r.dropwizard.get('id'))}
              timeConfig={timeConfig}
              y1={{
                min: 0,
                formatter: number.perSecond.compact,
                metrics: serverlessacceptors.map(() => 'metrics.meters.serverless-acceptor.trace.rate-limit-dropped'),
                labels: acceptorLabels,
                type: 'stackedArea'
              }}
            />
          </DashboardSection>
        </Columize>

        <Columize>
          <DashboardSection title={t('in-internal:monitoringUnit.serverless.serverlessAcceptors.bundleMsg')}>
            <Chart
              snapshotIds={serverlessacceptors.map(r => r.dropwizard.get('id'))}
              timeConfig={timeConfig}
              y1={{
                min: 0,
                formatter: number.perSecond.compact,
                metrics: serverlessacceptors.map(() => 'metrics.meters.serverless-acceptor.bundle.messages'),
                labels: acceptorLabels,
                type: 'stackedArea'
              }}
            />
          </DashboardSection>

          <DashboardSection title={t('in-internal:monitoringUnit.serverless.serverlessAcceptors.bundleDropDeniedMsg')}>
            <Chart
              snapshotIds={serverlessacceptors.map(r => r.dropwizard.get('id'))}
              timeConfig={timeConfig}
              y1={{
                min: 0,
                formatter: number.perSecond.compact,
                metrics: serverlessacceptors.map(() => 'metrics.meters.serverless-acceptor.bundle.rate-limit-dropped'),
                labels: acceptorLabels,
                type: 'stackedArea'
              }}
            />
          </DashboardSection>
        </Columize>

        <Columize>
          <DashboardSection title={t('in-internal:monitoringUnit.serverless.serverlessAcceptors.networkDataReceive')}>
            <Chart
              snapshotIds={serverlessacceptors.map(r => r.host.get('id'))}
              timeConfig={timeConfig}
              y1={{
                min: 0,
                formatter: bytesZeroDecimalPlaces,
                metrics: serverlessacceptors.map(() => 'ifs.eth0.rx.bytes'),
                labels: acceptorLabels,
                type: 'line'
              }}
            />
          </DashboardSection>

          <DashboardSection title={t('in-internal:monitoringUnit.serverless.serverlessAcceptors.networkDataTransmit')}>
            <Chart
              snapshotIds={serverlessacceptors.map(r => r.host.get('id'))}
              timeConfig={timeConfig}
              y1={{
                min: 0,
                formatter: bytesZeroDecimalPlaces,
                metrics: serverlessacceptors.map(() => 'ifs.eth0.tx.bytes'),
                labels: acceptorLabels,
                type: 'line'
              }}
            />
          </DashboardSection>
        </Columize>

        <Columize>
          <DashboardSection title={t('in-internal:monitoringUnit.serverless.serverlessAcceptors.cpuLoad')}>
            <Chart
              snapshotIds={serverlessacceptors.map(r => r.host.get('id'))}
              timeConfig={timeConfig}
              minRollup={5000}
              y1={{
                min: 0,
                formatter: number.detailed,
                tooltipFormatter: number.detailed,
                metrics: serverlessacceptors.map(() => 'load.1min'),
                labels: serverlessacceptors.map(r => r.host.get('label')),
                type: 'line'
              }}
            />
          </DashboardSection>

          <DashboardSection
            title={t('in-internal:monitoringUnit.serverless.serverlessAcceptors.hostsLength', {
              length: serverlessacceptors.length
            })}
          >
            <Table cols={cols} rows={serverlessacceptors} getRowDetails={getRowDetails} />
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
      <DashboardSection title={t('in-internal:monitoringUnit.serverless.serverlessAcceptors.cpuUsage')}>
        <Chart
          snapshotId={row.host.get('id')}
          timeConfig={row.timeConfig}
          y1={{
            min: 0,
            max: 1,
            formatter: percentageZeroDecimalPlaces,
            metrics: ['cpu.user', 'cpu.sys', 'cpu.wait', 'cpu.nice', 'cpu.steal'],
            labels: [
              t('in-internal:monitoringUnit.serverless.serverlessAcceptors.user'),
              t('in-internal:monitoringUnit.serverless.serverlessAcceptors.system'),
              t('in-internal:monitoringUnit.serverless.serverlessAcceptors.wait'),
              t('in-internal:monitoringUnit.serverless.serverlessAcceptors.nice'),
              t('in-internal:monitoringUnit.serverless.serverlessAcceptors.steal')
            ],
            type: 'stackedArea'
          }}
        />
      </DashboardSection>
    </Fragment>
  );
}
