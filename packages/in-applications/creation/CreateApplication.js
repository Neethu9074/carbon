/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React, { useEffect } from 'react';

import { useObservable } from '@instana/hooks';
import { Button } from '@instana/components';

import { createNewApplicationConfig, getApplicationConfigWithAlerting } from 'in-api/applicationConfigs';
import CreateApplicationDialog from 'in-applications/creation/Dialog/CreateApplicationDialog';
import { useApplicationTracker } from 'in-applications/hooks/useApplicationTracker';
import { addActiveDialog, close } from 'in-components/DialogPresenter/store';
import { newApplicationWaiterView } from 'in-applications/navigation/paths';
import { successObservable } from 'in-services/util/result';
import { getTimeConfig } from 'in-stores/time/config';
import { t } from 'in-i18n';

export default function CreateApplication({
  applicationId,
  timeConfig,
  className,
  kind = 'action',
  icon = 'lib_openclose_add_circle_outline',
  location
}) {
  const entityResult = useObservable(getConfig, [applicationId]);
  const { trackApplicationCreationOpenDialogClicked } = useApplicationTracker();
  useEffect(() => {
    if (location.pathname === '/applications/new' && entityResult) {
      trackApplicationCreationOpenDialogClicked({ message: 'Open Creation Dialog' });
      addActiveDialog(
        <CreateApplicationDialog
          timeConfig={timeConfig || getTimeConfig({ pathname: '/applications', query: {} })}
          formData={entityResult.data}
          onClose={close}
          getOnSavePath={app => getNewApplicationWaiterViewPath(app)}
          editMode
        />
      );
    }
  });

  return (
    <Button
      kind={kind}
      icon={icon}
      onClick={() => {
        trackApplicationCreationOpenDialogClicked({ message: 'Open Creation Dialog' });
        addActiveDialog(
          <CreateApplicationDialog
            timeConfig={timeConfig || getTimeConfig({ pathname: '/applications', query: {} })}
            formData={entityResult.data}
            onClose={close}
            getOnSavePath={app => getNewApplicationWaiterViewPath(app)}
            editMode
          />
        );
      }}
      className={className}
    >
      {t('in-applications:creation.newAP')}
    </Button>
  );
}

export function getNewApplicationWaiterViewPath(app) {
  return `${newApplicationWaiterView}/${encodeURIComponent(app.id)}/${encodeURIComponent(app.label)}`;
}

function getConfig([applicationId]) {
  return applicationId
    ? getApplicationConfigWithAlerting(applicationId)
    : successObservable(createNewApplicationConfig());
}
