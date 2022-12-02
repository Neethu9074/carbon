/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

import { createLogger } from '@instana/logger';

import { enrichSavingErrorWhenContainsLimitReachedOrMarkAsTechnicalError } from 'in-alerting/smart-alerts/components/utils/enrichSavingErrorWhenContainsLimitReachedOrMarkAsTechnicalError';
import {
  applicationsAlertingAlertCreated,
  applicationsAlertingCloseDialog,
  applicationsAlertingSwitchMode
} from 'in-alerting/smart-alerts/applications/tracker';
import {
  createGlobalAlertConfig,
  updateGlobalAlertConfig
} from 'in-alerting/smart-alerts/applications/api/globalApplicationAlertConfigs';
import { createAlertConfig, updateAlertConfig } from 'in-alerting/smart-alerts/applications/api/applicationAlertConfig';
import { getDescriptionPlaceholder, getTitlePlaceholder } from 'in-alerting/smart-alerts/applications/form/formUtils';
import { getLinkToGlobalAlertConfigWithoutAPDashboard, getLinkToAlertConfig } from 'in-applications/navigation/paths';
import { SmartAlertConfigDialog } from 'in-alerting/smart-alerts/applications/Dialog/SmartAlertConfigDialog';
import { getTrackingObject } from 'in-alerting/smart-alerts/components/smart-alert-dialog/trackingHelpers';
import useSmartAlertFormSideEffects from 'in-alerting/smart-alerts/hooks/useSmartAlertFormSideEffects';
import { toBackendQueryModel } from 'in-components/QueryBuilder/transformation/backendQueryModel';
import useApplicationLabel from 'in-alerting/smart-alerts/applications/hooks/useApplicationLabel';
import { createSmartAlertForm } from 'in-alerting/smart-alerts/applications/form/smartAlertForm';
import { firstApplicationId } from 'in-alerting/smart-alerts/applications/data/entitySelection';
import { showSuccessMessage } from 'in-alerting/smart-alerts/components/utils/userFeedback';
import { chartViewConfigs } from 'in-alerting/components/Chart/chartViewConfig';
import { t } from 'in-i18n';

const logger = createLogger('in-alerting/smart-alerts/applications/Dialog/SmartAlertConfigDialog');

const initialChartConfigIndex = 0;

export default function SmartAlertConfigDialogWrapper({
  onClose,
  editMode,
  migrationMode,
  scopeMigrationDetails,
  isGlobalSmartAlert,
  alertConfig, // type: CreateApplicationAlertConfig
  startWithSimpleMode
}) {
  const [selectedChartViewConfigIndex, setSelectedChartViewConfigIndex] = useState(initialChartConfigIndex);
  const [form, setForm] = useState(() =>
    createSmartAlertForm(fromAlertConfig(alertConfig), editMode, isGlobalSmartAlert)
  );
  const updateForm = useSmartAlertFormSideEffects(form, setForm);
  const [isSaving, setIsSaving] = useState(false);
  const [messages, setMessages] = useState([]);

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

  const withTrackClose = trackingConfig => {
    applicationsAlertingCloseDialog(
      getTrackingObject(
        form,
        trackingConfig
          ? {
              step: trackingConfig
            }
          : {
              mode: 'Advanced'
            }
      )
    );
    onClose({});
  };
  const withTrackCreate = simpleMode => {
    applicationsAlertingAlertCreated({ mode: simpleMode ? 'Simple' : 'Advanced' });
    createOrSaveAlert({
      form,
      setForm,
      onClose,
      editMode,
      migrationMode,
      isGlobalSmartAlert,
      setIsSaving,
      setMessages
    });
  };

  return (
    <SmartAlertConfigDialog
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
      withTrackClose={withTrackClose}
      withTrackCreate={withTrackCreate}
      trackModeSwitch={(simpleMode, step) => {
        applicationsAlertingSwitchMode(
          getTrackingObject(
            form,
            simpleMode
              ? {
                  destinationMode: 'Advanced',
                  step
                }
              : {
                  destinationMode: 'Simple'
                }
          )
        );
      }}
      isSaving={isSaving}
      messages={messages}
      initialConfiguredApplications={alertConfig?.applications ?? {}}
    />
  );
}

SmartAlertConfigDialogWrapper.propTypes = {
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
    threshold: PropTypes.object,
    boundaryScope: PropTypes.string,
    calculateThresholdOnBackend: PropTypes.bool,
    /**
     * The backed model of tagFilterExpression
     */
    tagFilterExpression: PropTypes.object,
    name: PropTypes.string
  }).isRequired,
  onClose: PropTypes.func.isRequired
};

function createOrSaveAlert({
  form,
  setForm,
  onClose,
  editMode,
  migrationMode,
  isGlobalSmartAlert,
  setIsSaving,
  setMessages
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

  const isEffectivelyGlobalSmartAlert = migrationMode
    ? Object.keys(alertConfig.applications).length > 1
    : isGlobalSmartAlert;
  // In migration mode we always create a new smart alert:
  const isEffectivelyEditMode = migrationMode ? false : editMode;

  if (isEffectivelyEditMode) {
    (isGlobalSmartAlert ? updateGlobalAlertConfig : updateAlertConfig)(alertConfig, form.get('id').value).once(
      alertConfig => {
        onClose(alertConfig);
        showSuccessMessage(alertConfig.name, isEffectivelyEditMode, isEffectivelyGlobalSmartAlert);
      },
      error => {
        logger.error(`failed to update alertConfig: ${alertConfig} ${error.message}`, error);
        addMessage(enrichSavingErrorWhenContainsLimitReachedOrMarkAsTechnicalError(error));
        setIsSaving(false);
      }
    );
  } else {
    (isEffectivelyGlobalSmartAlert ? createGlobalAlertConfig : createAlertConfig)(alertConfig).once(
      alertConfig => {
        onClose(alertConfig);
        const href$ = isEffectivelyGlobalSmartAlert
          ? getLinkToGlobalAlertConfigWithoutAPDashboard(alertConfig.id)
          : getLinkToAlertConfig(alertConfig.id, null, alertConfig.applicationId);

        showSuccessMessage(alertConfig.name, isEffectivelyEditMode, isEffectivelyGlobalSmartAlert, href$);
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

function fromAlertConfig(alertConfig) {
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
