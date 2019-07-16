import { compose, withState } from 'recompose';
import { get } from 'lodash';
import React from 'react';

import DashboardSection from 'in-sdk/components/dashboard/DashboardSection';
import Chart from 'in-components/Chart/InfrastructureMetricChartBehavior';
// TODO requires in-internal data!
import { getPhysicalStack } from 'in-internal/components/dataRetrieval';
import Handlebars from 'in-services/templateEngines/handlebars';
import LoadingIndicator from 'in-components/LoadingIndicator';
import * as formatter from 'in-services/formatters/number';
import { timeConfig$ } from 'in-stores/time/config';
import connectTo from 'in-hoc/connectTo';

// maps observables to CustomChart props
export default compose(
  connectTo(props => ({
    timeConfig: timeConfig$,
    chartData: timeConfig$.flatMap(timeConfig =>
      getPhysicalStack({
        searchQuery: props.panel.searchQuery,
        timeConfig,
        restrictResultEntityType: props.panel.restrictResultEntityType
      })
    )
  })),
  withState('chartConfiguration', 'setChartConfiguration', props => props.panel)
)(CustomChart);

function CustomChart({ timeConfig, chartData, chartConfiguration }) {
  if (!chartData) {
    return <LoadingIndicator type="dark" />;
  }

  const { title, pluginIdForMetrics, y1, y2 } = chartConfiguration;
  return (
    <DashboardSection title={title}>
      <Chart
        snapshotIds={chartData.map(r => r[pluginIdForMetrics].get('id'))}
        timeConfig={timeConfig}
        y1={resolveAxis(chartData, y1)}
        y2={y2 ? resolveAxis(chartData, y2) : null}
      />
    </DashboardSection>
  );
}

function resolveAxis(chartData, axisConfig) {
  const { format, metrics, labels, type } = axisConfig;
  return {
    formatter: get(formatter, format.split('.')),
    metrics: chartData.map(() => metrics[0]),
    labels: generateChartLabels(chartData, labels.template),
    type
  };
}

function generateChartLabels(searchResults, templateValue) {
  const transformedData = [];

  // transform immutable structure to plain javascript
  searchResults.forEach((searchResult, index) => {
    const transformedSearchResult = Object.keys(searchResult).reduce((agg, plugin) => {
      agg[plugin] = searchResult[plugin].toJS();
      return agg;
    }, {});

    transformedData[index] = transformedSearchResult;
  });

  const compiled = Handlebars.compile(templateValue);

  // bind each result to it's own label
  const chartLabels = [];
  for (let i = 0; i < transformedData.length; i++) {
    chartLabels[i] = compiled({ $: transformedData[i] });
  }

  const sortedLabels = chartLabels.sort((a, b) => a.localeCompare(b));
  return sortedLabels;
}
