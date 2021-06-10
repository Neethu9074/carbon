/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import PropTypes from 'prop-types';
import React from 'react';

import AlertThresholdConfigItemContainer from 'in-alerting/smart-alerts/components/smart-alert-dialog/advanced/TimeThresholdConfig/AlertThresholdConfigItemContainer';
import DebouncedDistinctSlider from 'in-components/Slider/DebouncedDistinctSlider';
import { t } from 'in-i18n';

export default function ConfigureViolations({ label, onChange, violations, maxViolations }) {
  return (
    <AlertThresholdConfigItemContainer noIcon>
      <label>{label}</label>
      <DebouncedDistinctSlider
        value={violations}
        marks={Array.from(Array(maxViolations).fill(0), (x, i) => ({
          value: i + 1,
          label: `${i + 1}`
        }))}
        min={1}
        max={maxViolations}
        disabled={maxViolations <= 1}
        onChange={onChange}
        valueLabelDisplay={t('in-alerting:smartAlerts.components.smartAlertDialog.timeThresholdConfigOff')}
      />
    </AlertThresholdConfigItemContainer>
  );
}

ConfigureViolations.propTypes = {
  label: PropTypes.string.isRequired,
  onChange: PropTypes.func,
  violations: PropTypes.number.isRequired,
  maxViolations: PropTypes.number.isRequired
};
