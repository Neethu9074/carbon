/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import { getBlockSizeMillis, getPredefinedBlockSizeMillisForBlockSize } from 'in-services/util/dynamicAggregation';
import globalHighlightAction from 'in-components/Chart/components/ContextMenu/actions/globalHighlight';
import OpenEventsCountChartWrapper from 'in-events/components/OpenEventsCountChartWrapper';
import { getNextValidRollup } from 'in-events/components/eventChartRollups';
import { outlineForColor, carbonAlert } from 'in-themes/chartColors';
import useResizeObserverCustom from 'in-hooks/useResizeObserver';
import Renderer from 'in-components/Chart/renderer/Renderer';
import { number } from 'in-services/formatters/number';
import { t } from 'in-i18n';

export default function EventsChart({ timeConfig, query, eventType }) {
  const { width, ref } = useResizeObserverCustom();

  const blockSizeMillis = getPredefinedBlockSizeMillisForBlockSize(
    getBlockSizeMillis({
      windowSize: timeConfig.windowSize,
      minPixelsPerBlock: 5,
      width
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
  if (eventType === 'cve_issue') {
    getCveIssueConfigss(labels, metricIds, colors, metricsConfiguration, granularity, query);
  }
  if (eventType === 'prc_issue') {
    getPrcIssueConfigs(labels, metricIds, colors, metricsConfiguration, granularity, query);
  }

  return (
    <div ref={ref}>
      {width && (
        <OpenEventsCountChartWrapper
          cardTitle={t('in-events:titleOpenEvents')}
          timeConfig={timeConfig}
          granularity={granularity}
          includeFirstDataPoint
          y1={{
            renderer: Renderer.stackedBar,
            formatter: number.forcedCompact,
            labels,
            metricIds,
            outlineForColor,
            colors
          }}
          metricsConfiguration={{
            timeConfig: timeConfig,
            metrics: metricsConfiguration
          }}
          primaryContextMenuAction={globalHighlightAction.name}
          riginalTimeConfig={timeConfig}
        />
      )}
    </div>
  );
}

function getIncidentConfigs(labels, metrics, colors, metricsConfiguration, granularity, query) {
  labels.push(t('in-events:labelIncidents'));
  metrics.push('incidents');
  colors.push(carbonAlert.orange40);
  metricsConfiguration.incidents = {
    query: getQueryWithEventTypeFilter('event.type:incident', query),
    granularity
  };
}

function getIssueConfigs(labels, metrics, colors, metricsConfiguration, granularity, query) {
  labels.push(t('in-events:labelCritical'), t('in-events:labelWarning'));
  metrics.push('critical', 'warning');
  colors.push(carbonAlert.red60, carbonAlert.yellow30);
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
  labels.push(t('in-events:labelOffline'), t('in-events:labelOnline'), t('in-events:labelChanges'));
  metrics.push('offline', 'online', 'changes');
  colors.push(carbonAlert.gray60, carbonAlert.blue70, carbonAlert.purple50);
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
  labels.push(t('in-events:labelCritical'), t('in-events:labelWarning'));
  metrics.push('agent_monitoring_issue_critical', 'agent_monitoring_issue_warning');
  colors.push(carbonAlert.red60, carbonAlert.yellow30);
  metricsConfiguration.agent_monitoring_issue_critical = {
    query: getQueryWithEventTypeFilter('event.type:agent_monitoring_issue event.severity:10', query),
    granularity
  };
  metricsConfiguration.agent_monitoring_issue_warning = {
    query: getQueryWithEventTypeFilter('event.type:agent_monitoring_issue event.severity:5', query),
    granularity
  };
}

function getCveIssueConfigss(labels, metrics, colors, metricsConfiguration, granularity, query) {
  labels.push(t('in-events:labelCritical'), t('in-events:labelWarning'), t('in-events:labelLow'));
  metrics.push('cve_issue_Critical', 'cve_issue_Warning', 'cve_issue_Low');
  colors.push(carbonAlert.red60, carbonAlert.orange40, carbonAlert.yellow30);
  metricsConfiguration.cve_issue_Critical = {
    query: getQueryWithEventTypeFilter('event.type:cve_issue event.cve.severity:Critical', query),
    granularity
  };
  metricsConfiguration.cve_issue_Warning = {
    query: getQueryWithEventTypeFilter('event.type:cve_issue event.cve.severity:Warning', query),
    granularity
  };
  metricsConfiguration.cve_issue_Low = {
    query: getQueryWithEventTypeFilter('event.type:cve_issue event.cve.severity:Low', query),
    granularity
  };
}

function getPrcIssueConfigs(labels, metrics, colors, metricsConfiguration, granularity, query) {
  labels.push(t('in-events:labelPrcIssue'));
  metrics.push('prc_issues');
  colors.push(carbonAlert.orange40);
  metricsConfiguration.prc_issues = {
    query: getQueryWithEventTypeFilter('event.type:prc_issue', query),
    granularity
  };
}

function getQueryWithEventTypeFilter(eventFilter, query) {
  if (!query || query.trim() === '') {
    return eventFilter;
  }
  return `${eventFilter} (${query.trim()})`;
}
