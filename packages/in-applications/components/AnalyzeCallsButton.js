import { get } from 'lodash';
import React from 'react';

import getEndpointInfo from 'in-subscription/application/getEndpointInfo';
import getServiceLabel from 'in-subscription/application/getServiceLabel';
import getApplication from 'in-subscription/application/getApplication';
import { getLinkToAnalyze } from 'in-analyze/navigation/paths';
import Button from 'in-new-components/Button';
import connect from 'in-hoc/connectTo';

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
})(function AnalyzeCallsButton({
  applicationLabel,
  applicationBoundaryScope,
  serviceLabel,
  endpointLabel,
  boundaryScope,
  isSynthetic,
  filters = [],
  groupByTag
}) {
  return (
    <Button
      kind="primary"
      icon="lib_application_trace"
      href$={getLinkToAnalyze({
        applicationName: applicationLabel,
        serviceName: serviceLabel,
        endpointName: endpointLabel,
        boundaryScope: boundaryScope || applicationBoundaryScope,
        dataSource: 'calls',
        filters: isSynthetic
          ? [{ name: 'call.is_synthetic', value: 'true' }, { name: 'include_synthetic', value: 'true' }, ...filters]
          : filters,
        groupByTag: groupByTag ? groupByTag : {}
      })}
    >
      Analyze Calls
    </Button>
  );
});

function getLabel(result) {
  return get(result, ['data', 'label'], null);
}

function getBoundaryScope(result) {
  return get(result, ['data', 'boundaryScope'], null);
}
