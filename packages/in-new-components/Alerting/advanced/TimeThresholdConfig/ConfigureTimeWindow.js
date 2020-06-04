import PropTypes from 'prop-types';
import React from 'react';

import AlertThresholdConfigItemContainer from 'in-new-components/Alerting/advanced/TimeThresholdConfig/AlertThresholdConfigItemContainer';
import {
  timeThresholdTypes,
  conditionPersistenceTimes,
  tenMinutesConditionTime
} from 'in-new-components/Alerting/advanced/TimeThresholdConfig/formData';
import RestrictedSlider from 'in-new-components/Slider/RestrictedSlider';

export default function ConfigureTimeWindow({ onChange, timeThresholdType, granularity, timeThresholdTimeWindow }) {
  const conditionPersistenceTimeForType =
    timeThresholdType === timeThresholdTypes.userImpactOfViolationsInSequence
      ? [tenMinutesConditionTime]
      : conditionPersistenceTimes;

  // reuse existing time definitions:
  const marks = conditionPersistenceTimeForType
    .map(({ value }) => ({
      value,
      label: `${value / granularity}`
    }))
    .filter(mark => mark.value / granularity <= 12)
    .filter(mark => mark.value / granularity >= 1);

  return (
    <AlertThresholdConfigItemContainer iconType="lib_datetime_timerange">
      <label>Number of consequent violations:</label>
      <RestrictedSlider
        onChange={value => onChange(value)}
        value={timeThresholdTimeWindow}
        marks={marks}
        max={marks[marks.length - 1].value}
        min={marks[0].value}
        valueLabelFormat={value => Math.round(value / 60000) + ' min.'}
        valueLabelDisplay="auto"
      />
    </AlertThresholdConfigItemContainer>
  );
}

ConfigureTimeWindow.propTypes = {
  onChange: PropTypes.func,
  timeThresholdTimeWindow: PropTypes.number.isRequired,
  granularity: PropTypes.number.isRequired,
  timeThresholdType: PropTypes.string.isRequired
};
