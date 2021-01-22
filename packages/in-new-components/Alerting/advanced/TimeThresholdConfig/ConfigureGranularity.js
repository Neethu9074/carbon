/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import PropTypes from 'prop-types';
import { t } from 'in-i18n';
import React from 'react';

import AlertThresholdConfigItemContainer from 'in-new-components/Alerting/advanced/TimeThresholdConfig/AlertThresholdConfigItemContainer';
import DebouncedRestrictedSlider from 'in-new-components/Slider/DebouncedRestrictedSlider';
import { minutes } from 'in-services/time';

const marks = Object.freeze(
  [5, 10, 15, 20, 30].map(min => ({
    value: min,
    label: `${min} min`,
    millis: minutes.toMillis(min)
  }))
);

export default function ConfigureGranularity({ onChange, granularity }) {
  const currentValue = marks.find((i => i.millis === granularity) ?? marks[1]).value;
  return (
    <AlertThresholdConfigItemContainer noIcon>
      <label>{t('in-new-components:alerting.advanced.timeThresholdConfigEvaluationGranularity')}</label>
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
  granularity: PropTypes.number.isRequired
};
