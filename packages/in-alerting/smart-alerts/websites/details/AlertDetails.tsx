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
} from 'in-alerting/smart-alerts/websites/api/websiteAlertConfig';
import {
  alertsTab as alertsTabSegment,
  alertsTabDetailsFullyQualified as detailsPath,
  alertsTabListFullyQualified as listPath
} from 'in-websites/navigation/paths';
import { alertCreated as alertCreatedParam, alertId as alertIdParam } from 'in-websites/navigation/matrix';
import { duplicateAlertConfig } from 'in-alerting/smart-alerts/components/dialog/sharedFunctions';
import AlertConfiguration from 'in-alerting/smart-alerts/websites/details/AlertConfiguration';
import AlertConfigDialog from 'in-alerting/smart-alerts/websites/dialog/AlertConfigDialog';
import Alert from 'in-alerting/smart-alerts/components/details/Alert';

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
      renderSmartAlertDialog={props => <SmartAlertDialogWrapper {...props} />}
      renderAlertConfiguration={({ alertConfig }) => <AlertConfiguration alertConfig={alertConfig} />}
    />
  );
}

function SmartAlertDialogWrapper({ close, alertConfig, setRevision, isCopy }) {
  return (
    <AlertConfigDialog
      alertConfig={isCopy ? duplicateAlertConfig(alertConfig) : alertConfig}
      onClose={() => {
        close();
        setRevision(null);
      }}
      editMode={!isCopy}
    />
  );
}
