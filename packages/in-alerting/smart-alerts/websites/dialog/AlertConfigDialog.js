/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React, { useState } from 'react';
import PropTypes from 'prop-types';

import AlertConfigDialogWithThreshold from 'in-alerting/smart-alerts/websites/dialog/AlertConfigDialogWithThreshold';
import alertFormDefinition, { fieldNames } from 'in-alerting/smart-alerts/websites/form/alertDialogFormDefinition';
import { getDescriptionPlaceholder, getTitlePlaceholder } from 'in-alerting/smart-alerts/websites/form/formUtils';
import { useSmartAlertFormSideEffects } from 'in-alerting/smart-alerts/hooks/useSmartAlertFormSideEffects';
import { toBackendQueryModel } from 'in-components/QueryBuilder/transformation/backendQueryModel';
import { createOrSaveAlert } from 'in-alerting/smart-alerts/eum/components/AlertCreateOrSave';
import useWebsiteLabel from 'in-alerting/smart-alerts/websites/hooks/useWebsiteLabel';
import { chartViewConfigs } from 'in-alerting/components/Chart/chartViewConfig';
import { eumType } from 'in-alerting/smart-alerts/websites/constants';
import { useGetAlertConfigLink } from 'in-websites/navigation/paths';

const initialChartConfigIndex = 0;

export default function AlertConfigDialog({ onClose, alertConfig, editMode, startWithSimpleMode }) {
  const [selectedChartViewConfigIndex, setSelectedChartViewConfigIndex] = useState(initialChartConfigIndex);
  const [form, setForm] = useState(() => alertFormDefinition(alertConfig, editMode));
  const updateForm = useSmartAlertFormSideEffects(form, setForm);
  const [isSaving, setIsSaving] = useState(false);
  const [messages, setMessages] = useState([]);
  const [isSimpleMode, setIsSimpleMode] = useState(startWithSimpleMode);

  const websiteLabel = useWebsiteLabel(form.get('websiteId')?.value);

  const getLinkToAlertConfig = useGetAlertConfigLink();
  const duplicateFrom = alertConfig?.duplicateFrom;
  const withTrackCreate = eumType => {
    createOrSaveAlert({
      form,
      setForm,
      getLinkToAlertConfig,
      onClose,
      editMode,
      setIsSaving,
      setMessages,
      toAlertConfig,
      isSimpleMode,
      eumType,
      duplicateFrom
    });
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
      withTrackCreate={() => withTrackCreate(eumType)}
      isSaving={isSaving}
      messages={messages}
      setIsSimpleMode={setIsSimpleMode}
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
    name: PropTypes.string,
    duplicateFrom: PropTypes.string
  }).isRequired,
  onClose: PropTypes.func.isRequired,
  editMode: PropTypes.bool,
  startWithSimpleMode: PropTypes.bool
};
