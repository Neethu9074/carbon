import PropTypes from 'prop-types';
import React from 'react';

import AlertThresholdConfigItemContainer from 'in-new-components/Alerting/advanced/TimeThresholdConfig/AlertThresholdConfigItemContainer';
import DebouncedRestrictedSlider from 'in-new-components/Slider/DebouncedRestrictedSlider';
import { minutesToMillis } from 'in-new-components/Alerting/utils/formatUtils';

const marks = Object.freeze(
  [5, 10, 15, 20, 30].map(min => ({
    value: min,
    label: `${min} min`,
    millis: minutesToMillis(min)
  }))
);

export default function ConfigureGranularity({ onChange, granularity }) {
  const currentValue = marks.find((i => i.millis === granularity) ?? marks[1]).value;
  return (
    <AlertThresholdConfigItemContainer noIcon>
      <label>Evaluation Granularity</label>
      <DebouncedRestrictedSlider
        marks={marks}
        max={marks[marks.length - 1].value}
        min={0}
        value={currentValue}
        onChange={value => {
          onChange(minutesToMillis(value));
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
