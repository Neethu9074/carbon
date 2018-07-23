import React from 'react';

import CreateApplicationDialog from 'in-applications/Forms/NewApplication/CreateApplicationDialog';
import RemoveSection from 'in-applications/Forms/NewApplication/Remove';

export default function Configuration({ data: application }) {
  return (
    <div>
      <CreateApplicationDialog applicationId={application.id} />
      <RemoveSection application={application} />
    </div>
  );
}
