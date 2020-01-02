import React from 'react';

import CreateApplicationDialog from 'in-applications/Forms/NewApplication/CreateApplicationDialog';
import RemoveSection from 'in-applications/Forms/NewApplication/Remove';

export default function Configuration({ timeConfig, data: application, applicationId }) {
  return (
    <div>
      <CreateApplicationDialog applicationId={applicationId} timeConfig={timeConfig} />
      <RemoveSection application={application} />
    </div>
  );
}
