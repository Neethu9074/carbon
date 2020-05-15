import PropTypes from 'prop-types';
import React from 'react';

import ConfigureTimeWindow from 'in-new-components/Alerting/advanced/TimeThresholdConfig/ConfigureTimeWindow';
import ConfigureViolations from 'in-new-components/Alerting/advanced/TimeThresholdConfig/ConfigureViolations';
import ConfigureUserImpact from 'in-new-components/Alerting/advanced/TimeThresholdConfig/ConfigureUserImpact';
import { timeThresholdTypes } from 'in-new-components/Alerting/advanced/TimeThresholdConfig/formData';

import locals from './TimeThresholdConfig.mless';

const violationGranularity = 10 * 60 * 1000;

export default function ConfigureAlertingThreshold({ form, onChange, updateForm }) {
  const { violationsInPeriod, userImpactOfViolationsInSequence } = timeThresholdTypes;
  const timeThresholdForm = form.get('timeThreshold');
  const timeThresholdType = timeThresholdForm.get('type').value;
  const timeThresholdTimeWindow = timeThresholdForm.get('timeWindow').value;
  const timeThresholdViolations = timeThresholdForm.get('violations')?.value;

  return (
    <div className={locals.alertThresholdConfigContainer}>
      <ConfigureTimeWindow
        onChange={onChangeTimeWindow}
        timeThresholdTimeWindow={timeThresholdTimeWindow}
        timeThresholdType={timeThresholdType}
      />
      {timeThresholdType === violationsInPeriod && (
        <ConfigureViolations
          onChange={onChange}
          timeThresholdTimeWindow={timeThresholdTimeWindow}
          timeThresholdViolations={timeThresholdViolations.toString()}
          violationGranularity={violationGranularity}
        />
      )}
      {timeThresholdType === userImpactOfViolationsInSequence && (
        <ConfigureUserImpact form={form} onChange={onChange} updateForm={updateForm} />
      )}
    </div>
  );

  function onChangeTimeWindow(timeWindowValue) {
    let updatedForm = timeThresholdForm.updateIn(['timeWindow'], f => f.setValue(timeWindowValue).setTouched(true));
    if (timeThresholdType === violationsInPeriod) {
      updatedForm = updatedForm.updateIn(['violations'], f => f.setValue(1).setTouched(true));
    }
    updateForm(form.put('timeThreshold', updatedForm));
  }
}

ConfigureAlertingThreshold.propTypes = {
  form: PropTypes.object.isRequired,
  onChange: PropTypes.func.isRequired,
  updateForm: PropTypes.func.isRequired
};
