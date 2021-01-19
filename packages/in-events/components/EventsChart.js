/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
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

export default getElementDimensions(function EventsChartWidthWrapper(props) {
  return <div>{props.width && <EventsChart {...props} />}</div>;
});

function EventsChart({ width, timeConfig, query, eventType }) {
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
  // Only show Agent Monitoring Issues on their own tab, not as part of "All events"
  if (eventType && eventType === 'agent_monitoring_issue') {
    getAgentMonitoringConfigs(labels, metricIds, colors, metricsConfiguration, granularity, query);
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
      riginalTimeConfig={timeConfig}
    />
  );
}

function getIncidentConfigs(labels, metrics, colors, metricsConfiguration, granularity, query) {
  labels.push('Incidents');
  metrics.push('incidents');
  colors.push(theme.lib.colors.orange800);
  metricsConfiguration.incidents = {
    query: getQueryWithEventTypeFilter('event.type:incident', query),
    granularity
  };
}

function getIssueConfigs(labels, metrics, colors, metricsConfiguration, granularity, query) {
  labels.push('Critical', 'Warning');
  metrics.push('critical', 'warning');
  colors.push(theme.lib.colors.red800, theme.lib.colors.yellow800);
  metricsConfiguration.critical = {
    query: getQueryWithEventTypeFilter('event.type:critical', query),
    granularity
  };
  metricsConfiguration.warning = {
    query: getQueryWithEventTypeFilter('event.type:warning', query),
    granularity
  };
}

function getChangeConfigs(labels, metrics, colors, metricsConfiguration, granularity, query) {
  labels.push('Offline', 'Online', 'Changes');
  metrics.push('offline', 'online', 'changes');
  colors.push('#9aa5a9', '#99e1e1', '#cdbcf0');
  metricsConfiguration.offline = {
    query: getQueryWithEventTypeFilter('event.type:offline', query),
    granularity
  };
  metricsConfiguration.online = {
    query: getQueryWithEventTypeFilter('event.type:online', query),
    granularity
  };
  metricsConfiguration.changes = {
    query: getQueryWithEventTypeFilter('event.type:change', query),
    granularity
  };
}

function getAgentMonitoringConfigs(labels, metrics, colors, metricsConfiguration, granularity, query) {
  labels.push('Critical', 'Warning');
  metrics.push('agent_monitoring_issue_critical', 'agent_monitoring_issue_warning');
  colors.push(theme.lib.colors.red800, theme.lib.colors.yellow800);
  metricsConfiguration.agent_monitoring_issue_critical = {
    query: getQueryWithEventTypeFilter('event.type:agent_monitoring_issue event.severity:10', query),
    granularity
  };
  metricsConfiguration.agent_monitoring_issue_warning = {
    query: getQueryWithEventTypeFilter('event.type:agent_monitoring_issue event.severity:5', query),
    granularity
  };
}

function getQueryWithEventTypeFilter(eventFilter, query) {
  if (!query || query.trim() === '') {
    return eventFilter;
  }
  return `${eventFilter} (${query.trim()})`;
}
