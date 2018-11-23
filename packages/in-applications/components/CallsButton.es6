import { get } from 'lodash';
import React from 'react';

import getServiceLabel from 'in-subscription/application/getServiceLabel';
import getApplication from 'in-subscription/application/getApplication';
import { getLinkToAnalyze } from 'in-analyze/navigation/paths';
import Button from 'in-new-components/Button';
import connect from 'in-hoc/connectTo';

export default connect(({ applicationId, serviceId }) => {
  const observables = {};
  if (applicationId) {
    observables.applicationLabel = getApplication({ id: applicationId }).map(getLabel);
  }
  if (serviceId) {
    observables.serviceLabel = getServiceLabel({ id: serviceId }).map(getLabel);
  }
  return observables;
})(function CallsButton({ applicationLabel, serviceLabel, endpointId, isSynthetic }) {
  return (
    <Button
      kind="primary"
      icon="lib_application_trace"
      href$={getLinkToAnalyze({
        applicationName: applicationLabel,
        serviceName: serviceLabel,
        endpointName: endpointId,
        filters: isSynthetic ? [{ name: 'call.is_synthetic', value: 'true' }] : null
      })}
    >
      Analyze {isSynthetic ? 'Synthetic' : ''} Traces
    </Button>
  );
});

function getLabel(result) {
  return get(result, ['data', 'label'], null);
}
