/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import theme from 'in-themes';
import { t } from 'in-i18n';
import React from 'react';

import OpenEventsCountChartWrapper from 'in-events/components/OpenEventsCountChartWrapper';
import { getEventsViewFilteredBy } from 'in-stores/navigation/paths/eventPaths';
import { getChartGranularity } from 'in-stores/metric/metric';
import Renderer from 'in-components/Chart/renderer/Renderer';
import { number } from 'in-services/formatters/number';

export default function EventsChart({ timeConfig, applicationId, serviceId, endpointId, renderPostChartContent }) {
  const entityFilter = createEntityFilter(applicationId, serviceId, endpointId);

  // For consistency's sake with other charts in AP dashboards different granularity values
  // are being used here than for similar charts in the Events area.
  const granularity = getChartGranularity(timeConfig);

  const labels = [];
  const metricIds = [];
  const colors = [];
  const metricsConfiguration = {};

  labels.push(
    t('in-applications:labelInfraIssues'),
    t('in-applications:labelOffline'),
    t('in-applications:labelOnline'),
    t('in-applications:labelChanges')
  );
  metricIds.push('infraIssues', 'offline', 'online', 'changes');
  colors.push(theme.lib.colors.pink800, '#9aa5a9', '#99e1e1', '#cdbcf0');

  metricsConfiguration.infraIssues = {
    query: `(event.type:warning OR event.type:critical) AND ${entityFilter}`,
    granularity
  };
  metricsConfiguration.offline = {
    query: `event.type:offline AND ${entityFilter}`,
    granularity
  };
  metricsConfiguration.online = {
    query: `event.type:online AND ${entityFilter}`,
    granularity
  };
  metricsConfiguration.changes = {
    query: `event.type:change AND ${entityFilter}`,
    granularity
  };

  return (
    <OpenEventsCountChartWrapper
      renderPostChartContent={renderPostChartContent}
      cardTitle={t('in-applications:dashboards.infrastructureIssuesChanges')}
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
      primaryContextMenuAction="showEvents"
      additionalContextMenuButtons={[
        {
          name: 'showEvents',
          icon: 'lib_events_inverted',
          label: t('in-applications:labelViewEvents'),
          getHref$: highlightedTime =>
            getEventsViewFilteredBy({
              query: 'event.source:infra',
              applicationId,
              serviceId,
              endpointId,
              timeConfig: highlightedTime
            })
        }
      ]}
    />
  );
}

function createEntityFilter(applicationId, serviceId, endpointId) {
  const entityFilters = ['entity.pluginId:infra'];
  if (applicationId) {
    entityFilters.push(`entity.application.id:"${applicationId}"`);
  }
  if (serviceId) {
    entityFilters.push(`entity.service.id:"${serviceId}"`);
  }
  if (endpointId) {
    entityFilters.push(`entity.endpoint.id:"${endpointId}"`);
  }
  const entityFilter = entityFilters.join(' AND ');
  return entityFilter;
}
