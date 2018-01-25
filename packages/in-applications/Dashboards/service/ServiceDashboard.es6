import React from 'react';

import { applicationId, serviceId, endpointId } from 'in-applications/navigation/matrix';
import { serviceDashboard } from 'in-applications/navigation/paths';
import { getMatrixParameter } from 'in-stores/navigation/matrix';

export default function ServiceDashboard({ location }) {
  return (
    <div>
      Hello from ServiceDashboard!
      <dl>
        <dt>Application ID:</dt>
        <dd>{getMatrixParameter(location, serviceDashboard, applicationId)}</dd>

        <dt>Service ID:</dt>
        <dd>{getMatrixParameter(location, serviceDashboard, serviceId)}</dd>

        <dt>Endpoint ID:</dt>
        <dd>{getMatrixParameter(location, serviceDashboard, endpointId)}</dd>
      </dl>
    </div>
  );
}
