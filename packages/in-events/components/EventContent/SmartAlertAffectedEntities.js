import React from 'react';

import { getEnrichedAnalyzeFilters } from 'in-events/components/AnalyzeApplicationEventButton';
import { applicationsAlertingEventDetailsGoToAnalyze } from 'in-applications/alerting/tracker';
import { groupByEndpointName, groupByServiceName } from 'in-analyze/AnalyzeView/dataSources';
import { tagFiltersForBoundaryScope, getLinkToAnalyze } from 'in-analyze/navigation/paths';
import AffectedEntities from 'in-events/components/AffectedEntities/AffectedEntities';
import { convertToAnalyzeFilters } from 'in-applications/tags';
import { getTimeConfigFromEvent } from 'in-events/timeframe';
import Card from 'in-new-components/Card';
import Link from 'in-components/Link';

export function SmartAlertAffectedEntities({ alertConfig, event }) {
  if (alertConfig.rule.alertType === 'throughput') {
    // we don't show the affected services/endpoints list for this blueprint type, because there is no simple property
    // to differentiate single calls from being violated or non-violated. Thus, we have to come up with a new way to do
    // this distinction.
    return null;
  }

  const timeConfig = getTimeConfigFromEvent(event);
  const filters = getEnrichedAnalyzeFilters(alertConfig, timeConfig);
  const totalFilters = convertToAnalyzeFilters(alertConfig.tagFilters);

  const needsGroupByEndpoint = filters.find(isEndpointOrServiceFilter);
  const group = needsGroupByEndpoint ? groupByEndpointName : groupByServiceName;

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

const isEndpointOrServiceFilter = filter =>
  filter?.name &&
  (filter.name === 'endpoint.name' ||
    filter.name === 'service.name' ||
    filter.name === 'endpoint.id' ||
    filter.name === 'service.id');
