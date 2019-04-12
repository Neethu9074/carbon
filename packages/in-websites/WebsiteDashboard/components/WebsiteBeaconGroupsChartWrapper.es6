import { compose, withState, withProps } from 'recompose';
import { find } from 'lodash';
import React from 'react';

import getWebsiteBeaconGroups from 'in-subscription/websiteMonitoring/getWebsiteBeaconGroups';
import { getChartGranularity, getResolvedTimeConfig } from 'in-applications/metrics';
import ResultAwareChart from 'in-components/Chart/ResultAwareChart';
import ButtonGroup from 'in-new-components/ButtonGroup';
import { identity } from 'in-services/util/function';
import connectTo from 'in-hoc/connectTo';

// Sample Usage
/*
<WebsiteBeaconGroupsChartWrapper
            cardTitle="My First Chart"
            timeConfig={timeConfig}
            tagFilters={tagFilters}
            group={{
              groupbyTag: 'data.grouping.key'
            }}
            metrics={[
              {
                label: 'Count',
                metric: 'count',
                aggregation: 'SUM',
                formatter: number,
                renderer: Renderer.stackedBar
              }
            ]}

            // OPTIONAL FIELDS //

            metricIds={['group 1', 'group 2', 'group 3']}  <-- If present, all groups that will be drawn / in the legend
            translateLabel={key => getLabelFor(key)}  <-- Function to translate the metricIds or groups to nice label
            translateColor={key => getColorFor(key)}  <-- Function to translate the metricIds or groups to a fixed color
          />
 */
export default compose(
  connectTo(({ tagFilters, timeConfig, group, metrics, retrievalSize }) => ({
    result: getWebsiteBeaconGroups({
      pagination: {
        retrievalSize: retrievalSize || 10
      },
      group,
      timeConfig,
      tagFilters,
      order: {
        by: 'name',
        direction: 'ASC'
      },
      metrics: metrics.reduce((agg, metric) => {
        agg[getMetricKey(metric)] = {
          metric: metric.metric,
          aggregation: metric.aggregation,
          granularity: getChartGranularity(timeConfig)
        };
        return agg;
      }, {})
    })
  })),
  withState('selectedMetricKey', 'setSelectedMetricKey', null),
  withProps(({ selectedMetricKey, metrics }) => ({
    selectedMetricKey: selectedMetricKey || getMetricKey(metrics[0]),
    selectedMetricDefinition: find(metrics, m => getMetricKey(m) === selectedMetricKey) || metrics[0]
  }))
)(WebsiteBeaconGroupsChartWrapper);

function WebsiteBeaconGroupsChartWrapper({
  result,
  selectedMetricKey,
  selectedMetricDefinition,
  setSelectedMetricKey,
  timeConfig,
  cardTitle,
  translateLabel = identity,
  translateColor,
  metricIds,
  metrics
}) {
  const cardHeader = metrics.length > 1 && (
    <ButtonGroup
      buttonPropsList={metrics.map(metric => ({
        text: metric.label,
        key: getMetricKey(metric),
        onClick: () => setSelectedMetricKey(getMetricKey(metric))
      }))}
      activeKey={selectedMetricKey}
    />
  );

  const chartConfig = {
    cardTitle,
    cardHeader,
    granularity: getChartGranularity(timeConfig),
    y1: {
      formatter: selectedMetricDefinition.formatter,
      renderer: selectedMetricDefinition.renderer
    }
  };

  const validItem = findValidItem(result, selectedMetricKey);
  if (validItem) {
    if (!metricIds) {
      metricIds = result.data.items.map(item => item.name).sort();
    }

    chartConfig.timeConfig = getResolvedTimeConfig(timeConfig, result);
    chartConfig.y1.labels = metricIds.map(getLabel);
    chartConfig.y1.metrics = metricIds.map(label => {
      const matchingItem = result.data.items.find(item => parseJson(label) === parseJson(item.name));
      if (matchingItem) {
        return matchingItem.metrics[selectedMetricKey];
      }
      if (selectedMetricDefinition.fallbackMetricValue == null) {
        return [];
      }
      return validItem.metrics[selectedMetricKey].map(([ts]) => [ts, selectedMetricDefinition.fallbackMetricValue]);
    });

    chartConfig.y1.aggregations = metricIds.map(() => selectedMetricDefinition.aggregation);

    if (translateColor) {
      const colors = metricIds.map(label => translateColor(parseJson(label)));
      // Only replace if every color could be translated (not undefined), otherwise will fall-back to default colors
      if (colors.every(item => item)) {
        chartConfig.y1.colors = colors;
      }
    }
  }

  return <ResultAwareChart result={result} config={chartConfig} />;

  function getLabel(key) {
    const label = parseJson(key);
    return translateLabel(label) || label;
  }

  function parseJson(key) {
    try {
      return JSON.parse(key);
    } catch (e) {
      return key;
    }
  }
}

function getMetricKey(metricDefinition) {
  return `${metricDefinition.metric}_${metricDefinition.aggregation}`;
}

function findValidItem(result, selectedMetricKey) {
  if (result.data && result.data.items && result.data.items.length > 0) {
    return find(result.data.items, item => item.metrics[selectedMetricKey]);
  }
  return false;
}
