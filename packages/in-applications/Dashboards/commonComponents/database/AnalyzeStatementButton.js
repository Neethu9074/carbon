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
  }
  if (serviceId) {
    observables.serviceLabel = getServiceLabel({ id: serviceId }).map(getLabel);
  }
  if (endpointId) {
    observables.endpointLabel = getEndpointInfo({ id: endpointId }).map(getLabel);
  }
  return observables;
})(function AnalyzeStatementButton({ applicationLabel, serviceLabel, endpointLabel, statement }) {
  return (
    <Button
      kind="secondary"
      href$={getLinkToAnalyze({
        applicationName: applicationLabel,
        serviceName: serviceLabel,
        endpointName: endpointLabel,
        dataSource: 'calls',
        filters: [{ name: 'call.database.statement', operator: 'equals', value: statement.statement }],
        groupByTag: {}
      })}
    >
      Analyze Statement
    </Button>
  );
});

function getLabel(result) {
  return get(result, ['data', 'label'], null);
}
