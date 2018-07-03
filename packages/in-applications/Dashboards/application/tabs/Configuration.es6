import React from 'react';

import CreateApplicationDialog from 'in-applications/Forms/NewApplication/CreateApplicationDialog';
import RemoveSection from 'in-applications/Forms/NewApplication/Remove';
import { getApplicationConfig } from 'in-api/applicationConfigs';

export default function Configuration({ applicationId }) {
  return (
    <div>
      <CreateApplicationDialog applicationId={applicationId} />
      {applicationId && <RemoveSection application={getApplicationConfig(applicationId)} />}
    </div>
  );
}
