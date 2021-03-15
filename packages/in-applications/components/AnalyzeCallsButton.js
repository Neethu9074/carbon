/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { get } from 'lodash';
import React from 'react';

import {
  getTagFiltersForSyntheticOption,
  isSyntheticOption
} from 'in-applications/Dashboards/commonComponents/includeSyntheticCalls';
import { getTagCatalog } from 'in-applications/analyze/components/workspace/CallQueryBuilder';
import getEndpointInfo from 'in-subscription/application/getEndpointInfo';
import getServiceLabel from 'in-subscription/application/getServiceLabel';
import getApplication from 'in-subscription/application/getApplication';
import { syntheticCallsEnabled } from 'in-services/featureFlags';
import useTagCatalog from 'in-applications/hooks/useTagCatalog';
import { getLinkToAnalyze } from 'in-analyze/navigation/paths';
import Button from 'in-new-components/Button';
import connect from 'in-hoc/connectTo';
import { t } from 'in-i18n';

export default connect(({ applicationId, serviceId, endpointId }) => {
  const observables = {};
  if (applicationId) {
    observables.applicationLabel = getApplication({ id: applicationId }).map(getLabel);
    observables.applicationBoundaryScope = getApplication({ id: applicationId }).map(getBoundaryScope);
  }
  if (serviceId) {
    observables.serviceLabel = getServiceLabel({ id: serviceId }).map(getLabel);
  }
  if (endpointId) {
    observables.endpointLabel = getEndpointInfo({ id: endpointId }).map(getLabel);
  }
  return observables;
})(AnalyzeCallsButton);

function AnalyzeCallsButton({
  applicationLabel,
  applicationBoundaryScope,
  serviceLabel,
  endpointLabel,
  boundaryScope,
  syntheticType,
  syntheticCalls,
  filters = [],
  groupByTag
}) {
  const tagCatalog = useTagCatalog(getTagCatalog);
  return (
    <Button
      kind="primary"
      icon="lib_application_call"
      href$={
        tagCatalog &&
        getLinkToAnalyze({
          applicationName: applicationLabel,
          serviceName: serviceLabel,
          endpointName: endpointLabel,
          boundaryScope: boundaryScope || applicationBoundaryScope,
          dataSource: 'calls',
          filters: getSyntheticCallFilters(syntheticType, syntheticCalls),
          ...filters,
          tagCatalog: tagCatalog,
          groupByTag: groupByTag ? groupByTag : {}
        })
      }
    >
      {t('in-applications:buttonAnalyzeCalls')}
    </Button>
  );
}

function getLabel(result) {
  return get(result, ['data', 'label'], null);
}

function getBoundaryScope(result) {
  return get(result, ['data', 'boundaryScope'], null);
}

function getSyntheticCallFilters(syntheticType, syntheticCalls) {
  if (syntheticCallsEnabled && isSyntheticOption(syntheticCalls)) {
    return getTagFiltersForSyntheticOption(syntheticCalls);
  }
  switch (syntheticType) {
    case 'SYNTHETIC':
      return [
        { name: 'call.is_synthetic', value: 'true' },
        { name: 'include_synthetic', value: 'true' }
      ];
    case 'MIXED':
      return [
        { name: 'call.is_synthetic', value: 'false' },
        { name: 'include_synthetic', value: 'true' }
      ];
    default:
      return [];
  }
}
