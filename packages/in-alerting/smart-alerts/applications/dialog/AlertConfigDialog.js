/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React, { useState, useEffect } from 'react';
import { uniq, pull } from 'lodash';
import PropTypes from 'prop-types';

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
import { saveNewAssociation, getAllAssociations } from 'in-automation/api';
import { actionAutomationEnabled } from 'in-services/featureFlags';
import { trackAlertActionAssociated } from 'in-automation/tracker';
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
  const [form, setForm] = useState(() =>
    createSmartAlertForm(fromAlertConfig(alertConfig), editMode, isGlobalSmartAlert)
  );
  //Need this to get difference(deleted) for actionids
  const summaryActionIds = alertConfig?.actionIds ?? [];
  const updateForm = useSmartAlertFormSideEffects(form, setForm);
  const [isSaving, setIsSaving] = useState(false);
  const [messages, setMessages] = useState([]);
  const getLinkToGlobalAlertConfigWithoutAPDashboard = useLinkToGlobalAlertConfigWithoutAPDashboard();
  const getLinkToAlertConfig = useLinkToAlertConfig();
  const duplicateFrom = alertConfig?.duplicateFrom;

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
      summaryActionIds
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
  summaryActionIds
}) {
  setIsSaving(true);
  // remove existing error messages:
  setMessages(prevMessages => prevMessages.filter(m => m.level && m.level !== 'error'));

  const addMessage = message => {
    setMessages(prevMessages => [...prevMessages, message]);
  };

  // parse all associations data to get associations of actions ids we have in form
  function getAlertsByActionIds(data, actionIds) {
    const result = {};

    actionIds.forEach(actionId => {
      result[actionId] = {
        builtin_event_ids: [],
        custom_events: [],
        application_alert: []
      };
    });

    data.forEach(item => {
      const action = item.action || {};
      const actionId = action.id;
      const builtinEventId = item.builtin_event_id;
      const customEvent = item.custom_event;
      const applicationAlert = item.application_alert;

      if (actionIds.includes(actionId)) {
        if (builtinEventId) {
          result[actionId].builtin_event_ids.push(builtinEventId);
        }
        if (customEvent) {
          result[actionId].custom_events.push(customEvent.id);
        }
        if (applicationAlert) {
          result[actionId].application_alert.push(applicationAlert.id);
        }
      }
    });

    return result;
  }

  function actionAssociations(actionIds, alertConfigId, alertConfig, isEffectivelyEditMode) {
    //concat form.actionids and actual associated action ids from alert details

    function reload() {
      onClose(alertConfig);
      showSuccessMessage(alertConfig.name, isEffectivelyEditMode, isEffectivelyGlobalSmartAlert);
      trackAlertUpdated(alertConfig);
    }
    const concatenatedArray = summaryActionIds.concat(actionIds);
    //returns unique array
    const uniqueArray = [...new Set(concatenatedArray)];
    let alertCount = uniqueArray.length;
    //get all associations and parse the data format. We need this data to get all associations for action.
    getAllAssociations().once(
      res => {
        const result = getAlertsByActionIds(res, uniqueArray);
        //If we delete the actions by deslecting, we will hget the difference Array
        const differenceArray = summaryActionIds.filter(item => !actionIds.includes(item));

        if (differenceArray.length > 0) {
          differenceArray.forEach(id => {
            //When we delete action association, we have to exclude the app alert id and send new array to api
            const actionAssociation = {
              action_id: id,
              application_alert_ids: pull(result[id].application_alert, alertConfigId),
              builtin_event_ids: result[id].builtin_event_ids,
              custom_event_ids: result[id].custom_events
            };
            saveNewAssociation(actionAssociation).once(
              () => {
                alertCount = alertCount - 1;
                if (alertCount === 0 && isEffectivelyEditMode) {
                  reload();
                }
              },

              err => {
                logger.error(`failed to associate actions: ${alertConfig} ${err.message}`, err);
                addMessage(enrichSavingErrorWhenContainsLimitReachedOrMarkAsTechnicalError(err));
                setIsSaving(false);
              }
            );
          });
        }

        //When we add  action association, we have to
        if (actionIds.length > 0) {
          uniq(actionIds).forEach(id => {
            const actionAssociation = {
              action_id: id,
              application_alert_ids: [alertConfigId].concat(result[id].application_alert),
              builtin_event_ids: result[id].builtin_event_ids,
              custom_event_ids: result[id].custom_events
            };
            saveNewAssociation(actionAssociation).once(
              () => {
                alertCount = alertCount - 1;
                if (alertCount === 0) {
                  if (isEffectivelyEditMode) {
                    reload();
                  } else {
                    onClose(alertConfig);
                    const href = getLinkToAlertConfig(alertConfig.id, null, alertConfig.applicationId);
                    showSuccessMessage(alertConfig.name, isEffectivelyEditMode, isEffectivelyGlobalSmartAlert, href);
                    const newConfig = duplicateFrom ? { ...alertConfig, cloneFromId: duplicateFrom } : alertConfig;
                    trackAlertSaved(newConfig, simpleMode);
                  }
                }
              },

              err => {
                logger.error(`failed to associate actions: ${alertConfig} ${err.message}`, err);
                addMessage(enrichSavingErrorWhenContainsLimitReachedOrMarkAsTechnicalError(err));
                setIsSaving(false);
              }
            );
          });
        } else {
          if (isEffectivelyEditMode && differenceArray.length === 0) {
            reload();
          }
        }

        trackAlertActionAssociated(actionIds, alertConfigId);
      },
      err => {
        logger.error(`failed to get associations:  ${err.message}`, err);
      }
    );
  }

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
        if (role.canConfigureAutomationActions && actionAutomationEnabled && !isGlobalSmartAlert) {
          actionAssociations(actionIds, form.get('id').value, config, isEffectivelyEditMode);
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
        if (
          role.canConfigureAutomationActions &&
          actionAutomationEnabled &&
          !isEffectivelyGlobalSmartAlert &&
          actionIds.length > 0
        ) {
          actionAssociations(actionIds, config.id, config, isEffectivelyEditMode);
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
