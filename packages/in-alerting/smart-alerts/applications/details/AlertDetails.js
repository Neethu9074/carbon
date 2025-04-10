/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

import React from 'react';

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
import { placeholdersByEvaluationTypeAndSeverity } from 'in-alerting/smart-alerts/applications/inventory/getAlertTitleWithPlaceholderHighlighting';
import { useSmartAlertCreateUrl as useSmartAlertTearSheetUrl } from 'in-alerting/smart-alerts/applications/hooks/useSmartAlertCreateUrl';
import {
  applicationSmartAlertDialogView,
  applicationSmartAlertFullScreenDesignEnabled
} from 'in-services/featureFlags';
import { duplicateAlertConfig } from 'in-alerting/smart-alerts/components/dialog/sharedFunctions';
import AlertConfiguration from 'in-alerting/smart-alerts/applications/details/AlertConfiguration';
import AlertConfigDialog from 'in-alerting/smart-alerts/applications/dialog/AlertConfigDialog';
import { getSmartAlertDisplayMode } from 'in-alerting/smart-alerts/utils/smartAlertViewUtils';
import { categoryGlobal } from 'in-alerting/smart-alerts/components/list/constants';
import Alert from 'in-alerting/smart-alerts/components/details/Alert';
import { getMatrixParameter } from 'in-stores/navigation/matrix';
import { role } from 'in-stores/user';

const endpointConfig = { asObservable: true };

const alertDisplayMode = getSmartAlertDisplayMode(
  applicationSmartAlertDialogView,
  applicationSmartAlertFullScreenDesignEnabled
);

export default function AlertDetails(props) {
  const { location } = props;
  const isGlobalAlertConfig =
    getMatrixParameter(location, alertsTabSegment, alertsCategoryMatrixParam) === categoryGlobal;
  return isGlobalAlertConfig ? <GlobalAlertDetails {...props} /> : <IndividualAlertDetails {...props} />;
}

function GlobalAlertDetails(props) {
  const urlParams = {
    isGlobal: true
  };
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
      getAllowedPlaceholders={({ evaluationType }) => placeholdersByEvaluationTypeAndSeverity(evaluationType)}
      canConfigureGlobalAlertConfigs={role.canConfigureGlobalApplicationSmartAlerts}
      canConfigureIndividualAlertConfigs={role.canConfigureApplicationSmartAlerts}
      isGlobalSmartAlert
      getLinkToEditOrDuplicateSmartAlertTearSheet={useSmartAlertTearSheetUrl()}
      alertDisplayMode={alertDisplayMode}
      urlParams={urlParams}
    />
  );
}

function IndividualAlertDetails(props) {
  const urlParams = {
    isGlobal: false
  };
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
        created ? getAlertConfigByIdAndTimestamp(id, created, endpointConfig) : getLatestAlertConfig(id, endpointConfig)
      }
      getConfigVersions={id => getAllVersionsOfAlertConfig(id, endpointConfig)}
      enableConfig={enableAlertConfig}
      disableConfig={disableAlertConfig}
      deleteConfig={deleteAlertConfig}
      restoreConfig={restoreAlertConfigVersion}
      renderSmartAlertDialog={renderSmartAlertDialog}
      renderAlertConfiguration={renderAlertConfiguration}
      canConfigureGlobalAlertConfigs={role.canConfigureGlobalApplicationSmartAlerts}
      canConfigureIndividualAlertConfigs={role.canConfigureApplicationSmartAlerts}
      getLinkToEditOrDuplicateSmartAlertTearSheet={useSmartAlertTearSheetUrl()}
      alertDisplayMode={alertDisplayMode}
      urlParams={urlParams}
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
