/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import { getServiceDashboard, getApplicationDashboard } from 'in-applications/navigation/paths';
import { getTagCatalog } from 'in-applications/analyze/components/workspace/CallQueryBuilder';
import { relationships } from 'in-new-components/UpstreamDownstream/constants';
import useTagCatalog from 'in-applications/hooks/useTagCatalog';
import { getLinkToAnalyze } from 'in-analyze/navigation/paths';
import { entityTypes } from 'in-analyze/applicationFilter';
import Button from 'in-new-components/Button';
import { t } from 'in-i18n';

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
  itemId,
  itemLabel,
  serviceLabel,
  itemType
}) {
  const tagCatalog = useTagCatalog(getTagCatalog);
  filters = filterForAnalyze(area, serviceLabel, itemLabel, itemType, applicationLabel);

  return (
    <div className={locals.contextMenu}>
      <Button
        className={locals.button}
        kind="subtle"
        icon="lib_views_stats"
        href$={
          itemType === relationships.SERVICE
            ? getServiceDashboard(itemId, { applicationId, boundaryScope })
            : getApplicationDashboard(itemId, { boundaryScope })
        }
      >
        {t('in-new-components:upstreamDownstream.buttonGoToDashboard')}
      </Button>

      <Button
        className={locals.button}
        kind="subtle"
        icon="lib_analyze"
        href$={
          tagCatalog &&
          getLinkToAnalyze({
            applicationName: applicationLabel,
            serviceName: area === relationships.UPSTREAM ? serviceLabel : itemLabel,
            endpointName: endpointLabel,
            dataSource: 'calls',
            filters: isSynthetic
              ? [{ name: 'call.is_synthetic', value: 'true' }, { name: 'include_synthetic', value: 'true' }, ...filters]
              : filters,
            tagCatalog,
            groupByTag: groupByTag ? groupByTag : {}
          })
        }
      >
        {t('in-new-components:upstreamDownstream.buttonGoToAnalytics')}
      </Button>
    </div>
  );
}

function filterForAnalyze(area, serviceLabel, itemLabel, itemType, applicationLabel) {
  if (itemType === relationships.SERVICE) {
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
      filters = serviceNameFilter(itemLabel);
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
}
