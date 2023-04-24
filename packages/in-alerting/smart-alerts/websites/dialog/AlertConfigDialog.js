/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React, { useState } from 'react';
import PropTypes from 'prop-types';

import { createLogger } from '@instana/logger';

import { enrichSavingErrorWhenContainsLimitReachedOrMarkAsTechnicalError } from 'in-alerting/smart-alerts/components/utils/enrichSavingErrorWhenContainsLimitReachedOrMarkAsTechnicalError';
import AlertConfigDialogWithThreshold from 'in-alerting/smart-alerts/websites/dialog/AlertConfigDialogWithThreshold';
import alertFormDefinition, { fieldNames } from 'in-alerting/smart-alerts/websites/form/alertDialogFormDefinition';
import { getDescriptionPlaceholder, getTitlePlaceholder } from 'in-alerting/smart-alerts/websites/form/formUtils';
import { createAlertConfig, updateAlertConfig } from 'in-alerting/smart-alerts/websites/api/websiteAlertConfig';
import { useSmartAlertFormSideEffects } from 'in-alerting/smart-alerts/hooks/useSmartAlertFormSideEffects';
import { toBackendQueryModel } from 'in-components/QueryBuilder/transformation/backendQueryModel';
import { trackAlertSaved, trackAlertUpdated } from 'in-alerting/smart-alerts/components/tracker';
import { showSuccessMessage } from 'in-alerting/smart-alerts/components/utils/userFeedback';
import useWebsiteLabel from 'in-alerting/smart-alerts/websites/hooks/useWebsiteLabel';
import { chartViewConfigs } from 'in-alerting/components/Chart/chartViewConfig';
import { useGetAlertConfigLink } from 'in-websites/navigation/paths';

const logger = createLogger('in-websites/alerting/AlertDialog');
const initialChartConfigIndex = 0;

export default function AlertConfigDialog({ onClose, alertConfig, editMode, startWithSimpleMode }) {
  const [selectedChartViewConfigIndex, setSelectedChartViewConfigIndex] = useState(initialChartConfigIndex);
  const [form, setForm] = useState(() => alertFormDefinition(alertConfig, editMode));
  const updateForm = useSmartAlertFormSideEffects(form, setForm);
  const [isSaving, setIsSaving] = useState(false);
  const [messages, setMessages] = useState([]);

  const websiteLabel = useWebsiteLabel(form.get('websiteId')?.value);

  const getLinkToAlertConfig = useGetAlertConfigLink();

  const withTrackCreate = simpleMode => {
    createOrSaveAlert(form, setForm, onClose, editMode, setIsSaving, setMessages, getLinkToAlertConfig, simpleMode);
  };

  return (
    <AlertConfigDialogWithThreshold
      updateForm={updateForm}
      form={form}
      onChange={createOnChange(updateForm, form)}
      onChartViewConfigChange={setSelectedChartViewConfigIndex}
      selectedChartViewConfigIndex={selectedChartViewConfigIndex}
      onClose={onClose}
      timeConfig={chartViewConfigs[selectedChartViewConfigIndex].timeConfig}
      websiteLabel={websiteLabel}
      editMode={editMode}
      startWithSimpleMode={startWithSimpleMode}
      granularity={form.get('granularity').value}
      withTrackClose={() => onClose({})}
      withTrackCreate={withTrackCreate}
      isSaving={isSaving}
      messages={messages}
    />
  );
}

function createOnChange(setForm, externalForm) {
  return (form, fieldName, fieldValue, ...atomicAddFields) => {
    // Alternative (new and desired) method signature
    if (form instanceof Array) {
      const path = form;
      const fn = fieldName;
      setForm(externalForm.updateIn(path, fn));
      return;
    }

    // old signature, we want to get rid of this
    let updatedForm = form.updateIn([fieldName], field => field.setValue(fieldValue));
    if (atomicAddFields.length > 0) {
      atomicAddFields.forEach(
        ({ name, value }) => (updatedForm = updatedForm.updateIn([name], field => field.setValue(value)))
      );
    }
    setForm(updatedForm);
  };
}

function createOrSaveAlert(
  form,
  setForm,
  onClose,
  editMode,
  setIsSaving,
  setMessages,
  getLinkToAlertConfig,
  simpleMode
) {
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

  if (editMode) {
    updateAlertConfig(alertConfig, form.get('id').value).once(
      alertConfig => {
        onClose(alertConfig);
        showSuccessMessage(alertConfig.name, editMode);
        trackAlertUpdated(alertConfig);
      },
      error => {
        logger.error(`failed to update alertConfig: ${alertConfig} ${error.message}`, error);
        addMessage(enrichSavingErrorWhenContainsLimitReachedOrMarkAsTechnicalError(error));
        setIsSaving(false);
      }
    );
  } else {
    createAlertConfig(alertConfig).once(
      alertConfig => {
        onClose(alertConfig);
        const href = getLinkToAlertConfig(alertConfig.id, alertConfig.websiteId, null);

        showSuccessMessage(alertConfig.name, editMode, false, href);
        trackAlertSaved(alertConfig, simpleMode);
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
  const tagFilterFormModel = form.get(fieldNames.tagFilterExpression).value;

  return Object.freeze({
    rule: form.get('rule').toJS(),
    tagFilterExpression: toBackendQueryModel(tagFilterFormModel, false),
    alertChannelIds: form.get(fieldNames.alertChannelIds).value,
    enabled: form.get(fieldNames.enabled).value,
    triggering: form.get(fieldNames.triggering).value,
    severity: form.get(fieldNames.severity).value,
    description: form.get(fieldNames.description).value || getDescriptionPlaceholder(form),
    name: form.get(fieldNames.name).value || getTitlePlaceholder(form),
    websiteId: form.get(fieldNames.websiteId).value,
    threshold: form.get('threshold').toJS(),
    timeThreshold: form.get('timeThreshold').toJS(),
    granularity: form.get(fieldNames.granularity).value,
    customPayloadFields: form.get('customPayloadFields').toJS()
  });
}

AlertConfigDialog.propTypes = {
  alertConfig: PropTypes.shape({
    websiteId: PropTypes.string,
    calculateThresholdOnBackend: PropTypes.bool,
    /**
     * The backed model of tagFilterExpression
     */
    tagFilterExpression: PropTypes.object,
    name: PropTypes.string
  }).isRequired,
  onClose: PropTypes.func.isRequired,
  editMode: PropTypes.bool,
  startWithSimpleMode: PropTypes.bool
};
