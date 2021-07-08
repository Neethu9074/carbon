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
  updateGlobalAlertConfig
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
  updateAlertConfig
} from 'in-alerting/smart-alerts/applications/api/applicationAlertConfig';
import {
  applicationsAlertingAlertDeleted,
  applicationsAlertingAlertEdit,
  applicationsAlertingAlertPaused,
  applicationsAlertingAlertResumed,
  applicationsAlertingAlertRevisionChanged
} from 'in-alerting/smart-alerts/applications/tracker';
import SmartAlertConfigDialogWrapper from 'in-alerting/smart-alerts/applications/Dialog/SmartAlertConfigDialogWrapper';
import { alertCreated as alertCreatedParam, alertId as alertIdParam } from 'in-applications/navigation/matrix';
import AlertConfiguration from 'in-alerting/smart-alerts/applications/details/AlertConfiguration';
import { categoryGlobal } from 'in-alerting/smart-alerts/applications/components/list/constants';
import { alertsCategory as alertsCategoryMatrixParam } from 'in-applications/navigation/matrix';
import { getMatrixParameter, setOrDeleteMatrixKey } from 'in-stores/navigation/matrix';
import { mutateUrl, propTypeLocation } from 'in-stores/navigation/navigation';
import Alert from 'in-alerting/smart-alerts/components/details/Alert';

const endpointConfig = { asObservable: true };

const tracking = {
  trackEdit: alertConfigId => applicationsAlertingAlertEdit({ alertConfigId }),
  trackPaused: alertConfigId => applicationsAlertingAlertPaused({ alertConfigId }),
  trackResumed: alertConfigId => applicationsAlertingAlertResumed({ alertConfigId }),
  trackDeleted: alertConfigId => applicationsAlertingAlertDeleted({ alertConfigId }),
  trackRevisionChanged: revision => applicationsAlertingAlertRevisionChanged({ revision })
};

export default function AlertDetails(props) {
  const { location } = props;
  const isGlobalAlertConfig =
    getMatrixParameter(location, alertsTabSegment, alertsCategoryMatrixParam) === categoryGlobal;
  return isGlobalAlertConfig ? <GlobalAlertDetails {...props} /> : <IndividiualAlertDetails {...props} />;
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
      restoreConfig={updateGlobalAlertConfig}
      renderSmartAlertDialog={renderSmartAlertDialog}
      renderAlertConfiguration={renderAlertConfiguration}
      tracking={tracking}
      isGlobalSmartAlert
    />
  );
}

function IndividiualAlertDetails(props) {
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
      restoreConfig={updateAlertConfig}
      renderSmartAlertDialog={renderSmartAlertDialog}
      renderAlertConfiguration={renderAlertConfiguration}
      tracking={tracking}
    />
  );
}

function getAlertDetailsPathForLocation({ location }) {
  return location.pathname === perApInventoryDetailsPath ? perApInventoryDetailsPath : globalInventoryDetailsPath;
}

function getInventoryPathForLocation({ location }) {
  return location.pathname === perApInventoryDetailsPath ? perApInventoryListPath : globalInventoryListPath;
}

function renderSmartAlertDialog({
  close,
  alertConfig,
  setRevision,
  isCopy,
  detailsPath,
  alertConfigId,
  isGlobalSmartAlert
}) {
  return (
    <SmartAlertConfigDialogWrapper
      formData={alertConfig}
      onClose={({ id: copyId } = {}) => {
        close();
        setRevision(null);
        if (isCopy) {
          mutateUrl(location => {
            location.pathname = detailsPath;
            setOrDeleteMatrixKey(location, alertsTabSegment, 'alertId', copyId ?? alertConfigId);
          });
        }
      }}
      isGlobalSmartAlert={isGlobalSmartAlert}
      isCopy={isCopy}
      editMode
    />
  );
}

function renderAlertConfiguration({ alertConfig, isGlobalSmartAlert }) {
  return <AlertConfiguration alertConfig={alertConfig} isGlobalSmartAlert={isGlobalSmartAlert} />;
}

AlertDetails.propTypes = {
  location: propTypeLocation
};
