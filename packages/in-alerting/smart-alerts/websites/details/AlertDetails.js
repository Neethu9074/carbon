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
import { alertCreated as alertCreatedParam, alertId as alertIdParam } from 'in-websites/navigation/matrix';
import { duplicateAlertConfig } from 'in-alerting/smart-alerts/components/dialog/sharedFunctions';
import AlertConfiguration from 'in-alerting/smart-alerts/websites/details/AlertConfiguration';
import AlertConfigDialog from 'in-alerting/smart-alerts/websites/dialog/AlertConfigDialog';
import { useNavigation } from 'in-stores/navigation/hooks/useNavigation';
import Alert from 'in-alerting/smart-alerts/components/details/Alert';
import { setOrDeleteMatrixKey } from 'in-stores/navigation/matrix';

const endpointConfig = { asObservable: true };

const tracking = {
  trackEdit: alertConfigId => websitesAlertingAlertEdit({ alertConfigId }),
  trackPaused: alertConfigId => websitesAlertingAlertPaused({ alertConfigId }),
  trackResumed: alertConfigId => websitesAlertingAlertResumed({ alertConfigId }),
  trackDeleted: alertConfigId => websitesAlertingAlertDeleted({ alertConfigId }),
  trackRevisionChanged: revision => websitesAlertingAlertRevisionChanged({ revision })
};

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
      tracking={tracking}
    />
  );
}

function SmartAlertDialogWrapper({ close, alertConfig, setRevision, isCopy, detailsPath, alertConfigId }) {
  const { location, navigate } = useNavigation();

  return (
    <AlertConfigDialog
      alertConfig={isCopy ? duplicateAlertConfig(alertConfig) : alertConfig}
      onClose={({ id } = {}) => {
        close();
        setRevision(null);
        if (isCopy) {
          const onCloseTargetLocation = { ...location, pathname: detailsPath };
          setOrDeleteMatrixKey(onCloseTargetLocation, alertsTabSegment, 'alertId', id ?? alertConfigId);
          navigate(onCloseTargetLocation);
        }
      }}
      editMode={!isCopy}
    />
  );
}
