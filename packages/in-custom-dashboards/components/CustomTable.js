import { compose, withState } from 'recompose';
import { get } from 'lodash';
import React from 'react';

import DashboardSection from 'in-sdk/components/dashboard/DashboardSection';
import Chart from 'in-components/Chart/InfrastructureMetricChartBehavior';
// TODO requires in-internal data!
import { getPhysicalStack } from 'in-internal/components/dataRetrieval';
import LoadingIndicator from 'in-components/LoadingIndicator';
import { percentage } from 'in-services/formatters/number';
import * as formatter from 'in-services/formatters/number';
import Table from 'in-sdk/components/dashboard/Table';
import { timeConfig$ } from 'in-stores/time/config';
import connectTo from 'in-hoc/connectTo';

export default compose(
  connectTo(props => ({
    timeConfig: timeConfig$,
    tableData: timeConfig$.flatMap(timeConfig =>
      getPhysicalStack({
        searchQuery: props.panel.searchQuery,
        timeConfig,
        restrictResultEntityType: props.panel.restrictResultEntityType
      })
    )
  })),
  withState('tableConfiguration', 'setTableConfiguration', props => props.panel)
)(CustomTable);

function CustomTable({ timeConfig, tableData, tableConfiguration }) {
  if (!tableData) {
    return <LoadingIndicator type="dark" />;
  }

  const { title, columns, maxItemsPerPage, restrictResultEntityType, rowDetails } = tableConfiguration;

  const rows = tableData.map(row => {
    return {
      ...row,
      key: row[restrictResultEntityType].get('id'),
      rowConfig: rowDetails,
      timeConfig
    };
  });
  return (
    <DashboardSection>
      <Table
        cardTitle={title}
        rows={rows}
        cols={transformColumns(columns)}
        getRowDetails={generateRowDetails}
        maxItemsPerPage={maxItemsPerPage}
      />
    </DashboardSection>
  );
}

function transformColumns(columns) {
  const transformedCols = [];
  columns.map(col => {
    const { title, type, typeArgs } = col;
    const { metric, timeWindowAggregation } = typeArgs;
    transformedCols.push({
      title,
      type,
      typeArgs: {
        getSnapshotId(row) {
          return row.host.get('id');
        },
        getMetricName() {
          return metric;
        },
        getContent: percentage.compact,
        getTimeWindowAggregation() {
          return timeWindowAggregation;
        }
      }
    });
  });

  return transformedCols;
}

function generateRowDetails(row) {
  const { rowConfig: panels, timeConfig } = row;
  return (
    <DashboardSection>
      {panels.map((panel, index) => {
        const { pluginIdForMetrics, format, metrics, labels, type } = panel;
        return (
          <Chart
            key={index}
            snapshotId={row[pluginIdForMetrics].get('id')}
            timeConfig={timeConfig}
            y1={{
              min: 0,
              formatter: get(formatter, format.split('.')),
              metrics,
              labels,
              type
            }}
          />
        );
      })}
    </DashboardSection>
  );
}
