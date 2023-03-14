/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React from 'react';

import {
  deleteAlertConfig,
  disableAlertConfig,
  enableAlertConfig,
  restoreAlertConfigVersion
} from 'in-alerting/smart-alerts/synthetics/api/syntheticAlertConfig';
import {
  alertsTab as alertsTabSegment,
  alertsTabDetailsFullyQualified as detailsPath,
  alertsTabListFullyQualified as listPath
} from 'in-websites/navigation/paths';
import { alertCreated as alertCreatedParam, alertId as alertIdParam } from 'in-websites/navigation/matrix';
import AlertConfiguration from 'in-alerting/smart-alerts/synthetics/details/AlertConfiguration';
import { generateAlertConfig } from 'in-alerting/smart-alerts/synthetics/CreateSmartAlert';
import AlertDetails from 'in-alerting/smart-alerts/synthetics/details/AlertDetails';
import { successObservable } from 'in-services/util/result';

const tracking = {};
const timeConfig = {
  windowSize: 12345678
};

export default { component: AlertDetails };

export const AlertDetailsView = () => {
  return (
    <AlertDetails
      timeConfig={timeConfig}
      paths={{
        detailsPath,
        listPath,
        alertsTabSegment
      }}
      matrix={{ alertIdParam, alertCreatedParam }}
      getConfig={() => successObservable(generateAlertConfig())}
      getConfigVersions={() => successObservable([generateAlertConfig()])}
      enableConfig={enableAlertConfig}
      disableConfig={disableAlertConfig}
      deleteConfig={deleteAlertConfig}
      restoreConfig={restoreAlertConfigVersion}
      renderSmartAlertDialog={() => undefined}
      renderAlertConfiguration={({ alertConfig }) => <AlertConfiguration alertConfig={alertConfig} />}
      tracking={tracking}
    />
  );
};
