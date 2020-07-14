import React from 'react';

import { getEnrichedAnalyzeFilters, convertToAnalyzeFilters } from 'in-events/components/AnalyzeApplicationEventButton';
import { applicationsAlertingEventDetailsGoToAnalyze } from 'in-applications/alerting/tracker';
import { tagFiltersForBoundaryScope, getLinkToAnalyze } from 'in-analyze/navigation/paths';
import AffectedEntities from 'in-events/components/AffectedEntities/AffectedEntities';
import { getTimeConfigFromEvent } from 'in-events/timeframe';
import Card from 'in-new-components/Card';
import Link from 'in-components/Link';

export function SmartAlertAffectedEntities({ alertConfig, event }) {
  const timeConfig = getTimeConfigFromEvent(event);
  const filters = getEnrichedAnalyzeFilters(alertConfig, timeConfig);
  const totalFilters = convertToAnalyzeFilters(alertConfig.tagFilters);

  const needsGroupByEndpoint = filters.find(isEndpointOrServiceFilter);
  const group = needsGroupByEndpoint ? groupByEndPoints : groupByService;

  const { boundaryScope } = alertConfig;
  const metadata = event.get('metadata');
  const applicationName = metadata.get('entityLabel');
  const boundaryScopeTagFilters = tagFiltersForBoundaryScope(boundaryScope, applicationName);

  const createItemLink$ = item =>
    getLinkToAnalyze({
      applicationName,
      dataSource: 'calls',
      boundaryScope,
      serviceName: needsGroupByEndpoint ? null : item.name,
      endpointName: needsGroupByEndpoint ? item.name : null,
      filters,
      groupByTag: {},
      timeConfig
    });

  const renderLinkToAnalyzeAll = total => (
    <Link
      onClick={() => applicationsAlertingEventDetailsGoToAnalyze()}
      href$={getLinkToAnalyze({
        applicationName,
        dataSource: 'calls',
        boundaryScope,
        filters,
        groupByTag: group,
        timeConfig
      })}
    >
      Show all {total} {needsGroupByEndpoint ? 'endpoints' : 'services'}
    </Link>
  );

  return (
    <Card title={`Affected ${needsGroupByEndpoint ? 'Endpoints' : 'Services'}`}>
      <AffectedEntities
        tagFilters={[...filters, ...boundaryScopeTagFilters]}
        totalFilters={[...totalFilters, ...boundaryScopeTagFilters]}
        timeConfig={timeConfig}
        filterGroup={group}
        createItemLink$={createItemLink$}
        renderLinkToAnalyzeAll={renderLinkToAnalyzeAll}
      />
    </Card>
  );
}

const groupByEndPoints = {
  name: 'endpoint.name',
  value: '',
  entity: 'DESTINATION'
};

const groupByService = {
  name: 'service.name',
  value: '',
  entity: 'DESTINATION'
};

const isEndpointOrServiceFilter = filter =>
  filter?.name &&
  (filter.name === 'endpoint.name' ||
    filter.name === 'service.name' ||
    filter.name === 'endpoint.id' ||
    filter.name === 'service.id');
