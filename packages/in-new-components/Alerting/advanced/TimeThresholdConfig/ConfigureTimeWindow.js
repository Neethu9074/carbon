import PropTypes from 'prop-types';
import React from 'react';

import AlertThresholdConfigItemContainer from 'in-new-components/Alerting/advanced/TimeThresholdConfig/AlertThresholdConfigItemContainer';
import DebouncedDistinctSlider from 'in-new-components/Slider/DebouncedDistinctSlider';

const marks = Object.freeze(
  [1, 3, 6, 9, 12].map(num => ({
    value: num,
    label: `${num}`
  }))
);

export default function ConfigureTimeWindow({ label, onChange, granularity, timeThresholdTimeWindow }) {
  return (
    <AlertThresholdConfigItemContainer noIcon>
      <label>{label}</label>
      <DebouncedDistinctSlider
        onChange={value => onChange(value * granularity)}
        value={timeThresholdTimeWindow / granularity}
        marks={marks}
        max={12}
        min={1}
        step={1}
        valueLabelFormat={value => Math.round((value * granularity) / 60000) + ' min'}
        valueLabelDisplay="auto"
      />
    </AlertThresholdConfigItemContainer>
  );
}

ConfigureTimeWindow.propTypes = {
  label: PropTypes.string.isRequired,
  onChange: PropTypes.func,
  timeThresholdTimeWindow: PropTypes.number.isRequired,
  granularity: PropTypes.number.isRequired
};
