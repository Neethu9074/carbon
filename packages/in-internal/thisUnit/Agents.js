/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React, { Fragment } from 'react';

import LoadingIndicator from 'in-new-components/LoadingIndicators/LoadingIndicator';
import { getDashboardLink } from 'in-stores/navigation/paths/dashboardPaths';
import InternalViewWrapper from 'in-internal/components/InternalViewWrapper';
import Chart from 'in-components/Chart/InfrastructureMetricChartBehavior';
import { percentage, number } from 'in-services/formatters/number';
import Table from 'in-sdk/components/dashboard/Table';
import { timeConfig$ } from 'in-stores/time/config';
import { getSnapshots } from 'in-stores/snapshot';
import search from 'in-subscription/search';
import connectTo from 'in-hoc/connectTo';
import Link from 'in-components/Link';
import { t } from 'in-i18n';

const cols = [
  {
    title: t('in-internal:monitoringUnit.thisUnit.agent.agentTitle'),
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.snapshot.get('label');
      },
      getContent(val, row) {
        return <Link href$={getDashboardLink(row.snapshot.get('id'), { pathname: '/physical/dashboard' })}>{val}</Link>;
      }
    }
  },
  {
    title: t('in-internal:monitoringUnit.thisUnit.agent.sensorTimeConsumed'),
    type: 'metric',
    typeArgs: {
      getSnapshotId(row) {
        return row.snapshot.get('id');
      },
      getMetricName() {
        return `sensors.scheduler.consumed`;
      },
      getContent: percentage.compact,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  },
  {
    title: t('in-internal:monitoringUnit.thisUnit.agent.slowSensorsCount'),
    type: 'metric',
    typeArgs: {
      getSnapshotId(row) {
        return row.snapshot.get('id');
      },
      getMetricName() {
        return `sensors.scheduler.slow`;
      },
      getContent: number.detailed,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  },
  {
    title: t('in-internal:monitoringUnit.thisUnit.agent.cpuLoad'),
    type: 'metric',
    typeArgs: {
      getSnapshotId(row) {
        return row.snapshot.get('id');
      },
      getMetricName() {
        return `cpu.load`;
      },
      getContent: number.detailed,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  },
  {
    title: t('in-internal:monitoringUnit.thisUnit.agent.errCount'),
    type: 'metric',
    typeArgs: {
      getSnapshotId(row) {
        return row.snapshot.get('id');
      },
      getMetricName() {
        return `log.counts.byLevel.ERROR`;
      },
      getContent: number.compact,
      getTimeWindowAggregation(row) {
        return row.snapshot.get('logAsRate') ? 'sum' : 'mean';
      }
    }
  },
  {
    title: t('in-internal:monitoringUnit.thisUnit.agent.warningCount'),
    type: 'metric',
    typeArgs: {
      getSnapshotId(row) {
        return row.snapshot.get('id');
      },
      getMetricName() {
        return `log.counts.byLevel.WARN`;
      },
      getContent: number.compact,
      getTimeWindowAggregation(row) {
        return row.snapshot.get('logAsRate') ? 'sum' : 'mean';
      }
    }
  },
  {
    title: t('in-internal:monitoringUnit.thisUnit.agent.spansOpened'),
    type: 'metric',
    typeArgs: {
      getSnapshotId(row) {
        return row.snapshot.get('id');
      },
      getMetricName() {
        return `spans.opened`;
      },
      getContent: number.compact,
      getTimeWindowAggregation() {
        return 'sum';
      },
      forceTimeWindowAggregation: true
    }
  },
  {
    title: t('in-internal:monitoringUnit.thisUnit.agent.spansClosed'),
    type: 'metric',
    typeArgs: {
      getSnapshotId(row) {
        return row.snapshot.get('id');
      },
      getMetricName() {
        return `spans.closed`;
      },
      getContent: number.compact,
      getTimeWindowAggregation() {
        return 'sum';
      },
      forceTimeWindowAggregation: true
    }
  },
  {
    title: t('in-internal:monitoringUnit.thisUnit.agent.spansFilter'),
    type: 'metric',
    typeArgs: {
      getSnapshotId(row) {
        return row.snapshot.get('id');
      },
      getMetricName() {
        return `spans.filtered`;
      },
      getContent: number.compact,
      getTimeWindowAggregation() {
        return 'sum';
      },
      forceTimeWindowAggregation: true
    }
  },
  {
    title: t('in-internal:monitoringUnit.thisUnit.agent.spansDropped'),
    type: 'metric',
    typeArgs: {
      getSnapshotId(row) {
        return row.snapshot.get('id');
      },
      getMetricName() {
        return `spans.dropped`;
      },
      getContent: number.compact,
      getTimeWindowAggregation() {
        return 'sum';
      },
      forceTimeWindowAggregation: true
    }
  }
];

export default connectTo(
  {
    timeConfig: timeConfig$,
    agents: timeConfig$
      .flatMap(timeConfig =>
        search({
          query: 'entity.selfType:agent',
          view: 'TABLE',
          timeConfig,
          restrictResultEntityType: 'instanaAgent'
        })
      )
      .flatMap(getSnapshots)
  },
  function Agents({ timeConfig, agents }) {
    const rows =
      agents &&
      agents.map(agent => ({
        key: agent.get('id'),
        snapshot: agent,
        timeConfig
      }));

    return (
      <InternalViewWrapper>
        {!rows && <LoadingIndicator />}
        {rows && (
          <Table
            cardTitle={t('in-internal:monitoringUnit.thisUnit.agent.agents')}
            cols={cols}
            rows={rows}
            getRowDetails={getRowDetails}
            maxItemsPerPage={20}
            initialSortColumn={1}
            initialSortDirection="desc"
          />
        )}
      </InternalViewWrapper>
    );
  }
);

function getRowDetails(row) {
  return (
    <Fragment>
      <Chart
        snapshotId={row.snapshot.get('id')}
        timeConfig={row.timeConfig}
        y1={{
          min: 0,
          max: 1,
          formatter: percentage.compact,
          metrics: [`sensors.scheduler.consumed`],
          labels: [t('in-internal:monitoringUnit.thisUnit.agent.sensorTimeConsumed')],
          type: 'stackedArea'
        }}
      />
      <Chart
        snapshotId={row.snapshot.get('id')}
        timeConfig={row.timeConfig}
        y1={{
          min: 0,
          formatter: number.compact,
          metrics: [`sensors.scheduler.slow`],
          labels: [t('in-internal:monitoringUnit.thisUnit.agent.slowSensorsCount')],
          type: 'stackedArea'
        }}
      />
      <Chart
        snapshotId={row.snapshot.get('id')}
        timeConfig={row.timeConfig}
        y1={{
          min: 0,
          max: 1,
          formatter: percentage.detailed,
          metrics: [`cpu.load`],
          labels: [t('in-internal:monitoringUnit.thisUnit.agent.cpuLoad')],
          type: 'stackedArea'
        }}
      />
      <Chart
        snapshotId={row.snapshot.get('id')}
        timeConfig={row.timeConfig}
        y1={{
          min: 0,
          formatter: number.compact,
          metrics: [`log.counts.byLevel.ERROR.total`, `log.counts.byLevel.WARN.total`],
          labels: [
            t('in-internal:monitoringUnit.thisUnit.agent.errCount'),
            t('in-internal:monitoringUnit.thisUnit.agent.warningCount')
          ],
          type: 'line'
        }}
      />
      <Chart
        snapshotId={row.snapshot.get('id')}
        timeConfig={row.timeConfig}
        y1={{
          min: 0,
          formatter: number.compact,
          metrics: [`spans.opened`, `spans.closed`, `spans.filtered`, `spans.dropped`],
          labels: [
            t('in-internal:monitoringUnit.thisUnit.agent.spansOpened'),
            t('in-internal:monitoringUnit.thisUnit.agent.spansClosed'),
            t('in-internal:monitoringUnit.thisUnit.agent.spansFilter'),
            t('in-internal:monitoringUnit.thisUnit.agent.spansDropped')
          ],
          type: 'line'
        }}
      />
    </Fragment>
  );
}
