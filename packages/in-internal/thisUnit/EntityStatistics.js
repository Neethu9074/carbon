/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import React from 'react';

import InternalViewWrapper from 'in-internal/components/InternalViewWrapper';
import DashboardSection from 'in-sdk/components/dashboard/DashboardSection';
import { plugins, ID_OF_PROCESSING_STATISTICS } from 'in-forge/constants';
import { number } from 'in-services/formatters/number';
import Table from 'in-sdk/components/dashboard/Table';
import { timeConfig$ } from 'in-stores/time/config';
import { getSingular } from 'in-sdk/pluginName';
import connectTo from 'in-hoc/connectTo';
import Chart from 'in-components/Chart/InfrastructureMetricChartBehavior';

const cols = [
  {
    title: 'Plugin',
    type: 'string',
    typeArgs: {
      getValue(row) {
        return getSingular(row.plugin);
      }
    }
  },
  {
    title: 'Count',
    type: 'metric',
    typeArgs: {
      getSnapshotId() {
        return ID_OF_PROCESSING_STATISTICS;
      },
      getMetricName(row) {
        return `plugin.${row.plugin}`;
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
    timeConfig: timeConfig$
  },
  function Cockpit({ timeConfig }) {
    const rows = Object.keys(plugins).map(key => ({ key: plugins[key], plugin: plugins[key], timeConfig }));

    return (
      <InternalViewWrapper>
        <h1>Cockpit</h1>

        <DashboardSection title={`Entity Count`}>
          <Chart
            snapshotId={ID_OF_PROCESSING_STATISTICS}
            timeConfig={timeConfig}
            y1={{
              min: 0,
              formatter: number.compact,
              metrics: [`physicalEntities`],
              labels: ['Count over time'],
              type: 'line'
            }}
          />
        </DashboardSection>

        <Table
          cardTitle="Per Plugin Entity Counts"
          cols={cols}
          rows={rows}
          getRowDetails={getRowDetails}
          maxItemsPerPage={20}
          initialSortColumn={1}
          initialSortDirection="desc"
        />
      </InternalViewWrapper>
    );
  }
);

function getRowDetails(row) {
  return (
    <Chart
      snapshotId={ID_OF_PROCESSING_STATISTICS}
      timeConfig={row.timeConfig}
      y1={{
        min: 0,
        formatter: number.compact,
        metrics: [`plugin.${row.plugin}`],
        labels: ['Count over time'],
        type: 'line'
      }}
    />
  );
}
