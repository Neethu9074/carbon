/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import React from 'react';

import CreateApplicationDialog from 'in-applications/Forms/NewApplication/CreateApplicationDialog';
import { applicationsList, newApplicationWaiterView } from 'in-applications/navigation/paths';
import { getModifiedUrlStream } from 'in-stores/navigation';
import { getTimeConfig } from 'in-stores/time/config';

export default function NewApplication({ timeconfig, location }) {
  return (
    <CreateApplicationDialog
      timeConfig={timeconfig || getTimeConfig(location)}
      onCancelHref$={getModifiedUrlStream(p => (p.pathname = applicationsList))}
      getOnSavePath={app => getNewApplicationWaiterViewPath(app)}
    />
  );
}

export function getNewApplicationWaiterViewPath(app) {
  return `${newApplicationWaiterView}/${encodeURIComponent(app.id)}/${encodeURIComponent(app.label)}`;
}
