/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { createLogger } from '@instana/logger';
import React, { useState } from 'react';
import PropTypes from 'prop-types';

import AlertConfigDialogWithThreshold from 'in-alerting/smart-alerts/websites/alertConfigDialogWithThreshold/AlertConfigDialogWithThreshold';
import alertFormDefinition, { fieldNames } from 'in-alerting/smart-alerts/websites/form/alertDialogFormDefinition';
import { getDescriptionPlaceholder, getTitlePlaceholder } from 'in-alerting/smart-alerts/websites/form/formUtils';
import useSmartAlertFormSideEffects from 'in-alerting/smart-alerts/hooks/useSmartAlertFormSideEffects';
import { toBackendQueryModel } from 'in-new-components/QueryBuilder/transformation/backendQueryModel';
import { changeFormDataByCopyState } from '../components/smart-alert-dialog/sharedFunctions';
import { createAlertConfig, updateAlertConfig } from 'in-websites/api/websiteAlertConfig';
import { chartViewConfigs } from 'in-alerting/components/Chart/chartViewConfig';

const logger = createLogger('in-websites/alerting/AlertDialog');
const initialChartConfigIndex = 0;

export default function AlertConfigDialog({ onClose, formData, websiteLabel, editMode, isCopy }) {
  const [selectedChartViewConfigIndex, setSelectedChartViewConfigIndex] = useState(initialChartConfigIndex);
  const [form, setForm] = useState(() => alertFormDefinition(changeFormDataByCopyState(isCopy, formData), editMode));
  const updateForm = useSmartAlertFormSideEffects(form, setForm);
  const [isSaving, setIsSaving] = useState(false);

  return (
    <AlertConfigDialogWithThreshold
      updateForm={updateForm}
      form={form}
      onChange={createOnChange(updateForm, form)}
      onChartViewConfigChange={setSelectedChartViewConfigIndex}
      selectedChartViewConfigIndex={selectedChartViewConfigIndex}
      onClose={onClose}
      onCreate={() => createAlert(form, setForm, onClose, editMode, setIsSaving)}
      timeConfig={chartViewConfigs[selectedChartViewConfigIndex].timeConfig}
      websiteLabel={websiteLabel}
      editMode={editMode}
      granularity={form.get('granularity').value}
      isSaving={isSaving}
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

function createAlert(form, setForm, onClose, editMode, setIsSaving) {
  setIsSaving(true);

  if (!form.hierarchyValid) {
    setForm(form.setTouched(true, { recurse: true }));
    setIsSaving(false);
    return;
  }

  const websiteAlertConfig = toAlertConfig(form);

  if (editMode) {
    updateAlertConfig(websiteAlertConfig, form.get('id').value).once(
      alertConfig => onClose(alertConfig),
      error => {
        logger.error(`failed to update alertConfig: ${websiteAlertConfig} ${error.message}`, error);
        setIsSaving(false);
      }
    );
  } else {
    createAlertConfig(websiteAlertConfig).once(
      alertConfig => onClose(alertConfig),
      error => {
        logger.error(`failed to save alertConfig: ${websiteAlertConfig} ${error.message}`, error);
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
    granularity: form.get(fieldNames.granularity).value
  });
}

AlertConfigDialog.propTypes = {
  formData: PropTypes.object.isRequired,
  onClose: PropTypes.func.isRequired,
  websiteLabel: PropTypes.string.isRequired,
  editMode: PropTypes.bool,
  /**
   * Whether the new Smart Alert is a copy of a given Smart Alert
   */
  isCopy: PropTypes.bool
};
