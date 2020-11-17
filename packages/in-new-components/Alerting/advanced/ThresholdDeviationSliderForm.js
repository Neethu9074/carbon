import PropTypes from 'prop-types';
import React from 'react';

import ThresholdConditionFormGroup from 'in-new-components/Alerting/advanced/ThresholdConditionFormGroup';
import { DebouncedSensitivitySlider } from 'in-new-components/Alerting/advanced/SensitivitySlider';
import { getFormValueOrDefault } from 'in-new-components/Alerting/advanced/thresholdFormHelper';
import { getTrackingObject } from 'in-new-components/Alerting/trackingHelpers';

export function ThresholdDeviationSliderForm({ form, onChange, trackChange, defaultValue }) {
  return (
    <ThresholdConditionFormGroup iconType="lib_threshold" label="Sensitivity">
      <DebouncedSensitivitySlider
        value={getFormValueOrDefault(form.get('threshold'), 'deviationFactor', '')}
        defaultValue={defaultValue}
        onChange={value => {
          onChange(['threshold', 'deviationFactor'], f => f.setValue(value).setTouched(true));
          trackChange(getTrackingObject(form, { value }));
        }}
      />
    </ThresholdConditionFormGroup>
  );
}

ThresholdDeviationSliderForm.propTypes = {
  form: PropTypes.object.isRequired,
  onChange: PropTypes.func.isRequired,
  defaultValue: PropTypes.number.isRequired,
  trackChange: PropTypes.func.isRequired
};
