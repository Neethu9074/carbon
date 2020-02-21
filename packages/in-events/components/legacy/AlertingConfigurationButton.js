import React from 'react';

import { websitesAlertingEventDetailsViewEditConfig } from 'in-websites/eum-alerting/tracker';
import { alertTab, alertTabFullyQualified, websitePath } from 'in-websites/navigation/paths';
import { alertCreated as alertCreatedMatrixParam } from 'in-websites/navigation/matrix';
import { websiteId as websiteIdMatrixParam } from 'in-websites/navigation/matrix';
import { alertId as alertIdMatrixParam } from 'in-websites/navigation/matrix';
import { setOrDeleteMatrixKey } from 'in-stores/navigation/matrix';
import { mutateUrl } from 'in-stores/navigation/navigation';
import Button from 'in-new-components/Button';

import locals from './AlertingConfigurationButton.mless';

export default function AlertingConfigurationButton({ alertConfig }) {
  return (
    <Button
      className={locals.button}
      kind="secondary"
      onClick={() => {
        websitesAlertingEventDetailsViewEditConfig(alertConfig.id);
        mutateUrl(location => {
          location.pathname = alertTabFullyQualified;
          setOrDeleteMatrixKey(location, websitePath, websiteIdMatrixParam, alertConfig.websiteId);
          setOrDeleteMatrixKey(location, alertTab, alertIdMatrixParam, alertConfig.id);
          setOrDeleteMatrixKey(location, alertTab, alertCreatedMatrixParam, alertConfig.created);
        });
      }}
    >
      View/Edit Alerting Configuration
    </Button>
  );
}
