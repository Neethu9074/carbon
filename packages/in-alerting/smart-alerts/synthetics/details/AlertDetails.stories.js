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
  restoreAlertConfigVersion
} from 'in-alerting/smart-alerts/synthetics/api/syntheticAlertConfig';
import { Default as alertconfigValue } from 'in-alerting/smart-alerts/synthetics/details/AlertConfiguration.stories';
import { alertCreated as alertCreatedParam, alertId as alertIdParam } from 'in-synthetics/navigation/matrix';
import AlertConfiguration from 'in-alerting/smart-alerts/synthetics/details/AlertConfiguration';
import Alert from 'in-alerting/smart-alerts/components/details/Alert';
import { successObservable } from 'in-services/util/result';

const timeConfig = {
  windowSize: 12345678
};
const isMainPage = true;

const alertConfig = alertconfigValue.args.alertConfig;

export default { component: Alert };

export const Default = () => {
  return (
    <Alert
      timeConfig={timeConfig}
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
      getConfig={() => successObservable(alertConfig)}
      getConfigVersions={() => successObservable([alertConfig])}
      enableConfig={enableAlertConfig}
      disableConfig={disableAlertConfig}
      deleteConfig={deleteAlertConfig}
      restoreConfig={restoreAlertConfigVersion}
      renderSmartAlertDialog={() => undefined}
      renderAlertConfiguration={({ alertConfig }) => <AlertConfiguration alertConfig={alertConfig} />}
    />
  );
};
