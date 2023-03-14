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
  dasboardAlertsFullyQualified as dashboardAlertPath,
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
import AlertConfiguration from 'in-alerting/smart-alerts/synthetics/details/AlertConfiguration';
import Alert from 'in-alerting/smart-alerts/components/details/Alert';

const endpointConfig = { asObservable: true };
const tracking = {};

export default function AlertDetails(props) {
  const { isMainPage } = props;

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
      renderSmartAlertDialog={() => undefined}
      renderAlertConfiguration={({ alertConfig }) => <AlertConfiguration alertConfig={alertConfig} />}
      tracking={tracking}
      showActionButton={false}
    />
  );
}
