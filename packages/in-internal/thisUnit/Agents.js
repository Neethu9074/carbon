import React, { Fragment } from 'react';

import { getDashboardLink } from 'in-stores/navigation/paths/dashboardPaths';
import InternalViewWrapper from 'in-internal/components/InternalViewWrapper';
import Chart from 'in-components/Chart/InfrastructureMetricChartBehavior';
import { percentage, number } from 'in-services/formatters/number';
import LoadingIndicator from 'in-components/LoadingIndicator';
import Table from 'in-sdk/components/dashboard/Table';
import { timeConfig$ } from 'in-stores/time/config';
import { getSnapshots } from 'in-stores/snapshot';
import search from 'in-subscription/search';
import connectTo from 'in-hoc/connectTo';
import Link from 'in-components/Link';

const cols = [
  {
    title: 'Agent',
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
    title: 'Sensor Time Consumed',
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
    title: 'Slow Sensors Count',
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
    title: 'CPU Load',
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
    title: 'Error Count',
    type: 'metric',
    typeArgs: {
      getSnapshotId(row) {
        return row.snapshot.get('id');
      },
      getMetricName() {
        return `log.counts.byLevel.ERROR`;
      },
      getContent: number.compact,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  },
  {
    title: 'Warning Count',
    type: 'metric',
    typeArgs: {
      getSnapshotId(row) {
        return row.snapshot.get('id');
      },
      getMetricName() {
        return `log.counts.byLevel.WARN`;
      },
      getContent: number.compact,
      getTimeWindowAggregation() {
        return 'mean';
      }
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
        {!rows && <LoadingIndicator type="dark" />}
        {rows && (
          <Table
            cardTitle="Agents"
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
          labels: ['Sensor Time Consumed'],
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
          labels: ['Slow Sensors Count'],
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
          labels: ['CPU Load'],
          type: 'stackedArea'
        }}
      />
    </Fragment>
  );
}
