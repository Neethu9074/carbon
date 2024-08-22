/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import { getDescriptionPlaceholder, getTitlePlaceholder } from 'in-alerting/smart-alerts/applications/form/formUtils';
import { HISTORIC_BASELINE, STATIC_THRESHOLD } from 'in-alerting/smart-alerts/data/thresholdTypes';
import { toBackendQueryModel } from 'in-components/QueryBuilder/transformation/backendQueryModel';
import { duplicateAlertConfig } from 'in-alerting/smart-alerts/components/dialog/sharedFunctions';
import { getEntitySelection } from 'in-alerting/smart-alerts/applications/data/entitySelection';
import { DAILY } from 'in-alerting/smart-alerts/data/seasonalities';
import { t } from 'in-i18n';

export function getHeaderTitle(isGlobalSmartAlert, editMode, isMigration) {
  if (isMigration) {
    return t('in-alerting:smartAlerts.components.smartAlertDialog.alertConfigTearSheetMigrateAlert');
  } else if (isGlobalSmartAlert) {
    return editMode
      ? t('in-alerting:smartAlerts.components.smartAlertDialog.alertConfigTearSheetEditAlert_Global')
      : t('in-alerting:smartAlerts.components.smartAlertDialog.alertConfigTearSheetCreateNewAlert_Global');
  } else {
    return editMode
      ? t('in-alerting:smartAlerts.components.smartAlertDialog.alertConfigTearSheetEditAlert_Local')
      : t('in-alerting:smartAlerts.components.smartAlertDialog.alertConfigTearSheetCreateNewAlert_Local');
  }
}

export function toAlertConfig(form) {
  let alertConfig = form
    .remove('hiddenFields')
    .updateIn(['tagFilterExpression'], f =>
      f.setValue(toBackendQueryModel(form.get('tagFilterExpression').value, false))
    )
    .toJS();

  if (alertConfig.rule.alertType === 'statusCode') {
    alertConfig = mapStatusCodeSelection(alertConfig);
  }

  alertConfig.applicationId = undefined;
  alertConfig.name = alertConfig.name || getTitlePlaceholder(form);
  alertConfig.description = alertConfig.description || getDescriptionPlaceholder(form);
  return alertConfig;
}

function mapStatusCodeSelection(alertConfig) {
  const {
    rule: {
      statusCode: { statusCodeStart, statusCodeEnd },
      ...remainingRule
    }
  } = alertConfig;

  alertConfig.rule = {
    statusCodeStart,
    statusCodeEnd,
    ...remainingRule
  };
  return alertConfig;
}

export function fromAlertConfig(alertConfig) {
  if (alertConfig?.rule?.alertType === 'statusCode') {
    alertConfig = mapStatusCodeConfig(alertConfig);
  }
  return alertConfig;
}

function mapStatusCodeConfig(alertConfig) {
  const {
    rule: { statusCodeStart, statusCodeEnd, ...remainingRule }
  } = alertConfig;

  return {
    ...alertConfig,
    rule: {
      statusCode: {
        statusCodeEnd,
        statusCodeStart
      },
      ...remainingRule
    }
  };
}

export function generateAlertConfig(
  isGlobalSmartAlert,
  applicationId,
  boundaryScope,
  serviceId,
  endpointId,
  includeSynthetic
) {
  if (isGlobalSmartAlert) {
    return {
      threshold: {
        type: STATIC_THRESHOLD
      }
    };
  }
  return {
    boundaryScope: boundaryScope,
    threshold: {
      type: HISTORIC_BASELINE,
      value: 0.0,
      seasonality: DAILY
    },
    calculateThresholdOnBackend: true,
    includeSynthetic,
    applications: applicationId && getEntitySelection(applicationId, serviceId, endpointId)
  };
}

export function getApplicationAlertConfig(
  isGlobalSmartAlert,
  alertConfig,
  migrateAlertConfig,
  boundaryScope,
  applicationIds,
  applicationMode
) {
  if (applicationMode?.editMode) {
    return alertConfig;
  } else if (applicationMode?.migrationMode) {
    return migrateAlertConfig;
  } else if (applicationMode?.potentialProblemMode) {
    return getPotentialProblemConfig();
  } else if (applicationMode?.duplicateMode) {
    return alertConfig && duplicateAlertConfig(alertConfig);
  } else {
    return generateAlertConfig(
      isGlobalSmartAlert,
      applicationIds?.applicationId,
      boundaryScope,
      applicationIds?.serviceId,
      applicationIds?.endpointId
    );
  }
}

function getPotentialProblemConfig() {
  const config = JSON.parse(localStorage.getItem('potentialProblemConfig'));
  localStorage.removeItem('potentialProblemConfig');
  return config;
}
