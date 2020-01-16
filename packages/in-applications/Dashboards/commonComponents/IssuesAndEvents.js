import { get } from 'lodash';
import React from 'react';

import OpenEventsCountChartWrapper from 'in-events/components/OpenEventsCountChartWrapper';
import getEndpointInfo from 'in-subscription/application/getEndpointInfo';
import getServiceLabel from 'in-subscription/application/getServiceLabel';
import { getEventsViewFilteredBy } from 'in-stores/navigation/paths/eventPaths';
import getApplication from 'in-subscription/application/getApplication';
import { luceneEscapeString } from 'in-stores/search/manipulation';
import { getChartGranularity } from 'in-applications/metrics';
import Renderer from 'in-components/Chart/renderer/Renderer';
import { number } from 'in-services/formatters/number';
import connect from 'in-hoc/connectTo';
import theme from 'in-themes';

export default connect(({ applicationId, serviceId, endpointId }) => {
  const observables = {};
  if (applicationId) {
    observables.applicationName = getApplication({ id: applicationId }).map(getLabel);
  }
  if (serviceId) {
    observables.serviceName = getServiceLabel({ id: serviceId }).map(getLabel);
  }
  if (endpointId) {
    observables.endpointName = getEndpointInfo({ id: endpointId }).map(getLabel);
  }
  return observables;
})(function EventsChart({
  timeConfig,
  applicationName,
  serviceName,
  endpointName,
  applicationId,
  serviceId,
  endpointId
}) {
  const entityFilter = createEntityFilter(applicationName, serviceName, endpointName);

  // For consistency's sake with other charts in AP dashboards different granularity values
  // are being used here than for similar charts in the Events area.
  const granularity = getChartGranularity(timeConfig);

  const labels = [];
  const metricIds = [];
  const colors = [];
  const metricsConfiguration = {};

  labels.push('Infra Issues', 'Offline', 'Online', 'Changes');
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
      cardTitle="Infrastructure Issues &amp; Changes"
      timeConfig={timeConfig}
      granularity={granularity}
      snapHighlightingToMetricBars
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
      additionalContextMenuButtons={[
        {
          icon: 'lib_analyze',
          label: 'View Events',
          getHref$: highlightedTime =>
            getEventsViewFilteredBy({
              applicationId,
              serviceId,
              endpointId,
              timeConfig: highlightedTime
            })
        }
      ]}
    />
  );
});

function createEntityFilter(applicationName, serviceName, endpointName) {
  const entityFilters = [];
  if (applicationName) {
    entityFilters.push(`entity.application.name:"${luceneEscapeString(applicationName)}"`);
  }
  if (serviceName) {
    entityFilters.push(`entity.service.name:"${luceneEscapeString(serviceName)}"`);
  }
  if (endpointName) {
    entityFilters.push(`entity.endpoint.name:"${luceneEscapeString(endpointName)}"`);
  }
  const entityFilter = entityFilters.join(' AND ');
  return entityFilter;
}

function getLabel(result) {
  return get(result, ['data', 'label'], null);
}
