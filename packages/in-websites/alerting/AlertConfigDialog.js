import { createLogger } from 'instalog';
import React, { useState } from 'react';
import PropTypes from 'prop-types';

import {
  chartViewConfigs,
  createTimeConfigForWindowSize,
  getIndexOfTimeConfig
} from 'in-new-components/Alerting/utils/timeConfigUtils';
import { AlertConfigDialogWithThreshold } from 'in-websites/alerting/alertConfigDialogWithThreshold/AlertConfigDialogWithThreshold';
import { createAlertConfig, updateAlertConfig } from 'in-websites/api/websiteAlertConfig';
import alertFormDefinition from 'in-websites/alerting/form/alertDialogFormDefinition';
import toAlertConfig from 'in-websites/alerting/alertConfigUtil';

const logger = createLogger('in-websites/alerting/AlertDialog');
const initialTimeConfig = 0;

export default function AlertConfigDialog({ onClose, formData, websiteLabel, editMode }) {
  const [granularity, setGranularity] = useState(chartViewConfigs[initialTimeConfig].granularity);
  const [timeConfig, setTimeConfig] = useState(() => createTimeConfigForWindowSize(chartViewConfigs[0].windowSize));
  const [calculateThresholdOnBackend, setCalculateThresholdOnBackend] = useState(false);
  const [form, setForm] = useState(() => alertFormDefinition(formData));
  const [isSaving, setIsSaving] = useState(false);

  return (
    <AlertConfigDialogWithThreshold
      updateForm={setForm}
      form={form}
      onChange={createOnChange(setForm, form)}
      onTimeConfigChange={({ windowSize, granularity }) => {
        setTimeConfig(createTimeConfigForWindowSize(windowSize));
        setGranularity(granularity);
        setForm(form.updateIn(['hiddenFields', 'calculateThresholdOnBackend'], f => f.setValue(true)));
      }}
      indexInitialSelectedTimeConfig={getIndexOfTimeConfig(timeConfig)}
      onClose={onClose}
      onCreate={() => createAlert(form, setForm, onClose, editMode, setIsSaving)}
      timeConfig={timeConfig}
      websiteLabel={websiteLabel}
      editMode={editMode}
      granularity={granularity}
      calculateThresholdOnBackend={calculateThresholdOnBackend}
      doCalculateThresholdOnBackend={load => setCalculateThresholdOnBackend(load)}
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

function createAlert(form, setForm, onClose, editMode, setIsSaving) {
  setIsSaving(true);

  if (!form.hierarchyValid) {
    setForm(form.setTouched(true, { recurse: true }));
    return;
  }

  const websiteAlertConfig = toAlertConfig(form);

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
