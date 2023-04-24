/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React from 'react';

import {
  syntheticSmartAlertsPath as alertsTabSegment,
  alertsTabDetailsFullyQualified as detailsPath,
  syntheticSmartAlertsPath as listPath,
  dashboardTestAlertsTabDetailsFullyQualified as dashboardTestAlertDetailsPath,
  dashboardAlertsFullyQualified as dashboardAlertPath,
  alertsTab as dashboardTestAlertTabSegment
} from 'in-synthetics/navigation/paths';
import {
  deleteAlertConfig,
  disableAlertConfig,
  enableAlertConfig,
  getAlertConfigByIdAndTimestamp,
  getLatestAlertConfig,
  restoreAlertConfigVersion,
  getAllVersionsOfAlertConfig
} from 'in-alerting/smart-alerts/synthetics/api/syntheticAlertConfig';
import { alertCreated as alertCreatedParam, alertId as alertIdParam } from 'in-synthetics/navigation/matrix';
import { duplicateAlertConfig } from 'in-alerting/smart-alerts/components/dialog/sharedFunctions';
import AlertConfiguration from 'in-alerting/smart-alerts/synthetics/details/AlertConfiguration';
import AlertConfigDialog from 'in-alerting/smart-alerts/synthetics/dialog/AlertConfigDialog';
import { useNavigation } from 'in-stores/navigation/hooks/useNavigation';
import Alert from 'in-alerting/smart-alerts/components/details/Alert';
import { setOrDeleteMatrixKey } from 'in-stores/navigation/matrix';

const endpointConfig = { asObservable: true };

export default function AlertDetails(props) {
  const { isMainPage, testId } = props;
  return (
    <Alert
      {...props}
      paths={
        isMainPage
          ? {
              detailsPath: detailsPath,
              listPath: listPath,
              alertsTabSegment: alertsTabSegment
            }
          : {
              detailsPath: dashboardTestAlertDetailsPath,
              listPath: dashboardAlertPath,
              alertsTabSegment: dashboardTestAlertTabSegment
            }
      }
      matrix={{ alertIdParam, alertCreatedParam }}
      getConfig={(id, created) =>
        created ? getAlertConfigByIdAndTimestamp(id, created, endpointConfig) : getLatestAlertConfig(id, endpointConfig)
      }
      getConfigVersions={id => getAllVersionsOfAlertConfig(id, endpointConfig)}
      enableConfig={enableAlertConfig}
      disableConfig={disableAlertConfig}
      deleteConfig={deleteAlertConfig}
      restoreConfig={restoreAlertConfigVersion}
      renderSmartAlertDialog={props => <SmartAlertDialogWrapper {...props} isMainPage={isMainPage} testId={testId} />}
      renderAlertConfiguration={({ alertConfig }) => <AlertConfiguration alertConfig={alertConfig} />}
    />
  );
}

function SmartAlertDialogWrapper({
  close,
  alertConfig,
  setRevision,
  isCopy,
  detailsPath,
  alertConfigId,
  testId,
  isMainPage
}) {
  const { location, navigate } = useNavigation();
  const alertTabPath = isMainPage ? alertsTabSegment : dashboardTestAlertTabSegment;
  return (
    <AlertConfigDialog
      alertConfig={isCopy ? duplicateAlertConfig(alertConfig) : alertConfig}
      onClose={({ id, created } = {}) => {
        close();
        setRevision(null);
        if (isCopy) {
          const onCloseTargetLocation = { ...location, pathname: detailsPath };
          setOrDeleteMatrixKey(onCloseTargetLocation, alertTabPath, alertIdParam, id ?? alertConfigId);
          if (created) {
            setOrDeleteMatrixKey(onCloseTargetLocation, alertTabPath, alertCreatedParam, created);
          }

          navigate(onCloseTargetLocation);
        }
      }}
      editMode={!isCopy}
      testId={testId}
    />
  );
}
