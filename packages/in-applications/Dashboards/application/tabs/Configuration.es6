import React from 'react';

import CreateApplicationDialog from 'in-applications/Forms/NewApplication/CreateApplicationDialog';

export default function Configuration({ applicationId }) {
  return <CreateApplicationDialog applicationId={applicationId} />;
}
