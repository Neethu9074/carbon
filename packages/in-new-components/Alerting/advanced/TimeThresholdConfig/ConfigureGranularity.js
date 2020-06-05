import PropTypes from 'prop-types';
import React from 'react';

import AlertThresholdConfigItemContainer from 'in-new-components/Alerting/advanced/TimeThresholdConfig/AlertThresholdConfigItemContainer';
import { minutesToMillis } from 'in-new-components/Alerting/utils/formatUtils';
import RestrictedSlider from 'in-new-components/Slider/RestrictedSlider';

export default function ConfigureGranularity({ onChange, granularity }) {
  const marks = [
    {
      value: 1,
      label: '1 min'
    },
    {
      value: 5,
      label: '5 min'
    },
    {
      value: 10,
      label: '10 min'
    },
    {
      value: 30,
      label: '30 min'
    }
  ];
  return (
    <AlertThresholdConfigItemContainer noIcon>
      <label>Evaluation Window Size</label>
      <RestrictedSlider
        marks={marks}
        max={marks[marks.length - 1].value}
        min={0}
        value={marks.find((i => minutesToMillis(i.value) === granularity) ?? marks[2]).value}
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
