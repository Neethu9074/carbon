import React, { Fragment } from 'react';

import InternalViewWrapper from 'in-internal/components/InternalViewWrapper';
import Chart from 'in-components/Chart/InfrastructureMetricChartBehavior';
import { linkToTenantUnit } from 'in-internal/components/crossUnitLinks';
import { percentage, number } from 'in-services/formatters/number';
import LoadingIndicator from 'in-components/LoadingIndicator';
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
          max: 1,
          formatter: number.detailed,
          metrics: [`cpu.load.max`],
          labels: ['CPU Load'],
          type: 'stackedArea'
        }}
      />
    </Fragment>
  );
}
