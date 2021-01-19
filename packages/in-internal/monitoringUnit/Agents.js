/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import React, { Fragment } from 'react';

import LoadingIndicator from 'in-new-components/LoadingIndicators/LoadingIndicator';
import InternalViewWrapper from 'in-internal/components/InternalViewWrapper';
import Chart from 'in-components/Chart/InfrastructureMetricChartBehavior';
import { linkToTenantUnit } from 'in-internal/components/crossUnitLinks';
import { percentage, number } from 'in-services/formatters/number';
import { getModifiedUrlStream } from 'in-stores/navigation';
import Table from 'in-sdk/components/dashboard/Table';
import { timeConfig$ } from 'in-stores/time/config';
import { getSnapshots } from 'in-stores/snapshot';
import search from 'in-subscription/search';
import connectTo from 'in-hoc/connectTo';
import Link from 'in-components/Link';

const cols = [
  {
    title: 'Unit',
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.snapshot.get('label');
      },
      getContent(val, row) {
        return (
          <Link
            external
            href$={getModifiedUrlStream(params => (params.pathname = '/internal/thisUnit/agents')).map(href =>
              linkToTenantUnit(href, row.snapshot.getIn(['data', 'tenant']), row.snapshot.getIn(['data', 'unit']))
            )}
          >
            {val}
          </Link>
        );
      }
    }
  },
  {
    title: 'Max Sensor Time Consumed',
    type: 'metric',
    typeArgs: {
      getSnapshotId(row) {
        return row.snapshot.get('id');
      },
      getMetricName() {
        return `sensors.scheduler.consumed.max`;
      },
      getContent: percentage.compact,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  },
  {
    title: 'Max Slow Sensors Count',
    type: 'metric',
    typeArgs: {
      getSnapshotId(row) {
        return row.snapshot.get('id');
      },
      getMetricName() {
        return `sensors.scheduler.slow.max`;
      },
      getContent: number.detailed,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  },
  {
    title: 'Max CPU Load',
    type: 'metric',
    typeArgs: {
      getSnapshotId(row) {
        return row.snapshot.get('id');
      },
      getMetricName() {
        return `cpu.load.max`;
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
        return `log.counts.byLevel.ERROR.total`;
      },
      getContent: number.compact,
      getTimeWindowAggregation(row) {
        return row.snapshot.get('logAsRate') ? 'sum' : 'mean';
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
        return `log.counts.byLevel.WARN.total`;
      },
      getContent: number.compact,
      getTimeWindowAggregation(row) {
        return row.snapshot.get('logAsRate') ? 'sum' : 'mean';
      }
    }
  },
  {
    title: 'Spans Opened',
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
    title: 'Spans Closed',
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
    title: 'Spans Filtered',
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
    title: 'Spans Dropped',
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
          query: 'entity.selfType:agentStatistics',
          view: 'TABLE',
          timeConfig,
          restrictResultEntityType: 'agentStatistics'
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
          metrics: [`sensors.scheduler.consumed.max`],
          labels: ['Max Sensor Time Consumed'],
          type: 'stackedArea'
        }}
      />
      <Chart
        snapshotId={row.snapshot.get('id')}
        timeConfig={row.timeConfig}
        y1={{
          min: 0,
          formatter: number.detailed,
          metrics: [`sensors.scheduler.slow.max`],
          labels: ['Max Slow Sensors Count'],
          type: 'stackedArea'
        }}
      />
      <Chart
        snapshotId={row.snapshot.get('id')}
        timeConfig={row.timeConfig}
        y1={{
          min: 0,
          max: 1,
          formatter: number.detailed,
          metrics: [`cpu.load.max`],
          labels: ['CPU Load'],
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
          labels: ['Error Count', 'Warning Count'],
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
          labels: ['Spans Opened', 'Spans Closed', 'Spans Filtered', 'Spans Dropped'],
          type: 'line'
        }}
      />
    </Fragment>
  );
}
