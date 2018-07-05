import React from 'react';

import CreateApplicationDialog from 'in-applications/Forms/NewApplication/CreateApplicationDialog';
import { applicationsList, newApplicationWaiterView } from 'in-applications/navigation/paths';
import { getModifiedUrlStream } from 'in-stores/navigation';

export default function NewApplication() {
  return (
    <CreateApplicationDialog
      onCancelHref$={getModifiedUrlStream(p => (p.pathname = applicationsList))}
      getOnSavePath={app => getNewApplicationWaiterViewPath(app)}
    />
  );
}

export function getNewApplicationWaiterViewPath(app) {
  return `${newApplicationWaiterView}/${encodeURIComponent(app.id)}`;
}
