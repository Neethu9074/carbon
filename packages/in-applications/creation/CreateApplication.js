/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import CreateApplicationDialog from 'in-applications/creation/Dialog/CreateApplicationDialog';
import { createNewApplicationConfig, getApplicationConfig } from 'in-api/applicationConfigs';
import { applicationCreationOpenDialogClick } from 'in-applications/creation/tracker';
import { addActiveDialog, close } from 'in-components/DialogPresenter/store';
import { newApplicationWaiterView } from 'in-applications/navigation/paths';
import { successObservable } from 'in-services/util/result';
import { getTimeConfig } from 'in-stores/time/config';
import useObservable from 'in-hooks/useObservable';
import Button from 'in-new-components/Button';
import { t } from 'in-i18n';

export default function CreateApplication({
  applicationId,
  timeConfig,
  className,
  kind = 'action',
  icon = 'lib_openclose_add_circle_outline'
}) {
  const entityResult = useObservable(getConfig, [applicationId]);

  return (
    <Button
      kind={kind}
      icon={icon}
      onClick={() => {
        applicationCreationOpenDialogClick({ status: 'Open Creation Dialog' });
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
  return applicationId ? getApplicationConfig(applicationId) : successObservable(createNewApplicationConfig());
}
