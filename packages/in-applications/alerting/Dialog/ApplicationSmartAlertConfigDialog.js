import React, { useState } from 'react';
import PropTypes from 'prop-types';

import ApplicationAdvancedModeContainer from 'in-applications/alerting/advancedMode/ApplicationAdvancedModeContainer';
import { alertingDialogChartTimeframe, alertingMetricsGranularity } from 'in-websites/eum-alerting/constants';
import { createApplicationSmartAlertForm } from 'in-applications/alerting/form/applicationSmartAlertForm';
import AlertConfigDialogPresenter from 'in-new-components/Alerting/AlertConfigDialogPresenter';

const timeConfig = {
  to: null,
  focusedMoment: null,
  windowSize: alertingDialogChartTimeframe,
  autoRefresh: false
};

export default function ApplicationSmartAlertConfigDialog({ onClose, formData, editMode }) {
  const [form, setForm] = useState(createApplicationSmartAlertForm(formData));

  const onCreate = () => {};

  return (
    <AlertConfigDialogPresenter
      editMode={editMode}
      form={form}
      granularity={alertingMetricsGranularity}
      onChange={(path, fn) => setForm(form.updateIn(path, fn))}
      onClose={onClose}
      renderAdvancedModeComponent={ApplicationAdvancedModeContainer}
      renderSimpleModeComponent={() => null}
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

ApplicationSmartAlertConfigDialog.propTypes = {
  formData: PropTypes.object.isRequired,
  onClose: PropTypes.func.isRequired,
  editMode: PropTypes.bool
};
