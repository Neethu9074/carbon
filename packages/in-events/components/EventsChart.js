import theme from 'in-themes';
import React from 'react';

import { getBlockSizeMillis, getPredefinedBlockSizeMillisForBlockSize } from 'in-services/util/dynamicAggregation';
import globalHighlightAction from 'in-components/Chart/components/ContextMenu/actions/globalHighlight';
import OpenEventsCountChartWrapper from 'in-events/components/OpenEventsCountChartWrapper';
import { getNextValidRollup } from 'in-events/components/eventChartRollups';
import getElementDimensions from 'in-hoc/getElementDimensions';
import Renderer from 'in-components/Chart/renderer/Renderer';
import { number } from 'in-services/formatters/number';
import { MINIMUM_ROLLUP } from 'in-stores/metric';

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
    <OpenEventsCountChartWrapper
      cardTitle="Open events"
      timeConfig={timeConfig}
      granularity={granularity}
      includeFirstDataPoint
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
      primaryContextMenuAction={globalHighlightAction.name}
    />
  );
});

function getIncidentConfigs(labels, metrics, colors, metricsConfiguration, granularity, query) {
  labels.push('Incidents');
  metrics.push('incidents');
  colors.push(theme.lib.colors.orange800);
  metricsConfiguration.incidents = {
    query: getQueryWithEventTypeFilter('incident', query),
    granularity
  };
}

function getIssueConfigs(labels, metrics, colors, metricsConfiguration, granularity, query) {
  labels.push('Critical', 'Warning');
  metrics.push('critical', 'warning');
  colors.push(theme.lib.colors.red800, theme.lib.colors.yellow800);
  metricsConfiguration.critical = {
    query: getQueryWithEventTypeFilter('critical', query),
    granularity
  };
  metricsConfiguration.warning = {
    query: getQueryWithEventTypeFilter('warning', query),
    granularity
  };
}

function getChangeConfigs(labels, metrics, colors, metricsConfiguration, granularity, query) {
  labels.push('Offline', 'Online', 'Changes');
  metrics.push('offline', 'online', 'changes');
  colors.push('#9aa5a9', '#99e1e1', '#cdbcf0');
  metricsConfiguration.offline = {
    query: getQueryWithEventTypeFilter('offline', query),
    granularity
  };
  metricsConfiguration.online = {
    query: getQueryWithEventTypeFilter('online', query),
    granularity
  };
  metricsConfiguration.changes = {
    query: getQueryWithEventTypeFilter('change', query),
    granularity
  };
}

function getQueryWithEventTypeFilter(eventType, query) {
  if (!query || query.trim() === '') {
    return `event.type:${eventType}`;
  }
  return `event.type:${eventType} (${query.trim()})`;
}
