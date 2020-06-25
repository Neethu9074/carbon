import { just } from 'reactive-observables';
import React, { useState } from 'react';

import CreateApplicationDialog from 'in-applications/creation/Dialog/CreateApplicationDialog';
import { createNewApplicationConfig, getApplicationConfig } from 'in-api/applicationConfigs';
import { applicationCreationOpenDialogClick } from 'in-applications/creation/tracker';
import { newApplicationWaiterView } from 'in-applications/navigation/paths';
import { getTimeConfig } from 'in-stores/time/config';
import useObservable from 'in-hooks/useObservable';
import Button from 'in-new-components/Button';

export default function CreateApplication({ applicationId, timeConfig, className }) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const entityResult = useObservable(
    applicationId
      ? getApplicationConfig(applicationId)
      : just({ progress: { loading: false }, errors: [], data: createNewApplicationConfig() }),
    [applicationId]
  );

  return (
    <>
      <Button
        kind="action"
        icon="lib_openclose_add_circle_outline"
        onClick={() => {
          setDialogOpen(true);
          applicationCreationOpenDialogClick({ status: 'Open Creation Dialog' });
        }}
        className={className}
      >
        Create New Application Perspective
      </Button>
      {dialogOpen && (
        <CreateApplicationDialog
          timeConfig={timeConfig || getTimeConfig({ pathname: '/applications', query: {} })}
          formData={entityResult.data}
          onClose={() => setDialogOpen(false)}
          getOnSavePath={app => getNewApplicationWaiterViewPath(app)}
          editMode
        />
      )}
    </>
  );
}

export function getNewApplicationWaiterViewPath(app) {
  return `${newApplicationWaiterView}/${encodeURIComponent(app.id)}/${encodeURIComponent(app.label)}`;
}
