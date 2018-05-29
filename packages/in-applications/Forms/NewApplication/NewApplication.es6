import React from 'react';

import CreateApplicationDialog from 'in-applications/Forms/NewApplication/CreateApplicationDialog';
import { applicationsList } from 'in-applications/navigation/paths';
import { getModifiedUrlStream } from 'in-stores/navigation';

export default function NewApplication() {
  return <CreateApplicationDialog onCancelHref$={getModifiedUrlStream(p => (p.pathname = applicationsList))} />;
}
