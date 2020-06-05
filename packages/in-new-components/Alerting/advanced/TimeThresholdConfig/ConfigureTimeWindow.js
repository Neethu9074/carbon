import PropTypes from 'prop-types';
import React from 'react';

import AlertThresholdConfigItemContainer from 'in-new-components/Alerting/advanced/TimeThresholdConfig/AlertThresholdConfigItemContainer';
import { timeThresholdTypes } from 'in-new-components/Alerting/advanced/TimeThresholdConfig/formData';
import { minutesToMillis } from 'in-new-components/Alerting/utils/formatUtils';
import RestrictedSlider from 'in-new-components/Slider/RestrictedSlider';

const consecutiveViolationsOptions = Object.freeze([1, 2, 3, 6, 9, 12]);
const tenMinutesConditionTime = Object.freeze({ value: minutesToMillis(10), label: '10min' });

export default function ConfigureTimeWindow({ onChange, timeThresholdType, granularity, timeThresholdTimeWindow }) {
  const marks =
    timeThresholdType === timeThresholdTypes.userImpactOfViolationsInSequence
      ? [tenMinutesConditionTime]
      : createMarks(granularity);

  return (
    <AlertThresholdConfigItemContainer noIcon>
      <label>Number of consecutive violations</label>
      <RestrictedSlider
        onChange={value => onChange(value)}
        value={timeThresholdTimeWindow}
        marks={createMarks(granularity)}
        max={marks[marks.length - 1].value}
        min={marks[0].value}
        valueLabelFormat={value => Math.round(value / 60000) + ' min'}
        valueLabelDisplay="auto"
      />
    </AlertThresholdConfigItemContainer>
  );
}

function createMarks(granularity) {
  return consecutiveViolationsOptions.map(optionViolations => {
    return {
      value: granularity * optionViolations,
      label: optionViolations
    };
  });
}

ConfigureTimeWindow.propTypes = {
  onChange: PropTypes.func,
  timeThresholdTimeWindow: PropTypes.number.isRequired,
  granularity: PropTypes.number.isRequired,
  timeThresholdType: PropTypes.string.isRequired
};
