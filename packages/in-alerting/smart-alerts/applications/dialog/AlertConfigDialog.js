/*
 * (c) Copyright IBM Corp. 2025
 * (c) Copyright Instana Inc.
 */

import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { isEmpty } from 'lodash';

import { createLogger } from '@instana/logger';

import { enrichSavingErrorWhenContainsLimitReachedOrMarkAsTechnicalError } from 'in-alerting/smart-alerts/components/utils/enrichSavingErrorWhenContainsLimitReachedOrMarkAsTechnicalError';
import {
  createGlobalAlertConfig,
  updateGlobalAlertConfig
} from 'in-alerting/smart-alerts/applications/api/globalApplicationAlertConfigs';
import AlertConfigDialogWithThreshold from 'in-alerting/smart-alerts/applications/dialog/AlertConfigDialogWithThreshold';
import { useSmartAlertFormSideEffects } from 'in-alerting/smart-alerts/hooks/useSmartAlertMultiThresholdFormSideEffects';
import { createAlertConfig, updateAlertConfig } from 'in-alerting/smart-alerts/applications/api/applicationAlertConfig';
import { getDescriptionPlaceholder, getTitlePlaceholder } from 'in-alerting/smart-alerts/applications/form/formUtils';
import { useLinkToAlertConfig, useLinkToGlobalAlertConfigWithoutAPDashboard } from 'in-applications/navigation/paths';
import { HISTORIC_BASELINE, STATIC_THRESHOLD, ADAPTIVE_BASELINE } from 'in-alerting/smart-alerts/data/thresholdTypes';
import { calculateEffectiveGracePeriodForBackend } from 'in-alerting/smart-alerts/components/utils/alertUtils';
import { WARNING_SEVERITY, CRITICAL_SEVERITY } from 'in-alerting/smart-alerts/components/utils/baselineUtils';
import { toBackendQueryModel } from 'in-components/QueryBuilder/transformation/backendQueryModel';
import useApplicationLabel from 'in-alerting/smart-alerts/applications/hooks/useApplicationLabel';
import { createSmartAlertForm } from 'in-alerting/smart-alerts/applications/form/smartAlertForm';
import { firstApplicationId } from 'in-alerting/smart-alerts/applications/data/entitySelection';
import { showSuccessMessage } from 'in-alerting/smart-alerts/components/utils/userFeedback';
import { alertChannelPerSeverityApplicationSaEnabled } from 'in-services/featureFlags';
import { populateRulesInConfig } from 'in-alerting/smart-alerts/utils/thresholdUtils';
import { getTrackingAlertConfig } from 'in-alerting/smart-alerts/utils/segmentUtils';
import { ALERTING_SAVED, ALERTING_UPDATED } from 'in-services/tracking/eventNames';
import { chartViewConfigs } from 'in-alerting/components/Chart/chartViewConfig';
import { addActiveDialog, close } from 'in-components/DialogPresenter/store';
import { useSegmentTracking } from 'in-services/tracking/useSegmentTracking';
import ConfirmationDialog from 'in-components/Dialog/ConfirmationDialog';
import { t } from 'in-i18n';

const logger = createLogger('in-alerting/smart-alerts/applications/dialog/AlertConfigDialogWithThreshold');
const initialChartConfigIndex = 0;

export default function AlertConfigDialog({
  onClose,
  editMode,
  migrationMode,
  scopeMigrationDetails,
  isGlobalSmartAlert,
  alertConfig,
  startWithSimpleMode
}) {
  const [selectedChartViewConfigIndex, setSelectedChartViewConfigIndex] = useState(initialChartConfigIndex);
  const duplicateFrom = alertConfig?.duplicateFrom;
  const [form, setForm] = useState(() =>
    createSmartAlertForm(fromAlertConfig(alertConfig), editMode, isGlobalSmartAlert)
  );
  const updateForm = useSmartAlertFormSideEffects(form, setForm);
  const [isSaving, setIsSaving] = useState(false);
  const [messages, setMessages] = useState([]);
  const getLinkToGlobalAlertConfigWithoutAPDashboard = useLinkToGlobalAlertConfigWithoutAPDashboard();
  const getLinkToAlertConfig = useLinkToAlertConfig();
  const { trackCta } = useSegmentTracking(); // For segment tracking

  useEffect(() => {
    if (migrationMode) {
      setMessages(prevMessages => [
        ...prevMessages,
        {
          level: 'warning',
          message: t('in-alerting:smartAlerts.components.smartAlertDialog.migrationModeWarning')
        }
      ]);
    }
  }, [migrationMode]);

  const applicationLabel = useApplicationLabel(firstApplicationId(form.get('applications').value), isGlobalSmartAlert);
  const withTrackCreate = simpleMode => {
    if (isEmpty(form.get('applications').value)) {
      addActiveDialog(
        <ConfirmationDialog
          header={t('in-alerting:components.alertActionConfirmationDialogHeader')}
          description={t('in-alerting:components.alertConfirmationDialogDescription', {
            entityPlaceholder: t('in-settings:productAreas.title_applications')
          })}
          confirmButtonLabel={t('in-alerting:components.labelConfirm')}
          confirmButtonKind="danger"
          onSubmit={() => {
            close();
            createOrSaveAlert({
              form,
              setForm,
              onClose,
              editMode,
              migrationMode,
              isGlobalSmartAlert,
              setIsSaving,
              setMessages,
              getLinkToGlobalAlertConfigWithoutAPDashboard,
              getLinkToAlertConfig,
              simpleMode,
              duplicateFrom,
              trackCta
            });
          }}
        />
      );
      return;
    }
    createOrSaveAlert({
      form,
      setForm,
      onClose,
      editMode,
      migrationMode,
      isGlobalSmartAlert,
      setIsSaving,
      setMessages,
      getLinkToGlobalAlertConfigWithoutAPDashboard,
      getLinkToAlertConfig,
      simpleMode,
      duplicateFrom,
      trackCta
    });
  };

  return (
    <AlertConfigDialogWithThreshold
      applicationLabel={applicationLabel}
      isGlobalSmartAlert={isGlobalSmartAlert}
      editMode={editMode}
      migrationMode={migrationMode}
      scopeMigrationDetails={scopeMigrationDetails}
      startWithSimpleMode={startWithSimpleMode}
      form={form}
      updateForm={updateForm}
      granularity={form.get('granularity').value}
      onChange={(path, fn) => updateForm(form.updateIn(path, fn))}
      onChartViewConfigChange={setSelectedChartViewConfigIndex}
      selectedChartViewConfigIndex={selectedChartViewConfigIndex}
      setForm={setForm}
      timeConfig={chartViewConfigs[selectedChartViewConfigIndex].timeConfig}
      withTrackClose={() => onClose({})}
      withTrackCreate={withTrackCreate}
      isSaving={isSaving}
      messages={messages}
      initialConfiguredApplications={alertConfig?.applications ?? {}}
    />
  );
}

function createOrSaveAlert({
  form,
  setForm,
  onClose,
  editMode,
  migrationMode,
  isGlobalSmartAlert,
  setIsSaving,
  setMessages,
  getLinkToGlobalAlertConfigWithoutAPDashboard,
  getLinkToAlertConfig,
  simpleMode,
  duplicateFrom,
  trackCta
}) {
  setIsSaving(true);
  // remove existing error messages:
  setMessages(prevMessages => prevMessages.filter(m => m.level && m.level !== 'error'));

  const addMessage = message => {
    setMessages(prevMessages => [...prevMessages, message]);
  };

  if (!form.hierarchyValid) {
    setForm(form.setTouched(true, { recurse: true }));
    setIsSaving(false);
    return;
  }

  const alertConfig = toAlertConfig(form);
  const thresholdType = form.get('threshold').get('warningThreshold').get('type').value;

  const isEffectivelyGlobalSmartAlert = migrationMode
    ? Object.keys(alertConfig.applications).length > 1
    : isGlobalSmartAlert;
  // In migration mode we always create a new smart alert:
  const isEffectivelyEditMode = migrationMode ? false : editMode;

  if (isEffectivelyEditMode) {
    (isGlobalSmartAlert ? updateGlobalAlertConfig : updateAlertConfig)(alertConfig, form.get('id').value).once(
      config => {
        onClose(config);
        showSuccessMessage(config.name, isEffectivelyEditMode, isEffectivelyGlobalSmartAlert);
        const alertConfigForTracking = getTrackingAlertConfig(alertConfig, thresholdType);
        trackCta(ALERTING_UPDATED, { ...alertConfigForTracking, dialogMode: 'Advanced' });
      },
      error => {
        logger.error(`failed to update alertConfig: ${alertConfig} ${error.message}`, error);
        addMessage(enrichSavingErrorWhenContainsLimitReachedOrMarkAsTechnicalError(error));
        setIsSaving(false);
      }
    );
  } else {
    (isEffectivelyGlobalSmartAlert ? createGlobalAlertConfig : createAlertConfig)(alertConfig).once(
      config => {
        onClose(config);
        const href = isEffectivelyGlobalSmartAlert
          ? getLinkToGlobalAlertConfigWithoutAPDashboard(config.id)
          : getLinkToAlertConfig(config.id, null, config.applicationId);

        showSuccessMessage(config.name, isEffectivelyEditMode, isEffectivelyGlobalSmartAlert, href);
        const newConfigForTracking = getTrackingAlertConfig(config, thresholdType);
        const newConfig = duplicateFrom
          ? { ...newConfigForTracking, cloneFromId: duplicateFrom }
          : newConfigForTracking;
        trackCta(ALERTING_SAVED, { ...newConfig, dialogMode: simpleMode ? 'Simple' : 'Advanced' });
      },
      error => {
        logger.error(`failed to save alertConfig: ${alertConfig} ${error.message}`, error);
        addMessage(enrichSavingErrorWhenContainsLimitReachedOrMarkAsTechnicalError(error));
        setIsSaving(false);
      }
    );
  }
}

function toAlertConfig(form) {
  const ruleWithThreshold = getRuleWithThreshold(form);
  const gracePeriod = form.get('gracePeriod').value;
  const granularity = form.get('granularity').value;
  let alertConfig = form
    .remove('hiddenFields')
    .remove('rule')
    .remove('threshold')
    .updateIn(['tagFilterExpression'], f =>
      f.setValue(toBackendQueryModel(form.get('tagFilterExpression').value, false))
    )
    .toJS();

  alertConfig.rules = [ruleWithThreshold];

  if (alertConfig.rules[0].rule.alertType === 'statusCode') {
    alertConfig = mapStatusCodeSelection(alertConfig);
  }
  alertConfig.applicationId = undefined;

  if (alertChannelPerSeverityApplicationSaEnabled) {
    alertConfig.alertChannelIds = null;
  } else {
    alertConfig.alertChannels = null;
  }
  alertConfig.gracePeriod = calculateEffectiveGracePeriodForBackend(gracePeriod, granularity);
  alertConfig.name = alertConfig.name || getTitlePlaceholder(form);
  alertConfig.description = alertConfig.description || getDescriptionPlaceholder(form);
  return alertConfig;
}

export function getRuleWithThreshold(form) {
  const thresholdType = form.get('threshold').get('warningThreshold').get('type').value;

  const warningThresholdField = form.get('threshold').get('warningThreshold');
  const criticalThresholdField = form.get('threshold').get('criticalThreshold');

  const warningThreshold = getThresholdData(thresholdType, warningThresholdField, WARNING_SEVERITY);
  const criticalThreshold = getThresholdData(thresholdType, criticalThresholdField, CRITICAL_SEVERITY);

  const ruleWithThreshold = {
    rule: form.get('rule').toJS(),
    thresholdOperator: form.get('threshold').get('operator').value,
    thresholds: { ...warningThreshold, ...criticalThreshold }
  };

  return ruleWithThreshold;
}

export function getThresholdData(thresholdType, thresholdField, severity) {
  if (
    thresholdType === HISTORIC_BASELINE ||
    thresholdType === ADAPTIVE_BASELINE ||
    thresholdType === STATIC_THRESHOLD
  ) {
    return thresholdField.get('isCheckboxSelected')?.value ? { [severity]: thresholdField.toJS() } : {};
  }

  return {};
}

function mapStatusCodeSelection(alertConfig) {
  const {
    rules: [
      {
        rule: {
          statusCode: { statusCodeStart, statusCodeEnd },
          ...remainingRule
        }
      }
    ]
  } = alertConfig;

  alertConfig.rules[0].rule = {
    statusCodeStart,
    statusCodeEnd,
    ...remainingRule
  };

  return alertConfig;
}

function fromAlertConfig(alertConfig) {
  if (alertConfig?.rules?.[0]?.rule?.alertType === 'statusCode') {
    alertConfig = mapStatusCodeConfig(alertConfig);
  }
  return populateRulesInConfig(alertConfig);
}

function mapStatusCodeConfig(alertConfig) {
  const {
    rule: { statusCodeStart, statusCodeEnd, ...remainingRule }
  } = alertConfig.rules[0];

  return {
    ...alertConfig,
    rules: [
      {
        ...alertConfig.rules[0],
        rule: {
          statusCode: {
            statusCodeEnd,
            statusCodeStart
          },
          ...remainingRule
        }
      }
    ]
  };
}

AlertConfigDialog.propTypes = {
  editMode: PropTypes.bool,
  migrationMode: PropTypes.bool,
  scopeMigrationDetails: PropTypes.shape({
    query: PropTypes.string,
    result: PropTypes.string.isRequired
  }),
  isGlobalSmartAlert: PropTypes.bool,
  startWithSimpleMode: PropTypes.bool,
  alertConfig: PropTypes.shape({
    applications: PropTypes.object,
    id: PropTypes.string,
    rules: PropTypes.arrayOf(PropTypes.object),
    boundaryScope: PropTypes.string,
    calculateThresholdOnBackend: PropTypes.bool,
    /**
     * The backed model of tagFilterExpression
     */
    tagFilterExpression: PropTypes.object,
    name: PropTypes.string,
    duplicateFrom: PropTypes.string
  }).isRequired,
  onClose: PropTypes.func.isRequired
};
