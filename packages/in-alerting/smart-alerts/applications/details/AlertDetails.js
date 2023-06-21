/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

import React from 'react';

import { combineLatest } from '@instana/observables';

import {
  deleteGlobalAlertConfig,
  disableGlobalAlertConfig,
  enableGlobalAlertConfig,
  getAllVersionsOfGlobalAlertConfig,
  getGlobalAlertConfigByIdAndTimestamp,
  getLatestGlobalAlertConfig,
  restoreGlobalAlertConfigVersion
} from 'in-alerting/smart-alerts/applications/api/globalApplicationAlertConfigs';
import {
  alertsList as globalInventoryListPath,
  alertsTab as alertsTabSegment,
  alertsTabDetailsFullyQualified as perApInventoryDetailsPath,
  alertsTabListFullyQualified as perApInventoryListPath,
  globalAlertDetails as globalInventoryDetailsPath
} from 'in-applications/navigation/paths';
import {
  deleteAlertConfig,
  disableAlertConfig,
  enableAlertConfig,
  getAlertConfigByIdAndTimestamp,
  getAllVersionsOfAlertConfig,
  getLatestAlertConfig,
  restoreAlertConfigVersion
} from 'in-alerting/smart-alerts/applications/api/applicationAlertConfig';
import {
  alertCreated as alertCreatedParam,
  alertId as alertIdParam,
  alertsCategory as alertsCategoryMatrixParam
} from 'in-applications/navigation/matrix';
import { duplicateAlertConfig } from 'in-alerting/smart-alerts/components/dialog/sharedFunctions';
import AlertConfiguration from 'in-alerting/smart-alerts/applications/details/AlertConfiguration';
import AlertConfigDialog from 'in-alerting/smart-alerts/applications/dialog/AlertConfigDialog';
import { categoryGlobal } from 'in-alerting/smart-alerts/components/list/constants';
import { getApplicationAlertActionAssociations } from 'in-automation/api';
import Alert from 'in-alerting/smart-alerts/components/details/Alert';
import { propTypeLocation } from 'in-stores/navigation/navigation';
import { actionAutomationEnabled } from 'in-services/featureFlags';
import { getMatrixParameter } from 'in-stores/navigation/matrix';
import { role } from 'in-stores/user';

const endpointConfig = { asObservable: true };

export default function AlertDetails(props) {
  const { location } = props;
  const isGlobalAlertConfig =
    getMatrixParameter(location, alertsTabSegment, alertsCategoryMatrixParam) === categoryGlobal;
  return isGlobalAlertConfig ? <GlobalAlertDetails {...props} /> : <IndividualAlertDetails {...props} />;
}

function GlobalAlertDetails(props) {
  return (
    <Alert
      {...props}
      paths={{
        detailsPath: getAlertDetailsPathForLocation(props),
        listPath: getInventoryPathForLocation(props),
        alertsTabSegment
      }}
      matrix={{ alertIdParam, alertCreatedParam }}
      getConfig={(id, created) =>
        created
          ? getGlobalAlertConfigByIdAndTimestamp(id, created, endpointConfig)
          : getLatestGlobalAlertConfig(id, endpointConfig)
      }
      getConfigVersions={id => getAllVersionsOfGlobalAlertConfig(id, endpointConfig)}
      enableConfig={enableGlobalAlertConfig}
      disableConfig={disableGlobalAlertConfig}
      deleteConfig={deleteGlobalAlertConfig}
      restoreConfig={restoreGlobalAlertConfigVersion}
      renderSmartAlertDialog={renderSmartAlertDialog}
      renderAlertConfiguration={renderAlertConfiguration}
      isGlobalSmartAlert
    />
  );
}
const hasAutomationActions = role.canConfigureAutomationActions && actionAutomationEnabled;
function mergeResultData(id, endpointConfig, created) {
  const alertDetails$ = created
    ? getAlertConfigByIdAndTimestamp(id, created, endpointConfig)
    : getLatestAlertConfig(id, endpointConfig);

  // calling Get Alert and Get action associations call and combining results
  if (hasAutomationActions) {
    const actionDetails$ = getApplicationAlertActionAssociations(id);
    return combineLatest([alertDetails$, actionDetails$]).map(([alertResponse, actionResponse]) => ({
      ...alertResponse,
      actionIds: actionResponse?.map(action => action.id) ?? []
    }));
  }

  return alertDetails$;
}

function IndividualAlertDetails(props) {
  return (
    <Alert
      {...props}
      paths={{
        detailsPath: getAlertDetailsPathForLocation(props),
        listPath: getInventoryPathForLocation(props),
        alertsTabSegment
      }}
      matrix={{ alertIdParam, alertCreatedParam }}
      getConfig={(id, created) => mergeResultData(id, endpointConfig, created)}
      getConfigVersions={id => getAllVersionsOfAlertConfig(id, endpointConfig)}
      enableConfig={enableAlertConfig}
      disableConfig={disableAlertConfig}
      deleteConfig={deleteAlertConfig}
      restoreConfig={restoreAlertConfigVersion}
      renderSmartAlertDialog={renderSmartAlertDialog}
      renderAlertConfiguration={renderAlertConfiguration}
    />
  );
}

function getAlertDetailsPathForLocation({ location }) {
  return location.pathname === perApInventoryDetailsPath ? perApInventoryDetailsPath : globalInventoryDetailsPath;
}

function getInventoryPathForLocation({ location }) {
  return location.pathname === perApInventoryDetailsPath ? perApInventoryListPath : globalInventoryListPath;
}

function renderSmartAlertDialog({ close, alertConfig, setRevision, isCopy, isGlobalSmartAlert }) {
  return (
    <AlertConfigDialog
      alertConfig={isCopy ? duplicateAlertConfig(alertConfig) : alertConfig}
      onClose={() => {
        close();
        setRevision(null);
      }}
      isGlobalSmartAlert={isGlobalSmartAlert}
      editMode={!isCopy}
    />
  );
}

function renderAlertConfiguration({ alertConfig, isGlobalSmartAlert }) {
  return <AlertConfiguration alertConfig={alertConfig} isGlobalSmartAlert={isGlobalSmartAlert} />;
}

AlertDetails.propTypes = {
  location: propTypeLocation
};
