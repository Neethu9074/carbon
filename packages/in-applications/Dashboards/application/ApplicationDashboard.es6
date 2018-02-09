import React from 'react';

import { applicationId, serviceId, endpointId } from 'in-applications/navigation/matrix';
import { applicationDashboard } from 'in-applications/navigation/paths';
import { getMatrixParameter } from 'in-stores/navigation/matrix';

export default function ApplicationDashboard({ location }) {
  return (
    <div>
      <p>Hello from ApplicationDashboard!</p>

      <dl>
        <dt>Application ID:</dt>
        <dd>{getMatrixParameter(location, applicationDashboard, applicationId)}</dd>

        <dt>Service ID:</dt>
        <dd>{getMatrixParameter(location, applicationDashboard, serviceId)}</dd>

        <dt>Endpoint ID:</dt>
        <dd>{getMatrixParameter(location, applicationDashboard, endpointId)}</dd>
      </dl>
    </div>
  );
}
