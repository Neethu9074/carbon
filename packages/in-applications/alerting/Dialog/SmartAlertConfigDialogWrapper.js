import React, { useState } from 'react';
import { createLogger } from 'instalog';
import PropTypes from 'prop-types';

import {
  alertingDialogChartTimeframe,
  alertingMetricsGranularity as granularity
} from 'in-applications/alerting/constants';
import { createAlertConfig, updateAlertConfig } from 'in-applications/api/applicationAlertConfig';
import AdvancedModeContainer from 'in-applications/alerting/advanced/AdvancedModeContainer';
import SmartAlertConfigDialog from 'in-applications/alerting/Dialog/SmartAlertConfigDialog';
import { createSmartAlertForm } from 'in-applications/alerting/form/smartAlertForm';

const logger = createLogger('in-applications/alerting/Dialog/SmartAlertConfigDialogWrapper');

const timeConfig = {
  to: null,
  focusedMoment: null,
  windowSize: alertingDialogChartTimeframe,
  autoRefresh: false
};

export default function SmartAlertConfigDialogWrapper({ onClose, editMode, formData }) {
  const [form, setForm] = useState(() => createSmartAlertForm(formData));
  const [isSaving, setIsSaving] = useState(false);

  return (
    <SmartAlertConfigDialog
      editMode={editMode}
      form={form}
      updateForm={setForm}
      granularity={granularity}
      onChange={(path, fn) => setForm(form.updateIn(path, fn))}
      advancedModeElement={AdvancedModeContainer}
      simpleModeElement={() => null}
      setForm={setForm}
      timeConfig={timeConfig}
      trackModeSwitch={() => {}}
      withTrackClose={() => {
        onClose();
      }}
      withTrackCreate={() => createAlert({ form, setForm, onClose, editMode, setIsSaving })}
      isSaving={isSaving}
    />
  );
}

SmartAlertConfigDialogWrapper.propTypes = {
  editMode: PropTypes.bool,
  formData: PropTypes.shape({
    name: PropTypes.string.isRequired,
    applicationId: PropTypes.string.isRequired,
    tagFilters: PropTypes.array,
    calculateThresholdOnBackend: PropTypes.bool
  }).isRequired,
  onClose: PropTypes.func.isRequired
};

function createAlert({ form, setForm, onClose, editMode, setIsSaving }) {
  setIsSaving(true);

  if (!form.hierarchyValid) {
    setForm(form.setTouched(true, { recurse: true }));
    setIsSaving(false);
    return;
  }

  const alertConfig = form.remove('hiddenFields').toJS();

  if (alertConfig.threshold.type.startsWith('historicBaseline.')) {
    alertConfig.threshold.type = 'historicBaseline';
  }

  if (editMode) {
    updateAlertConfig(alertConfig, form.get('id').value).once(
      () => onClose(),
      error => {
        logger.error(`failed to update alertConfig: ${alertConfig} ${error.message}`, error);
        setIsSaving(false);
      }
    );
  } else {
    createAlertConfig(alertConfig).once(
      () => onClose(),
      error => {
        logger.error(`failed to save alertConfig: ${alertConfig} ${error.message}`, error);
        setIsSaving(false);
      }
    );
  }
}
