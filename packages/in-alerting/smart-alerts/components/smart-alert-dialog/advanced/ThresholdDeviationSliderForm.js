/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import PropTypes from 'prop-types';
import React from 'react';

import ThresholdConditionFormGroup from 'in-alerting/smart-alerts/components/smart-alert-dialog/advanced/ThresholdConditionFormGroup';
import { DebouncedSensitivitySlider } from 'in-alerting/smart-alerts/components/smart-alert-dialog/advanced/SensitivitySlider';
import { getFormValueOrDefault } from 'in-alerting/smart-alerts/components/smart-alert-dialog/advanced/thresholdFormHelper';
import { getTrackingObject } from 'in-alerting/smart-alerts/components/smart-alert-dialog/trackingHelpers';
import { t } from 'in-i18n';

export function ThresholdDeviationSliderForm({ form, onChange, trackChange, defaultValue }) {
  return (
    <ThresholdConditionFormGroup
      iconType="lib_threshold"
      label={t('in-alerting:smartAlerts.components.smartAlertDialog.labelSensitivity')}
    >
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
