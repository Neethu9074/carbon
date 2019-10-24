import React from 'react';

import { getBlockSizeMillis, getPredefinedBlockSizeMillisForBlockSize } from 'in-services/util/dynamicAggregation';
import OpenEventsCountChartWrapper from 'in-events/components/OpenEventsCountChartWrapper';
import { getNextValidRollup } from 'in-events/components/eventChartRollups';
import getElementDimensions from 'in-hoc/getElementDimensions';
import Renderer from 'in-components/Chart/renderer/Renderer';
import { number } from 'in-services/formatters/number';
import { MINIMUM_ROLLUP } from 'in-stores/metric';
import theme from 'in-themes';

import locals from './EventsChart.mless';

export default getElementDimensions(function EventsChart({ width, timeConfig, query, eventType }) {
  if (!width) {
    return <div />;
  }

  const blockSizeMillis = getPredefinedBlockSizeMillisForBlockSize(
    getBlockSizeMillis({
      windowSize: timeConfig.windowSize,
      minPixelsPerBlock: 5,
      width,
      rollup: MINIMUM_ROLLUP
    })
  );
  const granularity = getNextValidRollup(blockSizeMillis);

  const labels = [];
  const metricIds = [];
  const colors = [];
  const metricsConfiguration = {};

  if (!eventType || eventType === 'incident') {
    getIncidentConfigs(labels, metricIds, colors, metricsConfiguration, granularity, query);
  }
  if (!eventType || eventType === 'issue') {
    getIssueConfigs(labels, metricIds, colors, metricsConfiguration, granularity, query);
  }
  if (!eventType || eventType === 'change') {
    getChangeConfigs(labels, metricIds, colors, metricsConfiguration, granularity, query);
  }

  return (
    <>
      <div className={locals.spacer} />
      <OpenEventsCountChartWrapper
        cardTitle="Open events"
        timeConfig={timeConfig}
        granularity={granularity}
        snapHighlightingToMetricBars
        y1={{
          renderer: Renderer.stackedBar,
          formatter: number.forcedCompact,
          labels,
          metricIds,
          colors
        }}
        metricsConfiguration={{
          timeConfig: timeConfig,
          metrics: metricsConfiguration
        }}
      />
    </>
  );
});

function getIncidentConfigs(labels, metrics, colors, metricsConfiguration, granularity, query) {
  labels.push('Incidents');
  metrics.push('incidents');
  colors.push(theme.lib.colors.orange800);
  metricsConfiguration.incidents = {
    query: `event.type:incident ${query || ''}`.trim(),
    granularity
  };
}

function getIssueConfigs(labels, metrics, colors, metricsConfiguration, granularity, query) {
  labels.push('Critical', 'Warning');
  metrics.push('critical', 'warning');
  colors.push(theme.lib.colors.red800, theme.lib.colors.yellow800);
  metricsConfiguration.critical = {
    query: `event.type:critical ${query || ''}`.trim(),
    granularity
  };
  metricsConfiguration.warning = {
    query: `event.type:warning ${query || ''}`.trim(),
    granularity
  };
}

function getChangeConfigs(labels, metrics, colors, metricsConfiguration, granularity, query) {
  labels.push('Offline', 'Online', 'Changes');
  metrics.push('offline', 'online', 'changes');
  colors.push('#9aa5a9', '#99e1e1', '#cdbcf0');
  metricsConfiguration.offline = {
    query: `event.type:offline ${query || ''}`.trim(),
    granularity
  };
  metricsConfiguration.online = {
    query: `event.type:online ${query || ''}`.trim(),
    granularity
  };
  metricsConfiguration.changes = {
    query: `event.type:change ${query || ''}`.trim(),
    granularity
  };
}
