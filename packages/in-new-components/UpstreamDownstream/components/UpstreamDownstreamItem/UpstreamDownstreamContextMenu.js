import React from 'react';

import { relationships } from 'in-new-components/UpstreamDownstream/constants';
import { getServiceDashboard } from 'in-applications/navigation/paths';
import { getLinkToAnalyze } from 'in-analyze/navigation/paths';
import { entityTypes } from 'in-analyze/applicationFilter';
import Button from 'in-new-components/Button';

import locals from './UpstreamDownstreamContextMenu.mless';

export default function ContextMenu({
  applicationId,
  applicationLabel,
  area,
  boundaryScope,
  endpointLabel,
  filters = [],
  groupByTag,
  isSynthetic,
  itemServiceId,
  itemServiceLabel,
  serviceLabel
}) {
  filters = filterForAnalyze(area, serviceLabel, itemServiceLabel, applicationLabel);

  return (
    <div className={locals.contextMenu}>
      <Button
        className={locals.button}
        kind="subtle"
        icon="lib_views_stats"
        href$={getServiceDashboard(itemServiceId, { applicationId, boundaryScope })}
      >
        Go to Dashboard
      </Button>

      <Button
        className={locals.button}
        kind="subtle"
        icon="lib_analyze"
        href$={getLinkToAnalyze({
          serviceName: area === relationships.UPSTREAM ? serviceLabel : itemServiceLabel,
          endpointName: endpointLabel,
          dataSource: 'calls',
          filters: isSynthetic
            ? [{ name: 'call.is_synthetic', value: 'true' }, { name: 'include_synthetic', value: 'true' }, ...filters]
            : filters,
          groupByTag: groupByTag ? groupByTag : {}
        })}
      >
        Go to Analyze
      </Button>
    </div>
  );
}

function filterForAnalyze(area, serviceLabel, itemServiceLabel, applicationLabel) {
  const serviceNameFilter = label => [
    { name: 'service.name', value: label, operator: 'EQUALS', entity: entityTypes.SOURCE }
  ];
  const applicationLabelFilter = entity => ({
    name: 'application.name',
    value: applicationLabel,
    operator: 'EQUALS',
    entity: entity
  });

  let filters;
  if (area === relationships.UPSTREAM) {
    filters = serviceNameFilter(itemServiceLabel);
    if (applicationLabel) {
      filters.push(applicationLabelFilter(entityTypes.DESTINATION));
    }
    return filters;
  } else if (area === relationships.DOWNSTREAM) {
    filters = serviceNameFilter(serviceLabel);
    if (applicationLabel) {
      filters.push(applicationLabelFilter(entityTypes.SOURCE));
    }
    return filters;
  }
}
