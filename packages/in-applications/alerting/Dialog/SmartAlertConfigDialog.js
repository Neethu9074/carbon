import React, { useState } from 'react';
import PropTypes from 'prop-types';

import { alertingDialogChartTimeframe, alertingMetricsGranularity } from 'in-websites/alerting/constants';
import AlertConfigDialogPresenter from 'in-new-components/Alerting/AlertConfigDialogPresenter';
import AdvancedModeContainer from 'in-applications/alerting/advanced/AdvancedModeContainer';
import { CreateSmartAlertForm } from 'in-applications/alerting/form/smartAlertForm';

const timeConfig = {
  to: null,
  focusedMoment: null,
  windowSize: alertingDialogChartTimeframe,
  autoRefresh: false
};

export default function SmartAlertConfigDialog({ onClose, formData, editMode }) {
  const [form, setForm] = useState(CreateSmartAlertForm(formData));

  const onCreate = () => {};

  return (
    <AlertConfigDialogPresenter
      editMode={editMode}
      form={form}
      updateForm={setForm}
      granularity={alertingMetricsGranularity}
      onChange={(path, fn) => setForm(form.updateIn(path, fn))}
      onClose={onClose}
      advancedModeElement={AdvancedModeContainer}
      simpleModeElement={() => null}
      setForm={setForm}
      timeConfig={timeConfig}
      withTrackClose={() => {
        onClose();
      }}
      trackModeSwitch={() => {}}
      withTrackCreate={() => {
        onCreate();
      }}
    />
  );
}

SmartAlertConfigDialog.propTypes = {
  formData: PropTypes.object.isRequired,
  onClose: PropTypes.func.isRequired,
  editMode: PropTypes.bool
};
