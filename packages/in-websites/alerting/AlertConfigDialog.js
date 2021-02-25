/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import { createLogger } from '@instana/logger';
import React, { useState } from 'react';
import PropTypes from 'prop-types';

import AlertConfigDialogWithThreshold from 'in-websites/alerting/alertConfigDialogWithThreshold/AlertConfigDialogWithThreshold';
import alertFormDefinition, { fieldNames } from 'in-websites/alerting/form/alertDialogFormDefinition';
import { toBackendQueryModel } from 'in-new-components/QueryBuilder/transformation/backendQueryModel';
import { getDescriptionPlaceholder, getTitlePlaceholder } from 'in-websites/alerting/form/formUtils';
import { createAlertConfig, updateAlertConfig } from 'in-websites/api/websiteAlertConfig';
import { chartViewConfigs } from 'in-new-components/Alerting/Chart/chartViewConfig';
import { isQB2ModeInSmartAlertsEnabled } from 'in-services/featureFlags';

const logger = createLogger('in-websites/alerting/AlertDialog');
const initialChartConfigIndex = 0;

export default function AlertConfigDialog({ onClose, formData, websiteLabel, editMode }) {
  const [selectedChartViewConfigIndex, setSelectedChartViewConfigIndex] = useState(initialChartConfigIndex);
  const [form, setForm] = useState(() => alertFormDefinition(formData));
  const [isSaving, setIsSaving] = useState(false);

  return (
    <AlertConfigDialogWithThreshold
      updateForm={setForm}
      form={form}
      onChange={createOnChange(setForm, form)}
      onChartViewConfigChange={setSelectedChartViewConfigIndex}
      selectedChartViewConfigIndex={selectedChartViewConfigIndex}
      onClose={onClose}
      onCreate={() => createAlert(form, setForm, onClose, editMode, setIsSaving, isQB2ModeInSmartAlertsEnabled)}
      timeConfig={chartViewConfigs[selectedChartViewConfigIndex].timeConfig}
      websiteLabel={websiteLabel}
      editMode={editMode}
      granularity={form.get('granularity').value}
      isSaving={isSaving}
    />
  );
}

AlertConfigDialog.propTypes = {
  formData: PropTypes.object.isRequired,
  onClose: PropTypes.func.isRequired,
  websiteLabel: PropTypes.string.isRequired,
  editMode: PropTypes.bool
};

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

function createAlert(form, setForm, onClose, editMode, setIsSaving, qb2Enabled) {
  setIsSaving(true);

  if (!form.hierarchyValid) {
    setForm(form.setTouched(true, { recurse: true }));
    setIsSaving(false);
    return;
  }

  const websiteAlertConfig = toAlertConfig(form, qb2Enabled);

  if (editMode) {
    updateAlertConfig(websiteAlertConfig, form.get('id').value).once(
      () => onClose(),
      error => {
        logger.error(`failed to update alertConfig: ${websiteAlertConfig} ${error.message}`, error);
        setIsSaving(false);
      }
    );
  } else {
    createAlertConfig(websiteAlertConfig).once(
      () => onClose(),
      error => {
        logger.error(`failed to save alertConfig: ${websiteAlertConfig} ${error.message}`, error);
        setIsSaving(false);
      }
    );
  }
}

function toAlertConfig(form, qb2Enabled) {
  const common = {
    rule: form.get('rule').toJS(),
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
  };
  const tagFilterFormModel = form.get(fieldNames.tagFilterExpression).value;
  const tagFilterExpression = toBackendQueryModel(tagFilterFormModel, false);
  const alertConfig = !qb2Enabled
    ? {
        ...common,
        tagFilters: form.get(fieldNames.tagFilters).value
      }
    : {
        ...common,
        tagFilterExpression
      };
  return Object.freeze(alertConfig);
}
