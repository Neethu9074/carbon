/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

import React from 'react';

import {
  deleteAlertConfig,
  disableAlertConfig,
  enableAlertConfig,
  getAlertConfigByIdAndTimestamp,
  getAllVersionsOfAlertConfig,
  getLatestAlertConfig,
  restoreAlertConfigVersion
} from 'in-websites/api/websiteAlertConfig';
import {
  websitesAlertingAlertDeleted,
  websitesAlertingAlertEdit,
  websitesAlertingAlertPaused,
  websitesAlertingAlertResumed,
  websitesAlertingAlertRevisionChanged
} from 'in-alerting/smart-alerts/websites/tracker';
import {
  alertsTab as alertsTabSegment,
  alertsTabDetailsFullyQualified as detailsPath,
  alertsTabListFullyQualified as listPath
} from 'in-websites/navigation/paths';
import { duplicateAlertConfig } from 'in-alerting/smart-alerts/components/smart-alert-dialog/sharedFunctions';
import { alertCreated as alertCreatedParam, alertId as alertIdParam } from 'in-websites/navigation/matrix';
import AlertConfiguration from 'in-alerting/smart-alerts/websites/details/AlertConfiguration';
import AlertConfigDialog from 'in-alerting/smart-alerts/websites/AlertConfigDialog';
import Alert from 'in-alerting/smart-alerts/components/details/Alert';
import { setOrDeleteMatrixKey } from 'in-stores/navigation/matrix';
import { mutateUrl } from 'in-stores/navigation/navigation';

const endpointConfig = { asObservable: true };

export default function AlertDetails(props) {
  return (
    <Alert
      {...props}
      paths={{
        detailsPath,
        listPath,
        alertsTabSegment
      }}
      matrix={{ alertIdParam, alertCreatedParam }}
      getConfig={(id, created) =>
        created ? getAlertConfigByIdAndTimestamp(id, created, endpointConfig) : getLatestAlertConfig(id, endpointConfig)
      }
      getConfigVersions={id => getAllVersionsOfAlertConfig(id, endpointConfig)}
      enableConfig={enableAlertConfig}
      disableConfig={disableAlertConfig}
      deleteConfig={deleteAlertConfig}
      restoreConfig={restoreAlertConfigVersion}
      renderSmartAlertDialog={renderSmartAlertDialog}
      renderAlertConfiguration={({ alertConfig }) => <AlertConfiguration alertConfig={alertConfig} />}
      tracking={{
        trackEdit: alertConfigId => websitesAlertingAlertEdit({ alertConfigId }),
        trackPaused: alertConfigId => websitesAlertingAlertPaused({ alertConfigId }),
        trackResumed: alertConfigId => websitesAlertingAlertResumed({ alertConfigId }),
        trackDeleted: alertConfigId => websitesAlertingAlertDeleted({ alertConfigId }),
        trackRevisionChanged: revision => websitesAlertingAlertRevisionChanged({ revision })
      }}
    />
  );
}

function renderSmartAlertDialog({ close, alertConfig, setRevision, isCopy, detailsPath, alertConfigId }) {
  return (
    <AlertConfigDialog
      onClose={({ id } = {}) => {
        close();
        setRevision(null);
        if (isCopy) {
          mutateUrl(location => {
            location.pathname = detailsPath;
            setOrDeleteMatrixKey(location, alertsTabSegment, 'alertId', id ?? alertConfigId);
          });
        }
      }}
      alertConfig={isCopy ? duplicateAlertConfig(alertConfig) : alertConfig}
      editMode={!isCopy}
    />
  );
}
