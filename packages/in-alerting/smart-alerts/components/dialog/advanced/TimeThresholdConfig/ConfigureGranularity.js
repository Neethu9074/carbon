/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import PropTypes from 'prop-types';
import React from 'react';

import AlertThresholdConfigItemContainer from 'in-alerting/smart-alerts/components/dialog/advanced/TimeThresholdConfig/AlertThresholdConfigItemContainer';
import DebouncedRestrictedSlider from 'in-components/Slider/DebouncedRestrictedSlider';
import { ADAPTIVE_BASELINE } from 'in-alerting/smart-alerts/data/thresholdTypes';
import { minutes } from 'in-services/time';
import { t } from 'in-i18n';

const defaultAllowedGranularity = [5, 10, 15, 20, 30];
const adaptiveBaselineAllowedGranularity = [20, 30];

function getMarksForThresholdType(thresholdType) {
  const allowedGranularities =
    thresholdType === ADAPTIVE_BASELINE ? adaptiveBaselineAllowedGranularity : defaultAllowedGranularity;

  return allowedGranularities.map(min => ({
    value: min,
    label: `${min} min`,
    millis: minutes.toMillis(min)
  }));
}

function getDefaultMark(marks, thresholdType) {
  return thresholdType === ADAPTIVE_BASELINE ? marks[0] : marks[1];
}

export default function ConfigureGranularity({ onChange, granularity, thresholdType }) {
  const marks = getMarksForThresholdType(thresholdType);
  const currentValue = marks.find((i => i.millis === granularity) ?? getDefaultMark(marks, thresholdType)).value;

  return (
    <AlertThresholdConfigItemContainer noIcon>
      <label>{t('in-alerting:smartAlerts.components.smartAlertDialog.timeThresholdConfigEvaluationGranularity')}</label>
      <DebouncedRestrictedSlider
        marks={marks}
        max={marks[marks.length - 1].value}
        min={0}
        value={currentValue}
        onChange={value => {
          onChange(minutes.toMillis(value));
        }}
        valueLabelDisplay="off"
      />
    </AlertThresholdConfigItemContainer>
  );
}

ConfigureGranularity.propTypes = {
  onChange: PropTypes.func,
  granularity: PropTypes.number.isRequired,
  thresholdType: PropTypes.string
};
