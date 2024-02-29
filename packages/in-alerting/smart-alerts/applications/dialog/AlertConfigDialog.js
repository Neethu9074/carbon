/*
 * (c) Copyright IBM Corp. 2021
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
import { createAlertConfig, updateAlertConfig } from 'in-alerting/smart-alerts/applications/api/applicationAlertConfig';
import { getDescriptionPlaceholder, getTitlePlaceholder } from 'in-alerting/smart-alerts/applications/form/formUtils';
import { useLinkToAlertConfig, useLinkToGlobalAlertConfigWithoutAPDashboard } from 'in-applications/navigation/paths';
import { useSmartAlertFormSideEffects } from 'in-alerting/smart-alerts/hooks/useSmartAlertFormSideEffects';
import { toBackendQueryModel } from 'in-components/QueryBuilder/transformation/backendQueryModel';
import useApplicationLabel from 'in-alerting/smart-alerts/applications/hooks/useApplicationLabel';
import { trackAlertSaved, trackAlertUpdated } from 'in-alerting/smart-alerts/components/tracker';
import { createSmartAlertForm } from 'in-alerting/smart-alerts/applications/form/smartAlertForm';
import { firstApplicationId } from 'in-alerting/smart-alerts/applications/data/entitySelection';
import { showSuccessMessage } from 'in-alerting/smart-alerts/components/utils/userFeedback';
import { chartViewConfigs } from 'in-alerting/components/Chart/chartViewConfig';
import { updateApplicationAlertActionAssociations } from 'in-automation/api';
import { addActiveDialog, close } from 'in-components/DialogPresenter/store';
import { getApplicationAlertActionAssociations } from 'in-automation/api';
import ConfirmationDialog from 'in-components/Dialog/ConfirmationDialog';
import { actionAutomationEnabled } from 'in-services/featureFlags';
import { associateActionsTracker } from 'in-automation/tracker';
import { role } from 'in-stores/user';
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
    createSmartAlertForm(fromAlertConfig({ actionIds: [], ...alertConfig }), editMode, isGlobalSmartAlert)
  );
  //condition to call get action associations api
  const showActionscondition = !isGlobalSmartAlert && role.canConfigureAutomationActions && actionAutomationEnabled;
  //Get associations call and add actionIds to alertConfig.
  useEffect(() => {
    //when we migrate deprecated event to alert, we already have actionIds in alertConfig.
    if (showActionscondition && !alertConfig.actionIds) {
      // To get associations, we need app alert id. If it is duplicate/clone dialog, we can get it from duplicateFrom.
      const alertId = duplicateFrom ?? alertConfig?.id;
      getApplicationAlertActionAssociations(alertId).once(actions => {
        const selectedActions = actions.map(action => action.id);
        const updatedForm = createSmartAlertForm(
          fromAlertConfig({ actionIds: selectedActions, ...alertConfig }),
          editMode,
          isGlobalSmartAlert
        );
        setForm(updatedForm);
      });
    }
  }, [alertConfig, editMode, isGlobalSmartAlert, showActionscondition, duplicateFrom]);
  const updateForm = useSmartAlertFormSideEffects(form, setForm);
  const [isSaving, setIsSaving] = useState(false);
  const [messages, setMessages] = useState([]);
  const getLinkToGlobalAlertConfigWithoutAPDashboard = useLinkToGlobalAlertConfigWithoutAPDashboard();
  const getLinkToAlertConfig = useLinkToAlertConfig();

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
          header={t('in-alerting:components.alertHeaderRestoreRevisionConfirmationDialogHeader')}
          description={t('in-alerting:components.alertConfirmationDialogDescription', {
            entityPlaceholder: t('in-alerting:smartAlerts.components.alertsHub.applications.title')
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
              duplicateFrom
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
      duplicateFrom
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
  duplicateFrom
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
  const actionIds = form.get('actionIds')?.value ?? [];

  const isEffectivelyGlobalSmartAlert = migrationMode
    ? Object.keys(alertConfig.applications).length > 1
    : isGlobalSmartAlert;
  // In migration mode we always create a new smart alert:
  const isEffectivelyEditMode = migrationMode ? false : editMode;

  if (isEffectivelyEditMode) {
    (isGlobalSmartAlert ? updateGlobalAlertConfig : updateAlertConfig)(alertConfig, form.get('id').value).once(
      config => {
        // add action associations
        if (role.canConfigureAutomationActions && actionAutomationEnabled && !isGlobalSmartAlert) {
          updateApplicationAlertActionAssociations(actionIds, form.get('id').value).once(
            () => {
              onClose(config);
              showSuccessMessage(config.name, isEffectivelyEditMode, isEffectivelyGlobalSmartAlert);
              trackAlertUpdated(config);
              associateActionsTracker({ actionIds, alertId: form.get('id').value, type: 'Application Alert' });
            },
            err => {
              logger.error(`failed to add association to: ${alertConfig} ${err.message}`, err);
              addMessage(enrichSavingErrorWhenContainsLimitReachedOrMarkAsTechnicalError(err));
              setIsSaving(false);
            }
          );
        } else {
          onClose(config);
          showSuccessMessage(config.name, isEffectivelyEditMode, isEffectivelyGlobalSmartAlert);
          trackAlertUpdated(alertConfig);
        }
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
        // add action associations
        if (
          role.canConfigureAutomationActions &&
          actionAutomationEnabled &&
          !isEffectivelyGlobalSmartAlert &&
          actionIds.length > 0
        ) {
          updateApplicationAlertActionAssociations(actionIds, config.id).once(
            () => {
              onClose(config);
              const href = getLinkToAlertConfig(config.id, null, config.applicationId);
              showSuccessMessage(config.name, isEffectivelyEditMode, isEffectivelyGlobalSmartAlert, href);
              const newConfig = duplicateFrom ? { ...config, cloneFromId: duplicateFrom } : config;
              trackAlertSaved(newConfig, simpleMode);

              associateActionsTracker({
                actionIds,
                alertId: config.id,
                type: 'Application alert'
              });
            },
            err => {
              logger.error(`failed to add association to: ${alertConfig} ${err.message}`, err);
              addMessage(enrichSavingErrorWhenContainsLimitReachedOrMarkAsTechnicalError(err));
              setIsSaving(false);
            }
          );
        } else {
          onClose(config);
          const href = isEffectivelyGlobalSmartAlert
            ? getLinkToGlobalAlertConfigWithoutAPDashboard(config.id)
            : getLinkToAlertConfig(config.id, null, config.applicationId);

          showSuccessMessage(config.name, isEffectivelyEditMode, isEffectivelyGlobalSmartAlert, href);
          const newConfig = duplicateFrom ? { ...config, cloneFromId: duplicateFrom } : config;
          trackAlertSaved(newConfig, simpleMode);
        }
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
    actionIds: PropTypes.arrayOf(PropTypes.string),
    id: PropTypes.string,
    threshold: PropTypes.object,
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
